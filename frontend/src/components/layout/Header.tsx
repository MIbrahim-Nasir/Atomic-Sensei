"use client";

import Link from 'next/link';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 hidden sm:block">Dashboard</h1>
        
        <div className="flex items-center gap-4">
          {/* Basic notification icon without dropdown */}
          <Link href="/dashboard/notifications" className="relative">
            <BellIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          </Link>

          {/* Simple profile link without dropdown */}
          <Link href="/dashboard/profile" className="flex items-center gap-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <span className="hidden md:block text-sm font-medium text-gray-700">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}