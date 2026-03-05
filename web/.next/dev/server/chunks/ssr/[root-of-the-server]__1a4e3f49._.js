module.exports = [
"[project]/pages/hr.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HRInterview
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
;
;
;
;
function HRInterview() {
    const [videoOn, setVideoOn] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [showGuidance, setShowGuidance] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [answer, setAnswer] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const question = "Can you tell me about yourself?";
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (videoOn) {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then((stream)=>{
                const video = document.getElementById("video-preview");
                if (video) video.srcObject = stream;
            }).catch((err)=>console.error(err));
        }
    }, [
        videoOn
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "HR Interview - RIPIS-AI"
                    }, void 0, false, {
                        fileName: "[project]/pages/hr.js",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Practice behavioral and situational interview questions with live guidance"
                    }, void 0, false, {
                        fileName: "[project]/pages/hr.js",
                        lineNumber: 28,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/hr.js",
                lineNumber: 26,
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
                                                fileName: "[project]/pages/hr.js",
                                                lineNumber: 40,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/hr.js",
                                            lineNumber: 39,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "h-4 w-px bg-gray-800"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/hr.js",
                                            lineNumber: 42,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-8 h-8 rounded-lg flex items-center justify-center text-lg",
                                                    style: {
                                                        background: "rgba(59,130,246,0.15)",
                                                        border: "1px solid rgba(59,130,246,0.25)"
                                                    },
                                                    children: "💼"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/hr.js",
                                                    lineNumber: 44,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                            className: "text-lg font-semibold text-white",
                                                            children: "HR Mock Interview"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/hr.js",
                                                            lineNumber: 49,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-500",
                                                            children: "Behavioral & Situational"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/hr.js",
                                                            lineNumber: 50,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/hr.js",
                                                    lineNumber: 48,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/hr.js",
                                            lineNumber: 43,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/hr.js",
                                    lineNumber: 38,
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
                                            fileName: "[project]/pages/hr.js",
                                            lineNumber: 56,
                                            columnNumber: 29
                                        }, this),
                                        "AI ON"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/hr.js",
                                    lineNumber: 54,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/hr.js",
                            lineNumber: 37,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "animate-fade-in-up",
                                    style: {
                                        animationDelay: "0.1s"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "glass-card p-3 overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative rounded-lg overflow-hidden",
                                            style: {
                                                aspectRatio: "4/3",
                                                background: "rgba(17,24,39,0.8)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("video", {
                                                    id: "video-preview",
                                                    autoPlay: true,
                                                    muted: true,
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/hr.js",
                                                    lineNumber: 68,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg",
                                                    style: {
                                                        background: "rgba(0,0,0,0.6)",
                                                        backdropFilter: "blur(8px)"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "w-2 h-2 rounded-full bg-red-500 animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/hr.js",
                                                            lineNumber: 77,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] text-gray-300 font-medium",
                                                            children: "LIVE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/hr.js",
                                                            lineNumber: 78,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/hr.js",
                                                    lineNumber: 75,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-3 right-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setVideoOn(!videoOn),
                                                        className: "px-2 py-1 rounded-lg text-[10px] text-gray-300 transition-all",
                                                        style: {
                                                            background: "rgba(0,0,0,0.6)",
                                                            backdropFilter: "blur(8px)"
                                                        },
                                                        children: videoOn ? "📹 On" : "📹 Off"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/hr.js",
                                                        lineNumber: 81,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/hr.js",
                                                    lineNumber: 80,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/hr.js",
                                            lineNumber: 67,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/hr.js",
                                        lineNumber: 66,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/hr.js",
                                    lineNumber: 65,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "animate-fade-in-up",
                                    style: {
                                        animationDelay: "0.2s"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "glass-card p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                                        style: {
                                                            background: "rgba(59,130,246,0.15)",
                                                            color: "#60a5fa"
                                                        },
                                                        children: "Question 1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/hr.js",
                                                        lineNumber: 96,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-gray-600",
                                                        children: "Behavioral"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/hr.js",
                                                        lineNumber: 100,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/hr.js",
                                                lineNumber: 95,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-medium text-white mb-5 leading-relaxed",
                                                children: question
                                            }, void 0, false, {
                                                fileName: "[project]/pages/hr.js",
                                                lineNumber: 103,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                value: answer,
                                                onChange: (e)=>setAnswer(e.target.value),
                                                className: "w-full p-4 rounded-xl resize-none text-white placeholder-gray-500 focus:outline-none transition-all text-sm leading-relaxed focus-glow",
                                                style: {
                                                    background: "rgba(17, 24, 39, 0.8)",
                                                    border: "1px solid rgba(75, 85, 99, 0.4)"
                                                },
                                                rows: 4,
                                                placeholder: "Speak or type your answer here..."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/hr.js",
                                                lineNumber: 105,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex gap-3 mt-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowGuidance(true),
                                                        className: "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]",
                                                        style: {
                                                            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                                            color: "white",
                                                            boxShadow: "0 4px 16px rgba(59,130,246,0.25)"
                                                        },
                                                        children: "💡 Get Live Guidance"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/hr.js",
                                                        lineNumber: 115,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        className: "px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 transition-all hover:text-gray-300",
                                                        style: {
                                                            background: "rgba(31,41,55,0.5)",
                                                            border: "1px solid rgba(55,65,81,0.5)"
                                                        },
                                                        children: "Skip →"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/hr.js",
                                                        lineNumber: 121,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/hr.js",
                                                lineNumber: 114,
                                                columnNumber: 33
                                            }, this),
                                            showGuidance && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "mt-4 p-4 rounded-xl animate-fade-in-up",
                                                style: {
                                                    background: "rgba(34,197,94,0.08)",
                                                    border: "1px solid rgba(34,197,94,0.2)"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-green-400 text-sm mt-0.5",
                                                            children: "💡"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/hr.js",
                                                            lineNumber: 132,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-medium text-green-400 mb-1",
                                                                    children: "Guidance"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/hr.js",
                                                                    lineNumber: 134,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-300 leading-relaxed",
                                                                    children: "Keep your introduction structured — background, skills, and what you're looking for. Start with a brief overview, then highlight 2-3 key experiences."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/hr.js",
                                                                    lineNumber: 135,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/hr.js",
                                                            lineNumber: 133,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/hr.js",
                                                    lineNumber: 131,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/hr.js",
                                                lineNumber: 129,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/hr.js",
                                        lineNumber: 93,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/hr.js",
                                    lineNumber: 92,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/hr.js",
                            lineNumber: 62,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mt-8 animate-fade-in-up",
                            style: {
                                animationDelay: "0.3s"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "glass-card p-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3",
                                        children: "Quick Tips"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/hr.js",
                                        lineNumber: 150,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                        children: [
                                            {
                                                icon: "🎙️",
                                                tip: "Speak clearly and at a moderate pace"
                                            },
                                            {
                                                icon: "📋",
                                                tip: "Structure: Situation → Action → Result"
                                            },
                                            {
                                                icon: "⏱️",
                                                tip: "Keep answers under 2 minutes"
                                            }
                                        ].map(({ icon, tip })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2.5 text-sm text-gray-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/hr.js",
                                                        lineNumber: 158,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: tip
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/hr.js",
                                                        lineNumber: 159,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, tip, true, {
                                                fileName: "[project]/pages/hr.js",
                                                lineNumber: 157,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/hr.js",
                                        lineNumber: 151,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/hr.js",
                                lineNumber: 149,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/hr.js",
                            lineNumber: 148,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/hr.js",
                    lineNumber: 34,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/hr.js",
                lineNumber: 31,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__1a4e3f49._.js.map