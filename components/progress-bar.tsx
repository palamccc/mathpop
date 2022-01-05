export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-1 bg-blue-200">
      <div className="h-1 bg-blue-600" style={{ width: `${Math.round(percent)}%` }}></div>
    </div>
  );
}
