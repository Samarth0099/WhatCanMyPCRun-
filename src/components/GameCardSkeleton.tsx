import React from 'react';

interface GameCardSkeletonProps {
  count?: number;
}

export const GameCardSkeleton: React.FC = () => {
  return (
    <div className="card-depth-3d rounded-2xl p-6 sm:p-7 flex flex-col justify-between select-none min-h-[350px] relative overflow-hidden bg-[#10141e] border border-white/[0.06]">
      {/* Top Editorial Metadata & Verdict Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="space-y-2 flex-1">
            {/* Studio · Year */}
            <div className="h-3 w-24 rounded skeleton-shimmer" />
            {/* Title */}
            <div className="h-6 w-3/4 rounded-md skeleton-shimmer" />
          </div>
          {/* Badge */}
          <div className="h-6 w-28 rounded-md skeleton-shimmer shrink-0" />
        </div>

        {/* Primary Metric: Big Tabular FPS Display */}
        <div className="my-6">
          <div className="flex items-baseline justify-between">
            <div className="space-y-2">
              <div className="h-3 w-32 rounded skeleton-shimmer" />
              <div className="h-9 w-44 rounded-md skeleton-shimmer" />
            </div>

            <div className="space-y-2 text-right">
              <div className="h-3 w-14 rounded skeleton-shimmer ml-auto" />
              <div className="h-5 w-20 rounded skeleton-shimmer ml-auto" />
            </div>
          </div>
        </div>

        {/* Telemetry & Compliance Strip */}
        <div className="pt-4 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-28 rounded skeleton-shimmer" />
            <div className="h-3.5 w-20 rounded skeleton-shimmer" />
          </div>

          <div className="flex items-center justify-between">
            <div className="h-3.5 w-24 rounded skeleton-shimmer" />
            <div className="h-3.5 w-16 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2">
        <div className="h-10 flex-1 rounded-xl skeleton-shimmer" />
        <div className="h-10 w-10 rounded-xl skeleton-shimmer shrink-0" />
      </div>
    </div>
  );
};

export const GameCardSkeletonGrid: React.FC<GameCardSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      {Array.from({ length: count }).map((_, index) => (
        <GameCardSkeleton key={index} />
      ))}
    </div>
  );
};
