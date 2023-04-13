import { ChartSkeleton } from "@/components/Loaders.server";

function Loading() {
  return (
    <div className="grid min-h-[calc(100vh-218px)] place-items-center">
      <ChartSkeleton />
    </div>
  );
}

export default Loading;
