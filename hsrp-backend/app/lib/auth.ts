import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLevel, canAccessPage } from "../config/roles";

interface User {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  adminLevel: number;
  roles: string[];
}

export async function getAuthenticatedUser(requiredPage?: string): Promise<User> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("discord_user");

  if (!userCookie) {
    redirect("/");
  }

  const user: User = JSON.parse(userCookie.value);

  // Check page permission if specified
  if (requiredPage && !canAccessPage(user.adminLevel as AdminLevel, requiredPage)) {
    redirect("/dashboard?error=no_permission");
  }

  return user;
}

export function hasPermission(userAdminLevel: number, requiredLevel: AdminLevel): boolean {
  return userAdminLevel >= requiredLevel;
}
