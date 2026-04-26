import VendorDashboardClient from "./VendorDashboardClient";
import { requireRole } from "@/lib/auth/session";
import { getCachedVendorDashboard } from "@/lib/data/vendors";

export default async function VendorDashboard() {
  const user = await requireRole("VENDOR");
  const dashboardData = await getCachedVendorDashboard(user.id);

  return (
    <VendorDashboardClient
      projects={dashboardData?.projects ?? []}
      quotes={dashboardData?.quotes ?? []}
      vendor={dashboardData?.vendor ?? null}
    />
  );
}
