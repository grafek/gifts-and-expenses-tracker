import { TableSkeleton } from "@/components/Loaders.server";

export default function Loading() {
  return (
    <section className="center">
      <TableSkeleton />
    </section>
  );
}
