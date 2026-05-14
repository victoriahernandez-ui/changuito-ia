'use client';

export default function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
          <div className="h-6 w-32 rounded-full bg-slate-200" />
          <div className="mt-6 space-y-4">
            <div className="h-4 w-3/4 rounded-full bg-slate-200" />
            <div className="h-32 rounded-[1.5rem] bg-slate-200" />
            <div className="grid gap-3">
              <div className="h-4 rounded-full bg-slate-200" />
              <div className="h-4 rounded-full bg-slate-200" />
            </div>
            <div className="h-12 rounded-2xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
