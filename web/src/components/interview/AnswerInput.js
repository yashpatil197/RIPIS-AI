/**
 * AnswerInput - User input with glassmorphism theme, voice toggle, keyboard shortcuts
 */

import { useState, useRef, useEffect } from "react";
import VoiceRecorder from "./VoiceRecorder";

export default function AnswerInput({ onSubmit, isLoading }) {
  const [answer, setAnswer] = useState("");
  const [useVoice, setUseVoice] = useState(false);
  const textRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (answer.trim() && !isLoading) {
      onSubmit(answer.trim());
      setAnswer("");
      setUseVoice(false);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setAnswer(transcript);
    setUseVoice(false);
    if (textRef.current) textRef.current.focus();
  };

  const charCount = answer.length;
  const maxChars = 5000;
  const charProgress = Math.min(1, charCount / maxChars);

  // Auto-resize textarea
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = Math.min(textRef.current.scrollHeight, 160) + "px";
    }
  }, [answer]);

  return (
    <div className="border-t border-gray-700/50 p-4 md:p-5"
      style={{ background: "rgba(17, 24, 39, 0.95)", backdropFilter: "blur(12px)" }}>
      {useVoice && (
        <div className="mb-3 animate-fade-in-up">
          <VoiceRecorder onTranscript={handleVoiceTranscript} onCancel={() => setUseVoice(false)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            ref={textRef}
            value={answer}
            onChange={(e) => { if (e.target.value.length <= maxChars) setAnswer(e.target.value); }}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here... (Ctrl+Enter to submit)"
            className="w-full p-4 rounded-xl resize-none text-white placeholder-gray-500 focus:outline-none transition-all text-sm leading-relaxed focus-glow"
            style={{ background: "rgba(31, 41, 55, 0.8)", border: "1px solid rgba(75, 85, 99, 0.4)", minHeight: "80px" }}
            disabled={isLoading}
          />
          {/* Circular char progress */}
          {charCount > 0 && (
            <div className="absolute bottom-3 right-3 w-7 h-7">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(55,65,81,0.4)" strokeWidth="2" />
                <circle cx="14" cy="14" r="11" fill="none"
                  stroke={charProgress > 0.9 ? "#f59e0b" : charProgress > 0.75 ? "#6366f1" : "#3b82f6"}
                  strokeWidth="2" strokeLinecap="round"
                  strokeDasharray={`${charProgress * 69.1} 69.1`}
                  style={{ transition: "stroke-dasharray 0.2s ease" }} />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-[8px] font-medium ${charProgress > 0.9 ? "text-amber-400" : "text-gray-500"}`}>
                {charCount > 999 ? `${(charCount / 1000).toFixed(1)}k` : charCount}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-between items-center">
          <button
            type="button"
            onClick={() => setUseVoice(!useVoice)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${useVoice
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "bg-gray-800 text-gray-400 hover:text-gray-300 border border-gray-700 hover:border-gray-600"
              }`}
            disabled={isLoading}
          >
            🎤 {useVoice ? "Hide Voice" : "Use Voice"}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-600 hidden md:block">Ctrl+Enter</span>
            <button
              type="submit"
              disabled={!answer.trim() || isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: !answer.trim() || isLoading
                  ? "rgba(59, 130, 246, 0.3)"
                  : "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                boxShadow: answer.trim() && !isLoading ? "0 4px 16px rgba(99,102,241,0.25)" : "none",
              }}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Answer →"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
