import { getAuthenticatedUser } from "../lib/auth";
import Sidebar from "../components/Sidebar";

export default async function Dashboard() {
  const user = await getAuthenticatedUser("/dashboard");

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar user={user} />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Welcome, {user.username}!</h1>
        <p className="text-zinc-400">
          You have successfully logged in to HSRP Connect.
        </p>
      </main>
    </div>
  );
}
