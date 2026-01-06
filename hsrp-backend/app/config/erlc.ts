// ERLC API Configuration
export const ERLC_API_BASE_URL = "https://api.policeroleplay.community/v1";

// Server key should be stored in environment variable
// Add ERLC_SERVER_KEY to your .env.local file
export const getServerKey = () => process.env.ERLC_SERVER_KEY || "";

// API Types
export interface ServerStatus {
  Name: string;
  OwnerId: number;
  CoOwnerIds: number[];
  CurrentPlayers: number;
  MaxPlayers: number;
  JoinKey: string;
  AccVerifiedReq: string;
  TeamBalance: boolean;
}

export interface Player {
  Player: string; // "PlayerName:Id"
  Permission: "Normal" | "Server Administrator" | "Server Owner" | "Server Moderator";
  Callsign?: string;
  Team: string;
}

export interface JoinLog {
  Join: boolean;
  Timestamp: number;
  Player: string; // "PlayerName:Id"
}

export interface KillLog {
  Killed: string; // "PlayerName:Id"
  Timestamp: number;
  Killer: string; // "PlayerName:Id"
}

export interface CommandLog {
  Player: string; // "PlayerName:Id"
  Timestamp: number;
  Command: string;
}

export interface ModCall {
  Caller: string; // "PlayerName:Id"
  Moderator?: string; // "PlayerName:Id" - only if responded
  Timestamp: number;
}

export interface ServerStaff {
  CoOwners: number[];
  Admins: Record<string, string>; // { "userId": "username" }
  Mods: Record<string, string>; // { "userId": "username" }
}

export interface Vehicle {
  Texture: string;
  Name: string;
  Owner: string;
}

export interface Bans {
  [playerId: string]: string; // { "playerId": "playerName" }
}

// Helper to parse "PlayerName:Id" format
export function parsePlayer(playerString: string): { name: string; id: string } {
  const parts = playerString.split(":");
  return {
    name: parts[0] || "Unknown",
    id: parts[1] || "0",
  };
}

// Helper to format timestamp
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}
