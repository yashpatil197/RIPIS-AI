module.exports = [
"[project]/pages/coding.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CodingInterview
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
;
;
;
;
function CodingInterview() {
    const [answer, setAnswer] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [feedback, setFeedback] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [feedbackType, setFeedbackType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(""); // "hint" | "feedback"
    const problem = "Given an array of integers, find the maximum sum of a contiguous subarray.";
    const handleSubmit = ()=>{
        if (answer.trim().length === 0) {
            setFeedback("Start by explaining your thought process before writing code.");
            setFeedbackType("feedback");
        } else if (answer.length < 40) {
            setFeedback("You're on the right track. Try explaining how you would track the maximum sum step-by-step.");
            setFeedbackType("feedback");
        } else {
            setFeedback("Good explanation. Consider mentioning time complexity and how negative values are handled.");
            setFeedbackType("feedback");
        }
    };
    const handleHint = ()=>{
        setFeedback("Hint: Maintain a running sum and reset it when it becomes negative. This is known as Kadane's Algorithm.");
        setFeedbackType("hint");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "Coding Interview - RIPIS-AI"
                    }, void 0, false, {
                        fileName: "[project]/pages/coding.js",
                        lineNumber: 40,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Practice coding interview problems with real-time algorithmic hints"
                    }, void 0, false, {
                        fileName: "[project]/pages/coding.js",
                        lineNumber: 41,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/coding.js",
                lineNumber: 39,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "min-h-[calc(100vh-3.5rem)] text-white",
                style: {
                    background: "linear-gradient(135deg, #0a0a0a 0%, #111827 40%, #0f172a 70%, #0a0a0a 100%)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto px-4 py-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-8 animate-fade-in-up",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/mock",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-500 hover:text-gray-300 transition cursor-pointer",
                                                children: "← Back"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/coding.js",
                                                lineNumber: 53,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 52,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "h-4 w-px bg-gray-800"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 55,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-8 h-8 rounded-lg flex items-center justify-center text-lg",
                                                    style: {
                                                        background: "rgba(16,185,129,0.15)",
                                                        border: "1px solid rgba(16,185,129,0.25)"
                                                    },
                                                    children: "💻"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/coding.js",
                                                    lineNumber: 57,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                            className: "text-lg font-semibold text-white",
                                                            children: "Coding Interview"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/coding.js",
                                                            lineNumber: 62,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-500",
                                                            children: "Algorithm Problem-Solving"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/coding.js",
                                                            lineNumber: 63,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/coding.js",
                                                    lineNumber: 61,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 56,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 51,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium",
                                    style: {
                                        background: "rgba(34,197,94,0.1)",
                                        border: "1px solid rgba(34,197,94,0.2)",
                                        color: "#4ade80"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 69,
                                            columnNumber: 29
                                        }, this),
                                        "AI ON"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 67,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/coding.js",
                            lineNumber: 50,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "glass-card p-6 mb-6 animate-fade-in-up",
                            style: {
                                animationDelay: "0.1s"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                            style: {
                                                background: "rgba(245,158,11,0.15)",
                                                color: "#fbbf24"
                                            },
                                            children: "Medium"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 78,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-gray-600",
                                            children: "Arrays • Dynamic Programming"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 82,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 77,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "text-base font-semibold text-white mb-2",
                                    children: "Problem Statement"
                                }, void 0, false, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 85,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-300 leading-relaxed p-4 rounded-xl",
                                    style: {
                                        background: "rgba(17,24,39,0.6)",
                                        border: "1px solid rgba(55,65,81,0.3)"
                                    },
                                    children: problem
                                }, void 0, false, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 86,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/coding.js",
                            lineNumber: 75,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "glass-card p-6 mb-6 animate-fade-in-up",
                            style: {
                                animationDelay: "0.2s"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-white mb-3 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: "📝"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 95,
                                            columnNumber: 29
                                        }, this),
                                        " Your Approach"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 94,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                    className: "w-full p-4 rounded-xl resize-none text-white placeholder-gray-500 focus:outline-none transition-all text-sm leading-relaxed font-mono focus-glow",
                                    style: {
                                        background: "rgba(17, 24, 39, 0.8)",
                                        border: "1px solid rgba(75, 85, 99, 0.4)"
                                    },
                                    rows: 6,
                                    placeholder: "Explain your approach here...  Think about: - What data structure to use? - What's the time complexity? - How do you handle edge cases?",
                                    value: answer,
                                    onChange: (e)=>setAnswer(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 98,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 mt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: handleSubmit,
                                            className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]",
                                            style: {
                                                background: answer.trim() ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(16,185,129,0.2)",
                                                color: "white",
                                                boxShadow: answer.trim() ? "0 4px 16px rgba(16,185,129,0.25)" : "none"
                                            },
                                            children: "✅ Submit Solution"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 108,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: handleHint,
                                            className: "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]",
                                            style: {
                                                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                                color: "white",
                                                boxShadow: "0 4px 16px rgba(59,130,246,0.2)"
                                            },
                                            children: "💡 Get Hint"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 121,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 107,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/coding.js",
                            lineNumber: 93,
                            columnNumber: 21
                        }, this),
                        feedback && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "animate-fade-in-up mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "rounded-xl p-5",
                                style: {
                                    background: feedbackType === "hint" ? "rgba(59,130,246,0.08)" : "rgba(34,197,94,0.08)",
                                    border: `1px solid ${feedbackType === "hint" ? "rgba(59,130,246,0.2)" : "rgba(34,197,94,0.2)"}`
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: `text-lg mt-0.5 ${feedbackType === "hint" ? "text-blue-400" : "text-green-400"}`,
                                            children: feedbackType === "hint" ? "💡" : "📝"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 141,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: `text-xs font-medium mb-1 ${feedbackType === "hint" ? "text-blue-400" : "text-green-400"}`,
                                                    children: feedbackType === "hint" ? "Hint" : "Feedback"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/coding.js",
                                                    lineNumber: 145,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-300 leading-relaxed",
                                                    children: feedback
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/coding.js",
                                                    lineNumber: 148,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 144,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 140,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/coding.js",
                                lineNumber: 133,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/coding.js",
                            lineNumber: 132,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "glass-card p-5 animate-fade-in-up",
                            style: {
                                animationDelay: "0.3s"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3",
                                    children: "Approach Checklist"
                                }, void 0, false, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 157,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                                    children: [
                                        {
                                            icon: "1️⃣",
                                            text: "Understand the problem constraints"
                                        },
                                        {
                                            icon: "2️⃣",
                                            text: "Think of brute force first"
                                        },
                                        {
                                            icon: "3️⃣",
                                            text: "Optimize with the right data structure"
                                        },
                                        {
                                            icon: "4️⃣",
                                            text: "Analyze time and space complexity"
                                        }
                                    ].map(({ icon, text })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2.5 text-sm text-gray-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: icon
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/coding.js",
                                                    lineNumber: 166,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: text
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/coding.js",
                                                    lineNumber: 167,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, text, true, {
                                            fileName: "[project]/pages/coding.js",
                                            lineNumber: 165,
                                            columnNumber: 33
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/pages/coding.js",
                                    lineNumber: 158,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/coding.js",
                            lineNumber: 156,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/coding.js",
                    lineNumber: 47,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/coding.js",
                lineNumber: 44,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0c0e6df2._.js.map