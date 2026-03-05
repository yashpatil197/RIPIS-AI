/**
 * AI Interview Page - Premium glassmorphism welcome + interview interface
 * Features animated welcome screen, live time tracking, smooth state transitions
 */

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useInterviewState } from "@/hooks/useInterviewState";
import { InterviewChat } from "@/components/interview";

export default function AIInterview() {
  const [showWelcome, setShowWelcome] = useState(true);
  const interview = useInterviewState();

  const handleStart = async () => {
    setShowWelcome(false);
    await interview.startInterview();
  };

  const handleStartDemo = () => {
    setShowWelcome(false);
    interview.startDemo();
  };

  return (
    <>
      <Head>
        <title>AI 1:1 Interviewer - RIPIS</title>
        <meta name="description" content="Practice with a realistic AI technical interviewer that adapts to your skill level" />
      </Head>

      <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111827 40%, #0f172a 70%, #0a0a0a 100%)" }}>
        {showWelcome && !interview.isActive ? (
          /* ═══════════════ WELCOME SCREEN ═══════════════ */
          <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full animate-fade-in-up">

              {/* Back link */}
              <Link href="/">
                <span className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition mb-8 cursor-pointer">
                  ← Back to Home
                </span>
              </Link>

              {/* Hero */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 animate-float"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 8px 40px rgba(99,102,241,0.35)" }}>
                  <span className="text-4xl">🤖</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight gradient-text">
                  AI 1:1 Interviewer
                </h1>
                <p className="text-lg text-gray-400 mb-1">Practice with a realistic technical interview</p>
                <p className="text-sm text-gray-500">Adaptive questions • Instant feedback • Detailed report</p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {[
                  { icon: "🧠", title: "Adaptive Questions", desc: "Difficulty adjusts based on your performance across 6 questions", color: "#3b82f6", delay: "0.1s" },
                  { icon: "🎯", title: "Instant Analysis", desc: "Get scores for technical accuracy, depth, clarity, and confidence", color: "#8b5cf6", delay: "0.2s" },
                  { icon: "🎤", title: "Voice Support", desc: "Answer with voice or text — your choice, your pace", color: "#06b6d4", delay: "0.3s" },
                  { icon: "📊", title: "Detailed Report", desc: "Strengths, weaknesses, and personalized recommendations", color: "#10b981", delay: "0.4s" },
                ].map(({ icon, title, desc, color, delay }) => (
                  <div key={title} className="glass-card glass-card-hover rounded-xl p-5 animate-fade-in-up"
                    style={{ animationDelay: delay }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      {icon}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              {/* How It Works */}
              <div className="rounded-xl p-6 mb-8 animate-fade-in-up"
                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))", border: "1px solid rgba(99,102,241,0.15)", animationDelay: "0.5s" }}>
                <h2 className="text-sm font-semibold text-white mb-4">How It Works</h2>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { step: "1", label: "Start", icon: "🚀" },
                    { step: "2", label: "Answer", icon: "💬" },
                    { step: "3", label: "Feedback", icon: "📝" },
                    { step: "4", label: "Report", icon: "📊" },
                  ].map(({ step, label, icon }) => (
                    <div key={step} className="text-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg mx-auto mb-1.5"
                        style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                        {icon}
                      </div>
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                <button onClick={handleStart}
                  className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    boxShadow: "0 4px 24px rgba(99,102,241,0.3)",
                  }}>
                  <span className="relative z-10">🚀 Start AI Interview</span>
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={handleStartDemo}
                  className="w-full py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.005] glass-card-hover"
                  style={{
                    background: "rgba(31,41,55,0.5)",
                    border: "1px solid rgba(55,65,81,0.5)",
                    color: "#9ca3af",
                  }}>
                  ▶ Try Demo Mode
                </button>
                <p className="text-center text-gray-600 text-xs mt-1">
                  No setup required • 15–20 minutes • Full evaluation report
                </p>
              </div>
            </div>
          </div>
        ) : interview.isActive ? (
          /* ═══════════════ INTERVIEW SCREEN ═══════════════ */
          <div className="h-screen flex flex-col"
            style={{ background: "linear-gradient(180deg, #0f172a 0%, #0a0a0a 100%)" }}>
            <InterviewChat
              messages={interview.messages}
              currentQuestionNumber={interview.currentQuestionNumber}
              totalQuestions={interview.totalQuestions}
              isLoading={interview.isLoading}
              onSubmitAnswer={interview.submitAnswer}
              interviewComplete={interview.interviewComplete}
              report={interview.report}
              difficulty={interview.difficulty}
            />

            {/* Footer controls */}
            {interview.isActive && !interview.interviewComplete && (
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800/50"
                style={{ background: "rgba(17,24,39,0.9)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600">
                    {interview.isDemo ? "Demo Mode" : "Live Interview"}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono px-2 py-0.5 rounded"
                    style={{ background: "rgba(55,65,81,0.3)" }}>
                    ⏱ {interview.formattedTime}
                  </span>
                </div>
                <button onClick={interview.endInterview}
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-800/50 rounded-lg transition-all hover:scale-105">
                  End Interview
                </button>
              </div>
            )}

            {interview.interviewComplete && (
              <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-gray-800/50"
                style={{ background: "rgba(17,24,39,0.9)" }}>
                <button onClick={() => { interview.resetInterview(); setShowWelcome(true); }}
                  className="px-5 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white" }}>
                  Start New Interview
                </button>
                <Link href="/">
                  <span className="px-5 py-2 rounded-xl text-sm text-gray-400 hover:text-gray-300 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer">
                    Back to Home
                  </span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* ═══════════════ ERROR / EMPTY STATE ═══════════════ */
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center animate-fade-in-up">
              {interview.error && (
                <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <p className="text-red-400 text-sm">{interview.error}</p>
                </div>
              )}
              <button onClick={() => { interview.resetInterview(); setShowWelcome(true); }}
                className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white" }}>
                ← Return to Welcome
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
