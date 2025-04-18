
import React from "react";

interface EventStatusBadgesProps {
  isLive: boolean;
  featured: boolean;
}

export default function EventStatusBadges({ isLive, featured }: EventStatusBadgesProps) {
  return (
    <div className="flex flex-col gap-1">
      {isLive && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          Live
        </span>
      )}
      {featured && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          Featured
        </span>
      )}
    </div>
  );
}
