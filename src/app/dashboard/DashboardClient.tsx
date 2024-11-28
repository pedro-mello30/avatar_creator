import { auth } from "@clerk/nextjs";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const { userId } = auth();
  return <DashboardClient />;
}