export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Nav skeleton */}
      <nav className="border-b border-white/[0.05] bg-black/40 h-14" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header skeleton */}
        <div className="space-y-6 animate-pulse">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-white/[0.05] rounded" />
              <div className="h-8 w-64 bg-white/[0.05] rounded" />
              <div className="h-4 w-40 bg-white/[0.04] rounded" />
            </div>
            <div className="h-14 w-32 bg-white/[0.04] rounded-xl" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white/[0.03] border border-white/[0.05] rounded-xl"
              />
            ))}
          </div>

          {/* Progress skeleton */}
          <div className="h-2 bg-white/[0.05] rounded-full" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/[0.06] rounded" />
                <div className="h-4 w-32 bg-white/[0.05] rounded" />
                <div className="h-1.5 bg-white/[0.04] rounded-full mt-3" />
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3 py-1">
                    <div className="h-4 w-4 bg-white/[0.05] rounded" />
                    <div
                      className="h-3 bg-white/[0.04] rounded"
                      style={{ width: `${60 + j * 10}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
