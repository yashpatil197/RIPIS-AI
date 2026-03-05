/**
 * ProgressIndicator - Animated progress bar with step markers and difficulty badge
 */

export default function ProgressIndicator({ current, total, complete, difficulty }) {
  const percentage = complete ? 100 : Math.round((current / total) * 100);

  const difficultyColors = {
    easy: { bg: "rgba(34, 197, 94, 0.15)", color: "#4ade80", label: "Easy" },
    medium: { bg: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", label: "Medium" },
    hard: { bg: "rgba(239, 68, 68, 0.15)", color: "#f87171", label: "Hard" },
  };

  const diff = difficultyColors[difficulty] || difficultyColors.easy;

  return (
    <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-700/50"
      style={{ background: "rgba(17, 24, 39, 0.9)", backdropFilter: "blur(12px)" }}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg animate-float">🤖</span>
          <h2 className="text-sm font-semibold text-white">
            {complete ? "Interview Complete" : "AI Technical Interview"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Difficulty badge */}
          {!complete && difficulty && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full transition-all"
              style={{ background: diff.bg, color: diff.color }}>
              {diff.label}
            </span>
          )}
          <span className="text-xs font-medium px-3 py-1 rounded-full"
            style={{
              background: complete ? "rgba(34, 197, 94, 0.15)" : "rgba(59, 130, 246, 0.15)",
              color: complete ? "#4ade80" : "#60a5fa",
            }}>
            {complete ? "✓ Done" : `Q${current} of ${total}`}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(55, 65, 81, 0.6)" }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background: complete
              ? "linear-gradient(90deg, #22c55e, #10b981)"
              : "linear-gradient(90deg, #3b82f6, #8b5cf6, #6366f1)",
          }}
        />
      </div>

      {/* Step dots with active animation */}
      <div className="flex justify-between mt-2 px-1">
        {Array.from({ length: total }, (_, i) => {
          const isActive = i === current - 1 && !complete;
          const isDone = i < current;
          return (
            <div key={i}
              className={`rounded-full transition-all duration-300 ${isActive ? "w-2.5 h-2.5 animate-pulse-glow" : "w-2 h-2"}`}
              style={{
                background: isDone
                  ? (complete ? "#22c55e" : "#3b82f6")
                  : isActive
                    ? "#8b5cf6"
                    : "rgba(55, 65, 81, 0.6)",
                transform: isActive ? "scale(1.3)" : "scale(1)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
