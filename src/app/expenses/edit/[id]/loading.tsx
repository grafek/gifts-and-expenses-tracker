import { FormSkeleton } from "@/components/Loaders.server";

export default function Loading() {
  return (
    <section className="center">
      <FormSkeleton />
    </section>
  );
}
