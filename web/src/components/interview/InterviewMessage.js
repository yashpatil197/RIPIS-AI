/**
 * InterviewMessage - Chat bubble with avatar, animated entry, and analysis scores
 * Premium dark glassmorphism theme with micro-animations
 */

export default function InterviewMessage({ message }) {
  const isInterviewer = message.type === "interviewer";
  const isCandidate = message.type === "candidate";
  const isSystem = message.type === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 animate-scale-in">
        <div className="px-5 py-2 rounded-full text-sm font-medium"
          style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.15))", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isInterviewer ? "justify-start animate-slide-in-left" : "justify-end animate-slide-in-right"} mb-4`}>
      {isInterviewer && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm mr-3 mt-1 animate-pulse-glow"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
          🤖
        </div>
      )}

      <div className={`max-w-[75%] lg:max-w-[65%] px-4 py-3 rounded-2xl ${isInterviewer ? "rounded-tl-sm" : "rounded-tr-sm"
        }`}
        style={{
          background: isInterviewer
            ? "rgba(31, 41, 55, 0.7)"
            : "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.2))",
          border: isInterviewer
            ? "1px solid rgba(55, 65, 81, 0.5)"
            : "1px solid rgba(99,102,241,0.3)",
          backdropFilter: "blur(8px)",
        }}>
        {message.questionNumber && (
          <p className="text-[10px] font-medium mb-1.5 tracking-wider uppercase"
            style={{ color: "rgba(139,92,246,0.8)" }}>
            Question {message.questionNumber} of {message.totalQuestions}
          </p>
        )}

        <p className="text-sm leading-relaxed text-gray-200">{message.content}</p>

        {/* Animated Analysis scores */}
        {message.analysis && (
          <div className="mt-3 pt-3 animate-fade-in-up" style={{ borderTop: "1px solid rgba(75,85,99,0.3)", animationDelay: "0.3s" }}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Technical", value: message.analysis.technical_correctness, color: "#3b82f6" },
                { label: "Depth", value: message.analysis.depth_of_explanation, color: "#8b5cf6" },
                { label: "Clarity", value: message.analysis.clarity, color: "#10b981" },
                { label: "Confidence", value: message.analysis.confidence, color: "#f59e0b" },
              ].map(({ label, value, color }, idx) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[10px] text-gray-400">{label}</span>
                      <span className="text-[10px] font-semibold" style={{ color }}>{value}%</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "rgba(55,65,81,0.5)" }}>
                      <div className="h-full rounded-full score-bar-fill"
                        style={{
                          width: `${value}%`,
                          background: color,
                          animationDelay: `${0.4 + idx * 0.15}s`,
                        }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-[10px] mt-2" style={{ color: "rgba(107,114,128,0.6)" }}>
          {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {isCandidate && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm ml-3 mt-1"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          👤
        </div>
      )}
    </div>
  );
}
