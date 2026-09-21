export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-paper text-ink">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-ink" />
        <span className="font-mono text-xs tracking-wider text-reel">
          Memuat...
        </span>
      </div>
    </div>
  );
}
