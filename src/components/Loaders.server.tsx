export const Spinner = () => {
  return (
    <div
      role="status"
      className="relative inline-block h-6 w-6 [&>div]:absolute  [&>div]:box-border [&>div]:block [&>div]:h-6 [&>div]:w-6 [&>div]:rounded-full [&>div]:border-[3px] [&>div]:border-transparent [&>div]:border-t-blue-600"
    >
      <div className="animate-[spin_1.3s_cubic-bezier(0.5,0,0.5,0.1)_infinite]" />
      <div className="animate-[spin_1.3s_cubic-bezier(0.5,0,0.5,0.1)_infinite_-450ms]" />
      <div className="animate-[spin_1.3s_cubic-bezier(0.5,0,0.5,0.1)_infinite_-300ms]" />
      <div className="animate-[spin_1.3s_cubic-bezier(0.5,0,0.5,0.1)_infinite_-150ms]" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className="grid min-h-[calc(100vh-218px)] place-items-center">
      <div
        role="status"
        className="relative inline-block h-12 w-12 [&>div]:absolute [&>div]:box-border [&>div]:block [&>div]:h-12 [&>div]:w-12 [&>div]:rounded-full [&>div]:border-[6px] [&>div]:border-transparent [&>div]:border-t-blue-600"
      >
        <div className="animate-[spin_1.3s_cubic-bezier(0.5,0,0.5,0.1)_infinite]" />
        <div className="animate-[spin_1.3s_cubic-bezier(0.5,0,0.5,0.1)_infinite_-450ms]" />
        <div className="animate-[spin_1.3s_cubic-bezier(0.5,0,0.5,0.1)_infinite_-300ms]" />
        <div className="animate-[spin_1.3s_cubic-bezier(0.5,0,0.5,0.1)_infinite_-150ms]" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div
      role="status"
      className="m-auto flex min-h-[50vh] w-1/2 animate-pulse flex-col justify-between rounded border border-gray-200 p-4 shadow dark:border-gray-700 md:p-6"
    >
      <div className="flex items-center justify-between py-2">
        <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-4">
          <div className="h-2.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-2.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="flex items-baseline space-x-6">
        <div className="h-28 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-56 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-28 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-44 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-28 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-48 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-28 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-48 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-28 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
