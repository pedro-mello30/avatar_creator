import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { PlusIcon, VideoCameraIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default async function DashboardPage() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Quick Actions */}
            <div className="px-4 py-8 sm:px-0 flex gap-4">
              <Link
                href="/video/create"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create New Video
              </Link>
              <Link
                href="/avatars"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <UserCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Manage Avatars
              </Link>
            </div>

            {/* Recent Videos */}
            <div className="px-4 sm:px-0">
              <h2 className="text-lg font-medium text-gray-900">Recent Videos</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Empty state */}
                <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    No videos created yet
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
