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
      className="m-auto flex min-h-[50vh] animate-pulse flex-col justify-between rounded border border-gray-700 p-4 shadow sm:w-2/3 md:p-6 xl:w-1/3"
    >
      <div className="flex  justify-between gap-4 py-2">
        <div className="h-2.5 w-32 rounded-full bg-gray-700" />
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="h-2.5 w-12 rounded-full bg-gray-700" />
          <div className="h-2.5 w-12 rounded-full bg-gray-700" />
        </div>
      </div>
      <div className="flex items-baseline gap-4">
        <div className="h-28 w-full rounded-t-lg bg-gray-700" />
        <div className="h-56 w-full rounded-t-lg bg-gray-700" />
        <div className="h-28 w-full rounded-t-lg bg-gray-700" />
        <div className="h-44 w-full rounded-t-lg bg-gray-700" />
        <div className="h-28 w-full rounded-t-lg bg-gray-700" />
        <div className="h-48 w-full rounded-t-lg bg-gray-700" />
        <div className="h-28 w-full rounded-t-lg bg-gray-700" />
        <div className="h-48 w-full rounded-t-lg bg-gray-700" />
        <div className="h-28 w-full rounded-t-lg bg-gray-700" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const AuthSkeleton = () => {
  return (
    <div
      role="status"
      className="flex h-[40vh] w-full animate-pulse flex-col justify-between gap-8 rounded border  border-gray-700 py-3 shadow sm:w-2/3 md:p-6 xl:w-1/3"
    >
      <div className="mx-auto flex h-full w-1/2 flex-col justify-center gap-6 rounded-sm px-4">
        <div className="h-6 w-full rounded-full bg-gray-700" />
        <div className="h-6 w-full rounded-full bg-gray-700" />
        <div className="mt-2 h-6 w-full rounded-full border border-gray-700" />
      </div>
      <div className="flex items-center justify-between gap-4 px-4">
        <div className="h-[1px] flex-1 bg-gray-800"></div>
        <span className="text-sm uppercase text-gray-700">or</span>
        <div className="h-[1px] flex-1 bg-gray-800"></div>
      </div>
      <div className="mx-auto h-6 w-1/2 rounded-full bg-gray-700" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
