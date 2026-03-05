import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>RIPIS-AI — Real-Time Interview Practice</title>
        <meta name="description" content="Practice interviews in a realistic environment with live micro-guidance that helps you improve during the interview." />
      </Head>

      <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111827 40%, #0f172a 70%, #0a0a0a 100%)" }}>

        {/* Hero Section */}
        <section className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16">
          <div className="max-w-4xl w-full text-center animate-fade-in-up">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Interview Practice
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight gradient-text">
              RIPIS-AI
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-2 font-medium">
              Real-Time Interview Practice Intelligence System
            </p>

            <p className="text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Practice interviews in a realistic environment with
              <span className="font-semibold text-white"> live micro-guidance </span>
              that helps you correct your thinking
              <span className="font-semibold text-white"> during the interview</span> —
              not after it ends.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/mock">
                <button className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", boxShadow: "0 4px 24px rgba(59,130,246,0.3)" }}>
                  🎯 Start Mock Interview
                </button>
              </Link>
              <Link href="/ai-interview">
                <button className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden group"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)", color: "white", boxShadow: "0 4px 24px rgba(99,102,241,0.3)" }}>
                  <span className="relative z-10">🤖 AI 1:1 Interviewer</span>
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
              {[
                { icon: "🎯", title: "Practice-Time Feedback", desc: "Get feedback while you practice, not just after", color: "#3b82f6", delay: "0.1s" },
                { icon: "🧠", title: "Live Micro-Guidance", desc: "Real-time hints to improve your thinking process", color: "#8b5cf6", delay: "0.2s" },
                { icon: "⚖️", title: "Ethical AI", desc: "Hints only — builds your skills without giving answers", color: "#10b981", delay: "0.3s" },
              ].map(({ icon, title, desc, color, delay }) => (
                <div key={title} className="glass-card glass-card-hover p-5 text-left animate-fade-in-up"
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

            {/* Interview Types */}
            <div className="max-w-3xl mx-auto">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Interview Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { href: "/hr", icon: "💼", title: "HR Interview", desc: "Behavioral & situational", color: "#3b82f6" },
                  { href: "/coding", icon: "💻", title: "Coding Interview", desc: "Algorithm problem-solving", color: "#10b981" },
                  { href: "/ai-interview", icon: "🤖", title: "AI Interviewer", desc: "Adaptive 1:1 interview", color: "#8b5cf6", featured: true },
                ].map(({ href, icon, title, desc, color, featured }) => (
                  <Link key={href} href={href}>
                    <div className={`glass-card glass-card-hover p-4 cursor-pointer group animate-fade-in-up ${featured ? "ring-1 ring-indigo-500/30" : ""}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">{title}</h3>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </div>
                      {featured && (
                        <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                          ✨ Featured
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="mt-14 text-xs text-gray-600">
              Designed for mock interviews · Not for assessment or cheating
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
