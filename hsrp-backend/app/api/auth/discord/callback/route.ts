import { NextRequest, NextResponse } from "next/server";
import { GUILD_ID, getAdminLevelFromRoles, AdminLevel } from "@/app/config/roles";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL("/?error=not_configured", request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL("/?error=token_error", request.url));
    }

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL("/?error=user_error", request.url));
    }

    const userData = await userResponse.json();

    // Get guild member info to check roles
    const guildMemberResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    let adminLevel = AdminLevel.NONE;
    let roles: string[] = [];

    if (guildMemberResponse.ok) {
      const memberData = await guildMemberResponse.json();
      roles = memberData.roles || [];
      adminLevel = getAdminLevelFromRoles(roles);
    }

    // Check if user has at least Trainee Mod level
    if (adminLevel < AdminLevel.TRAINEE_MOD) {
      return NextResponse.redirect(new URL("/?error=no_permission", request.url));
    }

    // Redirect to dashboard with user data
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    
    // Set a cookie with user data including admin level
    response.cookies.set("discord_user", JSON.stringify({
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar,
      discriminator: userData.discriminator,
      adminLevel: adminLevel,
      roles: roles,
    }), {
      httpOnly: false, // Need to read on client for sidebar
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Discord OAuth error:", error);
    return NextResponse.redirect(new URL("/?error=oauth_error", request.url));
  }
}
