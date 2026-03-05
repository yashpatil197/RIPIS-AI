/**
 * InterviewChat - Main interview conversation UI with animated report display
 * Premium dark glassmorphism theme with micro-animations
 */

import { useRef, useEffect, useState } from "react";
import InterviewMessage from "./InterviewMessage";
import AnswerInput from "./AnswerInput";
import ProgressIndicator from "./ProgressIndicator";

export default function InterviewChat({
  messages,
  currentQuestionNumber,
  totalQuestions,
  isLoading,
  onSubmitAnswer,
  interviewComplete,
  report,
  difficulty,
}) {
  const messagesEndRef = useRef(null);
  const [reportVisible, setReportVisible] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Animate report entrance
  useEffect(() => {
    if (interviewComplete && report) {
      const t = setTimeout(() => setReportVisible(true), 200);
      return () => clearTimeout(t);
    } else {
      setReportVisible(false);
    }
  }, [interviewComplete, report]);

  const handleDownloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Report Screen ───
  if (interviewComplete && report) {
    return (
      <div className="w-full h-full flex flex-col">
        <ProgressIndicator current={currentQuestionNumber} total={totalQuestions} complete={true} />
        <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-5 custom-scrollbar ${reportVisible ? "animate-fade-in-up" : "opacity-0"}`}>

          {/* Header */}
          <div className="text-center py-4 animate-scale-in">
            <h2 className="text-3xl font-bold text-white mb-2">Interview Complete! 🎉</h2>
            <p className="text-gray-400">Here&apos;s your comprehensive evaluation report</p>
          </div>

          {/* Overall Score - Hero Ring */}
          <div className="flex justify-center animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="rgba(55,65,81,0.4)" strokeWidth="2.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="url(#scoreGrad)" strokeWidth="2.5"
                  strokeDasharray={`${report.overall_score}, 100`}
                  strokeLinecap="round"
                  style={{ animation: "strokeDraw 1.5s ease-out forwards" }} />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold gradient-text-accent">{report.overall_score}</span>
                <span className="text-xs text-gray-400 mt-0.5">Overall Score</span>
              </div>
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Technical", value: report.technical_knowledge, gradient: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.08))", border: "rgba(59,130,246,0.25)", color: "#60a5fa", icon: "💻" },
              { label: "Problem Solving", value: report.problem_solving, gradient: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(139,92,246,0.08))", border: "rgba(139,92,246,0.25)", color: "#a78bfa", icon: "🧩" },
              { label: "Communication", value: report.communication, gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.08))", border: "rgba(16,185,129,0.25)", color: "#34d399", icon: "💬" },
              { label: "Confidence", value: report.confidence, gradient: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.08))", border: "rgba(245,158,11,0.25)", color: "#fbbf24", icon: "⚡" },
            ].map(({ label, value, gradient, border, color, icon }, idx) => (
              <div key={label} className="rounded-xl p-4 text-center animate-fade-in-up"
                style={{ background: gradient, border: `1px solid ${border}`, animationDelay: `${0.3 + idx * 0.1}s` }}>
                <p className="text-lg mb-1">{icon}</p>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-3xl font-bold" style={{ color }}>{value}</p>
                {/* Mini progress bar */}
                <div className="h-1 rounded-full mt-2" style={{ background: "rgba(55,65,81,0.5)" }}>
                  <div className="h-full rounded-full score-bar-fill"
                    style={{ width: `${value}%`, background: color, animationDelay: `${0.6 + idx * 0.15}s` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths */}
          <div className="rounded-xl p-5 animate-fade-in-up"
            style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", animationDelay: "0.7s" }}>
            <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
              <span>✨</span> Strengths
            </h3>
            <ul className="space-y-2">
              {report.strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="rounded-xl p-5 animate-fade-in-up"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", animationDelay: "0.8s" }}>
            <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <span>📍</span> Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {report.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">→</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="rounded-xl p-5 animate-fade-in-up"
            style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", animationDelay: "0.9s" }}>
            <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <span>🎯</span> Recommendations
            </h3>
            <ol className="space-y-2">
              {report.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-blue-400 font-semibold flex-shrink-0">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Meta + Download */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl animate-fade-in-up"
            style={{ background: "rgba(31,41,55,0.5)", border: "1px solid rgba(55,65,81,0.3)", animationDelay: "1s" }}>
            <p className="text-gray-400 text-sm">
              Duration: <span className="text-gray-300 font-medium">{report.interview_duration}</span>
              {" · "}
              Questions: <span className="text-gray-300 font-medium">{report.total_questions}</span>
            </p>
            <button onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 transition-all"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
              📥 Download JSON
            </button>
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }

  // ─── Chat Screen ───
  return (
    <div className="w-full h-full flex flex-col">
      <ProgressIndicator current={currentQuestionNumber} total={totalQuestions} complete={false} difficulty={difficulty} />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
        {messages.map((message, idx) => (
          <InterviewMessage key={message.id || idx} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 mb-4 animate-fade-in-up">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              🤖
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
              style={{ background: "rgba(31,41,55,0.7)", border: "1px solid rgba(55,65,81,0.5)" }}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-gray-500 ml-1">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!interviewComplete && (
        <AnswerInput onSubmit={onSubmitAnswer} isLoading={isLoading} />
      )}
    </div>
  );
}
