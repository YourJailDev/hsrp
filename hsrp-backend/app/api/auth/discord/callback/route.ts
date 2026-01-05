import { NextRequest, NextResponse } from "next/server";

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

    // For now, redirect to dashboard with user ID
    // In production, you'd want to create a session/JWT here
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    
    // Set a cookie with user data (in production, use proper session management)
    response.cookies.set("discord_user", JSON.stringify({
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar,
      discriminator: userData.discriminator,
    }), {
      httpOnly: true,
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
