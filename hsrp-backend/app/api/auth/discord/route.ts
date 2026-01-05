import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Discord OAuth not configured" },
      { status: 500 }
    );
  }

  const scope = "identify guilds guilds.members.read";
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(discordAuthUrl);
}
