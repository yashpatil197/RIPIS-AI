import Link from "next/link";
import Head from "next/head";

export default function MockInterview() {
    return (
        <>
            <Head>
                <title>Mock Interview - RIPIS-AI</title>
                <meta name="description" content="Choose your interview type and practice with live micro-guidance" />
            </Head>

            <div className="min-h-[calc(100vh-3.5rem)] text-white"
                style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111827 40%, #0f172a 70%, #0a0a0a 100%)" }}>

                <div className="max-w-4xl mx-auto px-4 py-16">

                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in-up">
                        <Link href="/">
                            <span className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition mb-6 cursor-pointer">
                                ← Back to Home
                            </span>
                        </Link>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 8px 32px rgba(59,130,246,0.3)" }}>
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight gradient-text">
                            Mock Interview
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                            Practice interviews in a realistic environment with
                            <span className="font-semibold text-white"> live micro-guidance </span>
                            to improve your thinking during the interview.
                        </p>
                    </div>

                    {/* Interview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">

                        {/* HR Interview Card */}
                        <Link href="/hr">
                            <div className="glass-card glass-card-hover p-6 cursor-pointer group animate-fade-in-up"
                                style={{ animationDelay: "0.1s" }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                        style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
                                        💼
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white group-hover:text-blue-300 transition">HR Interview</h2>
                                        <p className="text-xs text-gray-500">Behavioral & situational</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                                    Behavioral and situational interview practice with live guidance on structure, clarity, and communication.
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {[
                                        { icon: "📹", text: "Camera & microphone enabled" },
                                        { icon: "💡", text: "Live micro-guidance while answering" },
                                        { icon: "🛡️", text: "No answers — hints only" },
                                    ].map(({ icon, text }) => (
                                        <li key={text} className="flex items-center gap-2 text-sm text-gray-300">
                                            <span className="text-xs">{icon}</span>
                                            <span>{text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center justify-between">
                                    <span className="px-4 py-2 rounded-xl text-sm font-medium transition-all group-hover:scale-105"
                                        style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white" }}>
                                        Start HR Interview →
                                    </span>
                                    <span className="text-[10px] text-gray-600">~15 min</span>
                                </div>
                            </div>
                        </Link>

                        {/* Coding Interview Card */}
                        <Link href="/coding">
                            <div className="glass-card glass-card-hover p-6 cursor-pointer group animate-fade-in-up"
                                style={{ animationDelay: "0.2s" }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                        style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>
                                        💻
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white group-hover:text-green-300 transition">Coding Interview</h2>
                                        <p className="text-xs text-gray-500">Algorithm problem-solving</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                                    Practice coding interviews by explaining your approach and receiving real-time thinking hints.
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {[
                                        { icon: "🗣️", text: "Think-aloud problem solving" },
                                        { icon: "⚡", text: "Algorithmic hints in real time" },
                                        { icon: "🤝", text: "Ethical AI assistance" },
                                    ].map(({ icon, text }) => (
                                        <li key={text} className="flex items-center gap-2 text-sm text-gray-300">
                                            <span className="text-xs">{icon}</span>
                                            <span>{text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center justify-between">
                                    <span className="px-4 py-2 rounded-xl text-sm font-medium transition-all group-hover:scale-105"
                                        style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white" }}>
                                        Start Coding Interview →
                                    </span>
                                    <span className="text-[10px] text-gray-600">~20 min</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* AI Interviewer Banner */}
                    <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                        <Link href="/ai-interview">
                            <div className="rounded-xl p-5 cursor-pointer group transition-all hover:scale-[1.01]"
                                style={{
                                    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
                                    border: "1px solid rgba(99,102,241,0.2)",
                                }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl animate-float">🤖</span>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                                AI 1:1 Interviewer
                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                    style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}>
                                                    ✨ Featured
                                                </span>
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Adaptive technical interview • 6 questions • Detailed evaluation report
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-gray-500 group-hover:text-indigo-400 transition text-sm">→</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Footer Badge */}
                    <div className="text-center mt-12">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
                            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            AI Assistance ON · Practice Mode · Hints Only
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
