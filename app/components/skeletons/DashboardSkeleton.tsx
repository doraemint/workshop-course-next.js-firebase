'use client';

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Skeleton */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Column Skeleton */}
            <main className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
              </div>
              {/* Summary Cards Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-28 bg-gray-200 rounded-lg"></div>
                <div className="h-28 bg-gray-200 rounded-lg"></div>
                <div className="h-28 bg-gray-200 rounded-lg"></div>
              </div>
              {/* Chart Skeleton */}
              <div className="h-80 bg-gray-200 rounded-lg"></div>
              {/* Transaction List Skeleton */}
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </main>

            {/* Right Sidebar Skeleton */}
            <aside className="lg:col-span-4 mt-6 lg:mt-0">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
