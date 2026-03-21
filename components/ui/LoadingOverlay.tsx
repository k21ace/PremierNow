export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3">
        <span className="text-6xl select-none animate-soccer-bounce">⚽</span>
        <p className="text-sm text-gray-400 font-medium tracking-wide">読み込み中...</p>
      </div>
    </div>
  );
}
