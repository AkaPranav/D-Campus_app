'use client';

import React from 'react';

interface SkeletonLayoutProps {
  type?: 'attendance' | 'timetable' | 'assignments';
}

export default function SkeletonLayout({ type = 'attendance' }: SkeletonLayoutProps) {
  return (
    <div className="space-y-4 animate-pulse w-full">
      {/* Top Banner Skeleton - Authentic Retro Window */}
      <div className="retro-card overflow-hidden">
        <div className="retro-card-header py-1.5 px-3">
          <div className="flex items-center gap-1.5">
            <span className="retro-dot min" />
            <div className="skeleton-box h-3.5 w-24 rounded-sm" />
          </div>
          <div className="skeleton-box h-3.5 w-16 rounded-sm" />
        </div>

        <div className="p-4 space-y-3">
          {type === 'attendance' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Radial Gauge Shimmer */}
              <div className="md:col-span-5 flex flex-col items-center justify-center py-2 space-y-3">
                <div className="skeleton-box w-32 h-32 rounded-full border-4 border-[#1b202b]" />
                <div className="grid grid-cols-2 gap-2 w-full pt-1">
                  <div className="skeleton-box h-8 rounded-sm" />
                  <div className="skeleton-box h-8 rounded-sm" />
                </div>
              </div>
              <div className="md:col-span-7 space-y-3">
                <div className="skeleton-box h-16 w-full rounded-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="skeleton-box h-12 rounded-sm" />
                  <div className="skeleton-box h-12 rounded-sm" />
                </div>
              </div>
            </div>
          ) : type === 'timetable' ? (
            <div className="space-y-2.5">
              {/* Day Pills Shimmer */}
              <div className="grid grid-cols-5 gap-1.5 md:gap-2.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton-box h-7 rounded-sm" />
                ))}
              </div>
              <div className="skeleton-box h-10 w-full rounded-sm" />
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Switcher Shimmer */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="skeleton-box h-8 flex-1 rounded-sm" />
                <div className="skeleton-box h-8 flex-1 rounded-sm" />
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                <div className="skeleton-box h-6 w-20 rounded-sm shrink-0" />
                <div className="skeleton-box h-6 w-24 rounded-sm shrink-0" />
                <div className="skeleton-box h-6 w-24 rounded-sm shrink-0" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* List Cards Skeletons */}
      <div className="space-y-2.5">
        <div className="skeleton-box h-3.5 w-32 rounded-sm ml-0.5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="retro-card overflow-hidden">
              <div className="retro-card-header py-1.5 px-3">
                <div className="skeleton-box h-3.5 w-20 rounded-sm" />
                <div className="skeleton-box h-3.5 w-12 rounded-sm" />
              </div>
              <div className="p-3 space-y-2">
                <div className="skeleton-box h-4 w-44 rounded-sm" />
                <div className="skeleton-box h-2.5 w-full rounded-none" />
                <div className="flex justify-between items-center pt-2 border-t border-[#2d3545]">
                  <div className="skeleton-box h-3 w-24 rounded-sm" />
                  <div className="skeleton-box h-4 w-20 rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
