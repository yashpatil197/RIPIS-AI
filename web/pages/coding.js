import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function CodingInterview() {
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [feedbackType, setFeedbackType] = useState(""); // "hint" | "feedback"

    const problem =
        "Given an array of integers, find the maximum sum of a contiguous subarray.";

    const handleSubmit = () => {
        if (answer.trim().length === 0) {
            setFeedback("Start by explaining your thought process before writing code.");
            setFeedbackType("feedback");
        } else if (answer.length < 40) {
            setFeedback(
                "You're on the right track. Try explaining how you would track the maximum sum step-by-step."
            );
            setFeedbackType("feedback");
        } else {
            setFeedback(
                "Good explanation. Consider mentioning time complexity and how negative values are handled."
            );
            setFeedbackType("feedback");
        }
    };

    const handleHint = () => {
        setFeedback(
            "Hint: Maintain a running sum and reset it when it becomes negative. This is known as Kadane's Algorithm."
        );
        setFeedbackType("hint");
    };

    return (
        <>
            <Head>
                <title>Coding Interview - RIPIS-AI</title>
                <meta name="description" content="Practice coding interview problems with real-time algorithmic hints" />
            </Head>

            <div className="min-h-[calc(100vh-3.5rem)] text-white"
                style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111827 40%, #0f172a 70%, #0a0a0a 100%)" }}>

                <div className="max-w-4xl mx-auto px-4 py-12">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <Link href="/mock">
                                <span className="text-sm text-gray-500 hover:text-gray-300 transition cursor-pointer">← Back</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-800" />
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>
                                    💻
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold text-white">Coding Interview</h1>
                                    <p className="text-[10px] text-gray-500">Algorithm Problem-Solving</p>
                                </div>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium"
                            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            AI ON
                        </span>
                    </div>

                    {/* Problem Card */}
                    <div className="glass-card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        {/* Problem Tag */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>
                                Medium
                            </span>
                            <span className="text-[10px] text-gray-600">Arrays • Dynamic Programming</span>
                        </div>

                        <h2 className="text-base font-semibold text-white mb-2">Problem Statement</h2>
                        <p className="text-sm text-gray-300 leading-relaxed p-4 rounded-xl"
                            style={{ background: "rgba(17,24,39,0.6)", border: "1px solid rgba(55,65,81,0.3)" }}>
                            {problem}
                        </p>
                    </div>

                    {/* Solution Input */}
                    <div className="glass-card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <span>📝</span> Your Approach
                        </h3>

                        <textarea
                            className="w-full p-4 rounded-xl resize-none text-white placeholder-gray-500 focus:outline-none transition-all text-sm leading-relaxed font-mono focus-glow"
                            style={{ background: "rgba(17, 24, 39, 0.8)", border: "1px solid rgba(75, 85, 99, 0.4)" }}
                            rows={6}
                            placeholder="Explain your approach here...&#10;&#10;Think about:&#10;- What data structure to use?&#10;- What's the time complexity?&#10;- How do you handle edge cases?"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    background: answer.trim()
                                        ? "linear-gradient(135deg, #10b981, #059669)"
                                        : "rgba(16,185,129,0.2)",
                                    color: "white",
                                    boxShadow: answer.trim() ? "0 4px 16px rgba(16,185,129,0.25)" : "none",
                                }}>
                                ✅ Submit Solution
                            </button>

                            <button
                                onClick={handleHint}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", boxShadow: "0 4px 16px rgba(59,130,246,0.2)" }}>
                                💡 Get Hint
                            </button>
                        </div>
                    </div>

                    {/* Feedback Panel */}
                    {feedback && (
                        <div className="animate-fade-in-up mb-6">
                            <div className="rounded-xl p-5"
                                style={{
                                    background: feedbackType === "hint"
                                        ? "rgba(59,130,246,0.08)"
                                        : "rgba(34,197,94,0.08)",
                                    border: `1px solid ${feedbackType === "hint" ? "rgba(59,130,246,0.2)" : "rgba(34,197,94,0.2)"}`,
                                }}>
                                <div className="flex items-start gap-3">
                                    <span className={`text-lg mt-0.5 ${feedbackType === "hint" ? "text-blue-400" : "text-green-400"}`}>
                                        {feedbackType === "hint" ? "💡" : "📝"}
                                    </span>
                                    <div>
                                        <p className={`text-xs font-medium mb-1 ${feedbackType === "hint" ? "text-blue-400" : "text-green-400"}`}>
                                            {feedbackType === "hint" ? "Hint" : "Feedback"}
                                        </p>
                                        <p className="text-sm text-gray-300 leading-relaxed">{feedback}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Reference */}
                    <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Approach Checklist</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { icon: "1️⃣", text: "Understand the problem constraints" },
                                { icon: "2️⃣", text: "Think of brute force first" },
                                { icon: "3️⃣", text: "Optimize with the right data structure" },
                                { icon: "4️⃣", text: "Analyze time and space complexity" },
                            ].map(({ icon, text }) => (
                                <div key={text} className="flex items-center gap-2.5 text-sm text-gray-400">
                                    <span>{icon}</span>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}