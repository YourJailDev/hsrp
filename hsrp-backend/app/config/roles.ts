// Discord Guild ID for HSRP
export const GUILD_ID = "YOUR_DISCORD_SERVER_ID"; // Replace with your Discord server ID

// Admin levels - higher number = more permissions
export enum AdminLevel {
  NONE = 0,
  TRAINEE_MOD = 1,        // Trainee Mod - Staff Training only
  MODERATOR = 1442014281833910443,          // Moderator - Dashboard, Handbook, LOA, Server Management
  ADMINISTRATOR = 1442014929799352382,      // Administrator - Same as Moderator
  INTERNAL_AFFAIRS = 1442015630093062154,   // Internal Affairs - Same as Moderator
  MANAGEMENT = 1442016481331118240,         // Management - Full access
  DIRECTION_BOARD = 1442007891430215914,    // Direction Board - Full access
}

// Map Discord role IDs to admin levels
// Replace these with your actual Discord role IDs
export const ROLE_PERMISSIONS: Record<string, AdminLevel> = {
  "ROLE_ID_FOR_DIRECTION_BOARD": AdminLevel.DIRECTION_BOARD,     // Direction Board role ID
  "ROLE_ID_FOR_MANAGEMENT": AdminLevel.MANAGEMENT,               // Management role ID
  "ROLE_ID_FOR_INTERNAL_AFFAIRS": AdminLevel.INTERNAL_AFFAIRS,   // Internal Affairs role ID
  "ROLE_ID_FOR_ADMINISTRATOR": AdminLevel.ADMINISTRATOR,         // Administrator role ID
  "ROLE_ID_FOR_MODERATOR": AdminLevel.MODERATOR,                 // Moderator role ID
  "ROLE_ID_FOR_TRAINEE_MOD": AdminLevel.TRAINEE_MOD,             // Trainee Mod role ID
};

// Define which pages require which admin level
export const PAGE_PERMISSIONS: Record<string, AdminLevel> = {
  "/dashboard": AdminLevel.MODERATOR,
  "/staff-handbook": AdminLevel.MODERATOR,
  "/staff-training": AdminLevel.TRAINEE_MOD,
  "/loa": AdminLevel.MODERATOR,
  "/server-management": AdminLevel.MODERATOR,
};

// Navigation items with their required permissions
export const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard", requiredLevel: AdminLevel.MODERATOR },
  { name: "LOA", href: "/loa", icon: "loa", requiredLevel: AdminLevel.MODERATOR },
  { name: "Server Management", href: "/server-management", icon: "settings", requiredLevel: AdminLevel.MODERATOR },
  { name: "Staff Handbook", href: "/staff-handbook", icon: "handbook", requiredLevel: AdminLevel.MODERATOR },
  { name: "Staff Training", href: "/staff-training", icon: "training", requiredLevel: AdminLevel.TRAINEE_MOD },
];

// Helper function to get admin level from roles
export function getAdminLevelFromRoles(roleIds: string[]): AdminLevel {
  let highestLevel = AdminLevel.NONE;
  
  for (const roleId of roleIds) {
    const level = ROLE_PERMISSIONS[roleId];
    if (level !== undefined && level > highestLevel) {
      highestLevel = level;
    }
  }
  
  return highestLevel;
}

// Helper function to check if user can access a page
export function canAccessPage(adminLevel: AdminLevel, page: string): boolean {
  const requiredLevel = PAGE_PERMISSIONS[page];
  if (requiredLevel === undefined) {
    return true; // If page not in config, allow access
  }
  return adminLevel >= requiredLevel;
}

// Helper function to get admin level name
export function getAdminLevelName(level: AdminLevel): string {
  switch (level) {
    case AdminLevel.DIRECTION_BOARD:
      return "Direction Board";
    case AdminLevel.MANAGEMENT:
      return "Management";
    case AdminLevel.INTERNAL_AFFAIRS:
      return "Internal Affairs";
    case AdminLevel.ADMINISTRATOR:
      return "Administrator";
    case AdminLevel.MODERATOR:
      return "Moderator";
    case AdminLevel.TRAINEE_MOD:
      return "Trainee Mod";
    default:
      return "No Access";
  }
}
