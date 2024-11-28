'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import AuthButton from '@/components/AuthButton';

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                Create Engaging AI Videos with Virtual Influencers
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                Transform your content into professional videos using AI-powered virtual influencers.
                Engage your audience like never before.
              </p>
              <div className="mt-8 flex gap-x-4 sm:justify-center">
                <AuthButton
                  type="signup"
                  className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                />
                <AuthButton
                  type="signin"
                  className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Create Faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to create AI videos
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform provides all the tools you need to create professional AI-powered videos
              with virtual influencers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
