"use client";

export function LoadingSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="divide-y divide-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-4 py-4 flex items-center gap-4 animate-pulse">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-100 rounded-md w-3/5" />
              <div className="h-3 bg-zinc-100 rounded-md w-2/5" />
            </div>
            <div className="h-5 w-16 bg-zinc-100 rounded-md hidden md:block" />
            <div className="h-5 w-20 bg-zinc-100 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
