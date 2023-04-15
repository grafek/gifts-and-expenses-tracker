import { ChartSkeleton } from "@/components/Loaders.server";

function Loading() {
  return (
    <div className="center">
      <ChartSkeleton />
    </div>
  );
}

export default Loading;
