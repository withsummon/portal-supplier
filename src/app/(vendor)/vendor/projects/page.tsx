import ProjectMarketplaceClient from "./ProjectMarketplaceClient";
import { getCachedVendorProjectsMarketplace } from "@/lib/data/vendors";

export default async function VendorProjectsPage() {
  const projects = await getCachedVendorProjectsMarketplace();
  return <ProjectMarketplaceClient projects={projects} />;
}
