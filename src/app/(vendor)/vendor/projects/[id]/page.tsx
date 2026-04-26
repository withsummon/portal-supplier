import { notFound } from "next/navigation";
import VendorProjectDetailClient from "./VendorProjectDetailClient";
import { getCachedVendorProjectDetail } from "@/lib/data/vendors";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VendorProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getCachedVendorProjectDetail(id);

  if (!project) {
    notFound();
  }

  return <VendorProjectDetailClient project={project} />;
}
