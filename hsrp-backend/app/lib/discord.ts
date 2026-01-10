import { GUILD_ID } from "../config/roles";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function addDiscordRole(userId: string, roleId: string) {
    if (!BOT_TOKEN) {
        console.warn("DISCORD_BOT_TOKEN not found. Skipping role addition.");
        return;
    }

    try {
        const response = await fetch(
            `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}/roles/${roleId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bot ${BOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to add role ${roleId} to user ${userId}:`, error);
        }
    } catch (error) {
        console.error(`Error adding role ${roleId} to user ${userId}:`, error);
    }
}

export async function removeDiscordRole(userId: string, roleId: string) {
    if (!BOT_TOKEN) {
        console.warn("DISCORD_BOT_TOKEN not found. Skipping role removal.");
        return;
    }

    try {
        const response = await fetch(
            `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}/roles/${roleId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bot ${BOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to remove role ${roleId} from user ${userId}:`, error);
        }
    } catch (error) {
        console.error(`Error removing role ${roleId} from user ${userId}:`, error);
    }
}
