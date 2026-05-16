import { JobDetailPage } from "@/components/JobDetailPage";

export default function JobPage({ params }: { params: { id: string } }) {
  return (
    <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8">
      <JobDetailPage jobId={params.id} />
    </main>
  );
}
