import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function HRInterview() {
    const [videoOn, setVideoOn] = useState(true);
    const [showGuidance, setShowGuidance] = useState(false);
    const [answer, setAnswer] = useState("");

    const question = "Can you tell me about yourself?";

    useEffect(() => {
        if (videoOn) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    const video = document.getElementById("video-preview");
                    if (video) video.srcObject = stream;
                })
                .catch((err) => console.error(err));
        }
    }, [videoOn]);

    return (
        <>
            <Head>
                <title>HR Interview - RIPIS-AI</title>
                <meta name="description" content="Practice behavioral and situational interview questions with live guidance" />
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
                                    style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
                                    💼
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold text-white">HR Mock Interview</h1>
                                    <p className="text-[10px] text-gray-500">Behavioral & Situational</p>
                                </div>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium"
                            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            AI ON
                        </span>
                    </div>

                    {/* Main Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Camera Preview */}
                        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                            <div className="glass-card p-3 overflow-hidden">
                                <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "4/3", background: "rgba(17,24,39,0.8)" }}>
                                    <video
                                        id="video-preview"
                                        autoPlay
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Camera overlay */}
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg"
                                        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] text-gray-300 font-medium">LIVE</span>
                                    </div>
                                    <div className="absolute bottom-3 right-3">
                                        <button onClick={() => setVideoOn(!videoOn)}
                                            className="px-2 py-1 rounded-lg text-[10px] text-gray-300 transition-all"
                                            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                                            {videoOn ? "📹 On" : "📹 Off"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interview Panel */}
                        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                            <div className="glass-card p-6">
                                {/* Question Badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                        style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
                                        Question 1
                                    </span>
                                    <span className="text-[10px] text-gray-600">Behavioral</span>
                                </div>

                                <p className="text-lg font-medium text-white mb-5 leading-relaxed">{question}</p>

                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="w-full p-4 rounded-xl resize-none text-white placeholder-gray-500 focus:outline-none transition-all text-sm leading-relaxed focus-glow"
                                    style={{ background: "rgba(17, 24, 39, 0.8)", border: "1px solid rgba(75, 85, 99, 0.4)" }}
                                    rows={4}
                                    placeholder="Speak or type your answer here..."
                                />

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => setShowGuidance(true)}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", boxShadow: "0 4px 16px rgba(59,130,246,0.25)" }}>
                                        💡 Get Live Guidance
                                    </button>
                                    <button
                                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 transition-all hover:text-gray-300"
                                        style={{ background: "rgba(31,41,55,0.5)", border: "1px solid rgba(55,65,81,0.5)" }}>
                                        Skip →
                                    </button>
                                </div>

                                {showGuidance && (
                                    <div className="mt-4 p-4 rounded-xl animate-fade-in-up"
                                        style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-400 text-sm mt-0.5">💡</span>
                                            <div>
                                                <p className="text-xs font-medium text-green-400 mb-1">Guidance</p>
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    Keep your introduction structured — background, skills, and what you&apos;re looking for.
                                                    Start with a brief overview, then highlight 2-3 key experiences.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                        <div className="glass-card p-5">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Tips</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: "🎙️", tip: "Speak clearly and at a moderate pace" },
                                    { icon: "📋", tip: "Structure: Situation → Action → Result" },
                                    { icon: "⏱️", tip: "Keep answers under 2 minutes" },
                                ].map(({ icon, tip }) => (
                                    <div key={tip} className="flex items-center gap-2.5 text-sm text-gray-400">
                                        <span>{icon}</span>
                                        <span>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}