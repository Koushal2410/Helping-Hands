export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
      <div className="skeleton h-5 w-2/3 rounded-lg" />
      <div className="skeleton h-4 w-full rounded-lg" />
      <div className="skeleton h-4 w-4/5 rounded-lg" />
      <div className="skeleton h-10 w-1/3 rounded-xl mt-6" />
    </div>
  );
}

export function AvatarSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
    </div>
  );
}

export function ImageSkeleton({ className = 'h-48' }) {
  return <div className={`skeleton w-full rounded-2xl ${className}`} />;
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-4 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  );
}
