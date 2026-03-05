module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/modules/ai-interview/questionEngine.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DIFFICULTY_LEVELS",
    ()=>DIFFICULTY_LEVELS,
    "FOLLOW_UP_TEMPLATES",
    ()=>FOLLOW_UP_TEMPLATES,
    "INTERVIEWER_SYSTEM_PROMPT",
    ()=>INTERVIEWER_SYSTEM_PROMPT,
    "QUESTION_POOL",
    ()=>QUESTION_POOL,
    "QuestionEngine",
    ()=>QuestionEngine
]);
/**
 * Question Engine - Dynamic question generation with adaptive difficulty
 * Supports LLM-powered generation with large diverse pool fallback
 */ const DIFFICULTY_LEVELS = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"
};
const QUESTION_POOL = {
    easy: [
        {
            topic: "Programming fundamentals",
            q: "Tell me about your programming experience. What languages have you worked with and what do you enjoy most about coding?"
        },
        {
            topic: "Programming fundamentals",
            q: "Can you explain the difference between compiled and interpreted languages? Give me some examples of each."
        },
        {
            topic: "Data structures",
            q: "What is a data structure? Can you name a few common ones and when you'd use them?"
        },
        {
            topic: "Data structures",
            q: "What's the difference between an array and a linked list? When would you prefer one over the other?"
        },
        {
            topic: "Problem solving",
            q: "How do you approach solving a new programming problem? Walk me through your thought process."
        },
        {
            topic: "Problem solving",
            q: "If you encounter a bug in your code that you can't immediately find, what steps do you take to debug it?"
        },
        {
            topic: "Web development",
            q: "Can you explain the difference between frontend and backend development? What technologies are used for each?"
        },
        {
            topic: "Web development",
            q: "What happens when you type a URL into a browser and press Enter? Walk me through the journey."
        },
        {
            topic: "OOP concepts",
            q: "What is Object-Oriented Programming? Can you explain its main principles?"
        },
        {
            topic: "OOP concepts",
            q: "What's the difference between a class and an object? Can you give a real-world analogy?"
        },
        {
            topic: "Database design",
            q: "What is a database? What's the difference between SQL and NoSQL databases?"
        },
        {
            topic: "Algorithms",
            q: "What is an algorithm? Can you describe a simple one you've used in your projects?"
        }
    ],
    medium: [
        {
            topic: "Data structures",
            q: "Explain how a hash map works internally. What happens during a collision, and how is it resolved?"
        },
        {
            topic: "Data structures",
            q: "Compare and contrast stacks and queues. Give me a real-world use case for each."
        },
        {
            topic: "Data structures",
            q: "What is a binary search tree? How does insertion and lookup work, and what's the time complexity?"
        },
        {
            topic: "Algorithms",
            q: "Explain the difference between BFS and DFS. When would you use one over the other?"
        },
        {
            topic: "Algorithms",
            q: "What is time complexity? Explain Big O notation with examples of O(1), O(n), and O(n²)."
        },
        {
            topic: "Algorithms",
            q: "Explain how merge sort works. What's its time and space complexity, and why is it preferred for linked lists?"
        },
        {
            topic: "Web development",
            q: "What's the difference between REST and GraphQL APIs? What are the trade-offs of each approach?"
        },
        {
            topic: "Web development",
            q: "Explain the concept of middleware in web frameworks. How does it work in Express.js or similar?"
        },
        {
            topic: "Web development",
            q: "What are WebSockets? How do they differ from HTTP, and when would you use them?"
        },
        {
            topic: "System design",
            q: "How would you design a caching layer for a web application? What strategies would you consider?"
        },
        {
            topic: "System design",
            q: "Explain the concept of load balancing. Why is it important and what are the common strategies?"
        },
        {
            topic: "OOP concepts",
            q: "Explain the SOLID principles with examples. Which one do you think is most important and why?"
        },
        {
            topic: "OOP concepts",
            q: "What are design patterns? Describe the Observer and Singleton patterns with use cases."
        },
        {
            topic: "Database design",
            q: "Explain database normalization. What are the different normal forms and when might you denormalize?"
        },
        {
            topic: "Database design",
            q: "How would you optimize a slow database query? Walk me through your approach."
        },
        {
            topic: "Problem solving",
            q: "Given an array of integers, how would you find two numbers that add up to a target sum? What's the most efficient approach?"
        }
    ],
    hard: [
        {
            topic: "System design",
            q: "Design a URL shortener like bit.ly. What are the key components, data model, and how would you handle billions of URLs?"
        },
        {
            topic: "System design",
            q: "How would you design a real-time chat application like WhatsApp? Consider message delivery, read receipts, and offline support."
        },
        {
            topic: "System design",
            q: "Describe your approach to scaling a web application from 1 million to 100 million users. What architectural changes would be needed?"
        },
        {
            topic: "System design",
            q: "How would you implement a distributed cache like Redis? What consistency and eviction strategies would you use?"
        },
        {
            topic: "System design",
            q: "Design a rate limiter for an API. What algorithms would you consider and how would you make it distributed?"
        },
        {
            topic: "Algorithms",
            q: "Explain dynamic programming. Walk me through solving the longest common subsequence problem step by step."
        },
        {
            topic: "Algorithms",
            q: "What is the difference between greedy algorithms and dynamic programming? When is each approach appropriate?"
        },
        {
            topic: "Data structures",
            q: "Explain how a B-tree works and why databases use them for indexing instead of binary search trees."
        },
        {
            topic: "Web development",
            q: "Explain the event loop in Node.js. How does it handle asynchronous operations and what are microtasks vs macrotasks?"
        },
        {
            topic: "Database design",
            q: "What are the trade-offs between consistency and availability in distributed systems? Explain the CAP theorem with real examples."
        },
        {
            topic: "Database design",
            q: "How would you design a database schema for a social media platform? Consider posts, comments, likes, and follower relationships."
        },
        {
            topic: "Problem solving",
            q: "How would you detect a cycle in a linked list? Explain your approach and analyze its time and space complexity."
        }
    ]
};
// Follow-up templates based on answer quality
const FOLLOW_UP_TEMPLATES = {
    strong: [
        "That was a great explanation. Let me dig deeper — {followup}",
        "Excellent answer. Building on that, {followup}",
        "Very thorough. Let's take it further — {followup}"
    ],
    weak: [
        "Let me approach this from a different angle. {followup}",
        "That's a good start. Let me ask it differently — {followup}",
        "No worries, let's try something related. {followup}"
    ],
    clarify: [
        "Can you elaborate more on that? Specifically, {followup}",
        "That's interesting, but I'd like to understand better — {followup}",
        "Could you walk me through a concrete example of what you mean?"
    ]
};
/** System prompt for the LLM interviewer */ const INTERVIEWER_SYSTEM_PROMPT = `You are an experienced technical interviewer conducting a realistic 1:1 interview.

Rules:
* Ask one question at a time
* Adjust difficulty based on the candidate's previous answer
* Ask follow-up questions when needed
* Test both conceptual understanding and practical thinking
* Be professional and conversational
* Conduct a total of 6 interview questions.

Topics can include:
* Programming fundamentals
* Data structures
* Problem solving
* System design
* Web development

Generate the next interview question based on the conversation so far. Return ONLY in this JSON format:
{
  "question": "your question here",
  "topic": "topic category",
  "difficulty": "easy|medium|hard",
  "reasoning": "brief note on why this question was chosen"
}`;
class QuestionEngine {
    constructor(){
        this.questionsAsked = [];
        this.topicsAsked = [];
        this.difficulty = DIFFICULTY_LEVELS.EASY;
        this.totalQuestions = 6;
    }
    startInterview() {
        this.difficulty = DIFFICULTY_LEVELS.EASY;
        const question = this._pickQuestion(DIFFICULTY_LEVELS.EASY);
        this.questionsAsked.push({
            question: question.q,
            topic: question.topic,
            difficulty: DIFFICULTY_LEVELS.EASY
        });
        this.topicsAsked.push(question.topic);
        return {
            question: question.q,
            questionNumber: 1,
            totalQuestions: this.totalQuestions,
            difficulty: DIFFICULTY_LEVELS.EASY
        };
    }
    /**
   * Generate next question using LLM when available
   * @param {string} apiKey - OpenAI API key
   * @param {Array} conversationHistory - Full conversation history
   * @param {number} answerScore - Score from previous answer
   * @param {string} answerContent - Previous answer content
   * @returns {Promise<object|null>}
   */ async generateNextQuestionLLM(apiKey, conversationHistory, answerScore, answerContent) {
        const count = this.questionsAsked.length;
        if (count >= this.totalQuestions) return null;
        this._adjustDifficulty(answerScore);
        // Try LLM generation
        if (apiKey) {
            try {
                const llmQuestion = await this._askLLMForQuestion(apiKey, conversationHistory, answerScore);
                if (llmQuestion) {
                    this.questionsAsked.push({
                        question: llmQuestion.question,
                        topic: llmQuestion.topic || "General",
                        difficulty: llmQuestion.difficulty || this.difficulty
                    });
                    this.topicsAsked.push(llmQuestion.topic || "General");
                    return {
                        question: llmQuestion.question,
                        questionNumber: count + 1,
                        totalQuestions: this.totalQuestions,
                        difficulty: llmQuestion.difficulty || this.difficulty
                    };
                }
            } catch (e) {
                console.error("LLM question generation failed, using pool:", e);
            }
        }
        // Fallback to pool-based generation
        return this.generateNextQuestion(answerScore, answerContent);
    }
    /** Pool-based next question (fallback) */ generateNextQuestion(answerScore, answerContent) {
        const count = this.questionsAsked.length;
        if (count >= this.totalQuestions) return null;
        this._adjustDifficulty(answerScore);
        const question = this._pickQuestion(this.difficulty);
        this.questionsAsked.push({
            question: question.q,
            topic: question.topic,
            difficulty: this.difficulty
        });
        this.topicsAsked.push(question.topic);
        return {
            question: question.q,
            questionNumber: count + 1,
            totalQuestions: this.totalQuestions,
            difficulty: this.difficulty
        };
    }
    /**
   * Ask LLM to generate the next question
   */ async _askLLMForQuestion(apiKey, conversationHistory, lastScore) {
        const contextMessages = [
            {
                role: "system",
                content: INTERVIEWER_SYSTEM_PROMPT
            }
        ];
        // Add conversation history for context
        const recentHistory = conversationHistory.slice(-10); // Last 10 entries
        for (const entry of recentHistory){
            if (entry.role === "interviewer" && entry.type === "question") {
                contextMessages.push({
                    role: "assistant",
                    content: `[Question] ${entry.content}`
                });
            } else if (entry.role === "candidate") {
                contextMessages.push({
                    role: "user",
                    content: entry.content
                });
            } else if (entry.role === "interviewer" && entry.type === "feedback") {
                contextMessages.push({
                    role: "assistant",
                    content: `[Feedback] ${entry.content}`
                });
            }
        }
        // Add instruction for next question
        contextMessages.push({
            role: "user",
            content: `The candidate's last answer scored ${lastScore}/100. Current difficulty level: ${this.difficulty}. Questions asked so far: ${this.questionsAsked.length}/${this.totalQuestions}. Topics already covered: ${[
                ...new Set(this.topicsAsked)
            ].join(", ")}. Generate the next interview question — pick a different topic if possible. ${lastScore >= 80 ? "The candidate is strong — ask a harder question." : lastScore < 50 ? "The candidate struggled — ask a simpler question on a fundamental topic." : "Maintain the current difficulty."}`
        });
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: contextMessages,
                temperature: 0.8,
                max_tokens: 300
            })
        });
        if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
        const data = await response.json();
        const content = data.choices[0]?.message?.content || "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.question) return parsed;
        }
        return null;
    }
    _adjustDifficulty(score) {
        if (score >= 80) {
            if (this.difficulty === DIFFICULTY_LEVELS.EASY) this.difficulty = DIFFICULTY_LEVELS.MEDIUM;
            else if (this.difficulty === DIFFICULTY_LEVELS.MEDIUM) this.difficulty = DIFFICULTY_LEVELS.HARD;
        } else if (score < 50) {
            if (this.difficulty === DIFFICULTY_LEVELS.HARD) this.difficulty = DIFFICULTY_LEVELS.MEDIUM;
            else if (this.difficulty === DIFFICULTY_LEVELS.MEDIUM) this.difficulty = DIFFICULTY_LEVELS.EASY;
        }
    }
    _pickQuestion(difficulty) {
        const pool = QUESTION_POOL[difficulty] || QUESTION_POOL.medium;
        // Prefer topics not yet asked
        const askedQuestions = this.questionsAsked.map((q)=>q.question);
        const unaskedFromNewTopics = pool.filter((q)=>!askedQuestions.includes(q.q) && !this.topicsAsked.includes(q.topic));
        if (unaskedFromNewTopics.length > 0) {
            return unaskedFromNewTopics[Math.floor(Math.random() * unaskedFromNewTopics.length)];
        }
        // Fallback to any unasked question
        const unasked = pool.filter((q)=>!askedQuestions.includes(q.q));
        if (unasked.length > 0) {
            return unasked[Math.floor(Math.random() * unasked.length)];
        }
        // Ultimate fallback
        return pool[Math.floor(Math.random() * pool.length)];
    }
    getProgress() {
        return {
            questionsAsked: this.questionsAsked.length,
            totalQuestions: this.totalQuestions,
            percentage: this.questionsAsked.length / this.totalQuestions * 100,
            currentDifficulty: this.difficulty
        };
    }
    isInterviewComplete() {
        return this.questionsAsked.length >= this.totalQuestions;
    }
    reset() {
        this.questionsAsked = [];
        this.topicsAsked = [];
        this.difficulty = DIFFICULTY_LEVELS.EASY;
    }
}
;
}),
"[project]/src/modules/ai-interview/answerAnalyzer.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnswerAnalyzer",
    ()=>AnswerAnalyzer
]);
/**
 * Answer Analyzer - Evaluates user answers with LLM + local heuristic fallback
 * Scores technical correctness, depth, clarity, and confidence
 */ const TECHNICAL_KEYWORDS = [
    "algorithm",
    "complexity",
    "optimize",
    "data structure",
    "cache",
    "database",
    "api",
    "distributed",
    "scalable",
    "server",
    "client",
    "protocol",
    "http",
    "tcp",
    "function",
    "variable",
    "loop",
    "recursion",
    "stack",
    "queue",
    "hash",
    "tree",
    "graph",
    "array",
    "linked list",
    "pointer",
    "memory",
    "thread",
    "process",
    "async",
    "await",
    "promise",
    "callback",
    "event",
    "middleware",
    "framework",
    "library",
    "component",
    "module",
    "class",
    "inheritance",
    "polymorphism",
    "encapsulation",
    "abstraction",
    "interface",
    "index",
    "query",
    "schema",
    "normalization",
    "transaction",
    "latency",
    "throughput",
    "load balancer",
    "microservice",
    "monolith",
    "container",
    "docker",
    "kubernetes",
    "rest",
    "graphql",
    "websocket",
    "cdn",
    "dns",
    "ssl",
    "tls",
    "oauth",
    "jwt",
    "token",
    "session",
    "cookie",
    "big o",
    "o(n)",
    "o(1)",
    "o(log n)",
    "o(n^2)",
    "constant time",
    "linear",
    "binary search",
    "sorting",
    "merge sort",
    "quick sort",
    "heap"
];
const CONFIDENCE_INDICATORS = [
    "i am sure",
    "definitely",
    "absolutely",
    "clearly",
    "certainly",
    "without a doubt",
    "i know",
    "proven",
    "well-established",
    "fundamentally"
];
const UNCERTAINTY_INDICATORS = [
    "maybe",
    "perhaps",
    "i think",
    "probably",
    "might be",
    "not sure",
    "i guess",
    "could be",
    "possibly",
    "i'm not certain",
    "i believe"
];
/** System prompt for answer analysis */ const ANALYSIS_SYSTEM_PROMPT = `You are an experienced technical interview evaluator. Analyze the candidate's answer to the given interview question.

For each answer analyze:
- technical correctness: accuracy of concepts and implementation understanding
- depth of explanation: level of detail, use of examples, edge cases
- clarity of communication: logical structure, clear reasoning
- confidence: conviction, professional language, structured thinking

Return ONLY valid JSON with these exact fields:
{
  "technical_correctness": number 0-100,
  "depth_of_explanation": number 0-100,
  "clarity": number 0-100,
  "confidence": number 0-100,
  "feedback": "string - 2-3 sentences of professional, constructive feedback"
}

Be fair, constructive, and professional. Score based on the quality relative to a junior-to-mid level developer.`;
class AnswerAnalyzer {
    constructor(){
        this.analysisHistory = [];
    }
    /**
   * Analyze answer using LLM with full conversation context
   * @param {string} apiKey - OpenAI API key
   * @param {string} question - The question asked
   * @param {string} answer - The candidate's answer
   * @param {Array} conversationHistory - Full conversation context
   * @returns {Promise<object>} Analysis scores and feedback
   */ async analyzeWithLLM(apiKey, question, answer, conversationHistory) {
        if (!apiKey) return null;
        try {
            const contextSummary = conversationHistory.filter((e)=>e.type === "question" || e.type === "answer").slice(-6).map((e)=>`${e.role === "interviewer" ? "Q" : "A"}: ${e.content.substring(0, 200)}`).join("\n");
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: ANALYSIS_SYSTEM_PROMPT
                        },
                        {
                            role: "user",
                            content: `Interview context (recent exchanges):\n${contextSummary}\n\n---\n\nCurrent Question: ${question}\n\nCandidate's Answer: ${answer}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
            const data = await response.json();
            const content = data.choices[0]?.message?.content || "";
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    technical_correctness: Math.min(100, Math.max(0, parsed.technical_correctness || 60)),
                    depth_of_explanation: Math.min(100, Math.max(0, parsed.depth_of_explanation || 60)),
                    clarity: Math.min(100, Math.max(0, parsed.clarity || 60)),
                    confidence: Math.min(100, Math.max(0, parsed.confidence || 60)),
                    feedback: parsed.feedback || "Thank you for your answer. Let's continue."
                };
            }
        } catch (e) {
            console.error("LLM analysis failed:", e);
        }
        return null;
    }
    analyzeAnswer(question, answer, llmAnalysis) {
        const localScores = this._computeLocalScores(answer);
        const scores = {
            technical: llmAnalysis?.technical_correctness ?? localScores.technical,
            depthOfExplanation: llmAnalysis?.depth_of_explanation ?? localScores.depth,
            clarity: llmAnalysis?.clarity ?? localScores.clarity,
            confidence: llmAnalysis?.confidence ?? localScores.confidence
        };
        const analysis = {
            question,
            answer,
            timestamp: new Date(),
            scores,
            feedback: llmAnalysis?.feedback || "",
            technicalCorrectness: scores.technical
        };
        this.analysisHistory.push(analysis);
        return analysis;
    }
    _computeLocalScores(answer) {
        const lowerAnswer = answer.toLowerCase();
        const wordCount = answer.split(/\s+/).filter(Boolean).length;
        const sentences = answer.split(/[.!?]+/).filter((s)=>s.trim().length > 0);
        // --- Technical Score ---
        let technical = 55;
        const techTermCount = TECHNICAL_KEYWORDS.filter((t)=>lowerAnswer.includes(t)).length;
        technical += Math.min(30, techTermCount * 5);
        if (wordCount > 50) technical += 5;
        if (wordCount > 100) technical += 5;
        // Code snippets
        if (answer.includes("```") || answer.includes("=>") || answer.includes("function ") || answer.includes("const ")) {
            technical += 10;
        }
        // --- Depth Score ---
        let depth = 50;
        if (wordCount > 40) depth += 10;
        if (wordCount > 80) depth += 10;
        if (wordCount > 150) depth += 10;
        if (lowerAnswer.includes("example") || lowerAnswer.includes("for instance") || lowerAnswer.includes("such as")) {
            depth += 12;
        }
        if (lowerAnswer.includes("trade-off") || lowerAnswer.includes("advantage") || lowerAnswer.includes("disadvantage")) {
            depth += 8;
        }
        // --- Clarity Score ---
        let clarity = 50;
        if (sentences.length >= 3) clarity += 12;
        if (sentences.length >= 5) clarity += 10;
        const connectors = [
            "first",
            "second",
            "then",
            "therefore",
            "because",
            "however",
            "moreover",
            "additionally",
            "in conclusion",
            "as a result",
            "for example"
        ];
        const connectorCount = connectors.filter((c)=>lowerAnswer.includes(c)).length;
        clarity += Math.min(20, connectorCount * 5);
        // Numbered lists
        if (/\d\.\s/.test(answer) || /\d\)\s/.test(answer)) clarity += 8;
        // --- Confidence Score ---
        let confidence = 55;
        const confCount = CONFIDENCE_INDICATORS.filter((i)=>lowerAnswer.includes(i)).length;
        const uncertCount = UNCERTAINTY_INDICATORS.filter((i)=>lowerAnswer.includes(i)).length;
        confidence += confCount * 6;
        confidence -= uncertCount * 8;
        if (wordCount > 60) confidence += 8;
        if (wordCount > 120) confidence += 7;
        return {
            technical: Math.min(100, Math.max(0, technical)),
            depth: Math.min(100, Math.max(0, depth)),
            clarity: Math.min(100, Math.max(0, clarity)),
            confidence: Math.min(100, Math.max(0, confidence))
        };
    }
    getAverageScores() {
        if (this.analysisHistory.length === 0) {
            return {
                technical: 0,
                depthOfExplanation: 0,
                clarity: 0,
                confidence: 0
            };
        }
        const totals = {
            technical: 0,
            depthOfExplanation: 0,
            clarity: 0,
            confidence: 0
        };
        this.analysisHistory.forEach((a)=>{
            totals.technical += a.scores.technical;
            totals.depthOfExplanation += a.scores.depthOfExplanation;
            totals.clarity += a.scores.clarity;
            totals.confidence += a.scores.confidence;
        });
        const c = this.analysisHistory.length;
        return {
            technical: Math.round(totals.technical / c),
            depthOfExplanation: Math.round(totals.depthOfExplanation / c),
            clarity: Math.round(totals.clarity / c),
            confidence: Math.round(totals.confidence / c)
        };
    }
    reset() {
        this.analysisHistory = [];
    }
}
;
}),
"[project]/src/modules/ai-interview/reportGenerator.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReportGenerator",
    ()=>ReportGenerator
]);
/**
 * Report Generator - Creates final interview evaluation report
 * Generates scores, strengths, weaknesses, and recommendations
 */ class ReportGenerator {
    generateReport(analysisHistory) {
        const scores = this._calculateScores(analysisHistory);
        const strengths = this._identifyStrengths(analysisHistory, scores);
        const weaknesses = this._identifyWeaknesses(analysisHistory, scores);
        const recommendations = this._generateRecommendations(weaknesses, scores);
        return {
            overall_score: scores.overall,
            technical_knowledge: scores.technical,
            problem_solving: scores.problemSolving,
            communication: scores.communication,
            confidence: scores.confidence,
            strengths,
            weaknesses,
            recommendations,
            generated_at: new Date().toISOString(),
            total_questions: analysisHistory.length,
            interview_duration: this._estimateDuration(analysisHistory)
        };
    }
    _calculateScores(history) {
        if (history.length === 0) {
            return {
                overall: 0,
                technical: 0,
                problemSolving: 0,
                communication: 0,
                confidence: 0
            };
        }
        let techSum = 0, commSum = 0, confSum = 0, psSum = 0;
        history.forEach((a)=>{
            techSum += a.scores?.technical ?? 70;
            commSum += a.scores?.clarity ?? 70;
            confSum += a.scores?.confidence ?? 70;
            psSum += a.scores?.depthOfExplanation ?? 70;
        });
        const n = history.length;
        const technical = Math.round(techSum / n);
        const communication = Math.round(commSum / n);
        const confidence = Math.round(confSum / n);
        const problemSolving = Math.round(psSum / n);
        const overall = Math.round(technical * 0.35 + problemSolving * 0.25 + communication * 0.25 + confidence * 0.15);
        return {
            overall,
            technical,
            communication,
            confidence,
            problemSolving
        };
    }
    _identifyStrengths(history, scores) {
        const strengths = [];
        // Topic-based strengths from best answers
        const sorted = [
            ...history
        ].sort((a, b)=>(b.scores?.technical ?? 0) - (a.scores?.technical ?? 0));
        sorted.slice(0, 3).forEach((a)=>{
            if ((a.scores?.technical ?? 0) >= 75) {
                const q = (a.question || "").toLowerCase();
                if (q.includes("design") || q.includes("system") || q.includes("scale")) strengths.push("Strong system design and architectural thinking");
                else if (q.includes("data") || q.includes("structure") || q.includes("hash") || q.includes("tree")) strengths.push("Good understanding of data structures");
                else if (q.includes("algorithm") || q.includes("complexity") || q.includes("sort")) strengths.push("Strong algorithmic knowledge and analysis");
                else if (q.includes("web") || q.includes("api") || q.includes("rest") || q.includes("frontend")) strengths.push("Solid web development knowledge");
                else if (q.includes("oop") || q.includes("class") || q.includes("object") || q.includes("solid")) strengths.push("Good grasp of OOP principles");
                else strengths.push("Good technical understanding demonstrated");
            }
        });
        if (scores.communication >= 75) strengths.push("Clear and structured communication");
        if (scores.confidence >= 75) strengths.push("Confident delivery with conviction");
        if (scores.problemSolving >= 80) strengths.push("Thorough problem-solving approach with depth");
        // Deduplicate and limit
        return [
            ...new Set(strengths)
        ].slice(0, 4);
    }
    _identifyWeaknesses(history, scores) {
        const weaknesses = [];
        const sorted = [
            ...history
        ].sort((a, b)=>(a.scores?.technical ?? 100) - (b.scores?.technical ?? 100));
        sorted.slice(0, 2).forEach((a)=>{
            if ((a.scores?.technical ?? 100) < 60) {
                const q = (a.question || "").toLowerCase();
                if (q.includes("design") || q.includes("scale")) weaknesses.push("Could improve system design thinking");
                else if (q.includes("algorithm") || q.includes("complexity")) weaknesses.push("Needs deeper understanding of algorithms and complexity");
                else if (q.includes("data") || q.includes("structure")) weaknesses.push("Could strengthen data structures knowledge");
                else weaknesses.push("Some technical areas need reinforcement");
            }
        });
        if (scores.problemSolving < 65) weaknesses.push("Needs more detailed and structured explanations");
        if (scores.communication < 65) weaknesses.push("Could improve answer organization and clarity");
        if (scores.confidence < 60) weaknesses.push("Should work on expressing ideas with more conviction");
        return [
            ...new Set(weaknesses)
        ].slice(0, 4);
    }
    _generateRecommendations(weaknesses, scores) {
        const recs = [];
        if (scores.technical < 70) {
            recs.push("Practice technical coding problems on LeetCode or HackerRank");
            recs.push("Study fundamental data structures and algorithms in depth");
        }
        if (scores.problemSolving < 70) {
            recs.push("Work on structured problem-solving: define approach before coding");
            recs.push("Practice thinking aloud while solving problems");
        }
        if (scores.communication < 70) {
            recs.push("Practice explaining solutions in a step-by-step manner");
            recs.push("Use examples and analogies to make explanations clearer");
        }
        if (scores.confidence < 70) {
            recs.push("Build confidence through frequent mock interview practice");
            recs.push("Review core concepts to strengthen your technical foundation");
        }
        if (recs.length === 0) {
            recs.push("Excellent performance — challenge yourself with harder system design problems");
            recs.push("Consider mentoring others to deepen your own understanding");
        }
        return recs.slice(0, 5);
    }
    _estimateDuration(history) {
        const base = 3;
        const perQuestion = 3;
        const total = base + history.length * perQuestion;
        return `${total}-${total + history.length * 2} minutes`;
    }
}
;
}),
"[project]/src/modules/ai-interview/interviewAgent.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InterviewAgent",
    ()=>InterviewAgent
]);
/**
 * Interview Agent - Main orchestrator for interview flow
 * Server-only: manages conversation history, scoring, and report generation
 * Supports LLM-powered dynamic questions when API key is available
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$questionEngine$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/questionEngine.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$answerAnalyzer$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/answerAnalyzer.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$reportGenerator$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/reportGenerator.js [api] (ecmascript)");
;
;
;
class InterviewAgent {
    constructor(apiKey){
        this.questionEngine = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$questionEngine$2e$js__$5b$api$5d$__$28$ecmascript$29$__["QuestionEngine"]();
        this.answerAnalyzer = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$answerAnalyzer$2e$js__$5b$api$5d$__$28$ecmascript$29$__["AnswerAnalyzer"]();
        this.reportGenerator = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$reportGenerator$2e$js__$5b$api$5d$__$28$ecmascript$29$__["ReportGenerator"]();
        this.apiKey = apiKey;
        this.conversationHistory = [];
        this.isInterviewActive = false;
        this.currentQuestion = null;
        this.startTime = Date.now();
    }
    /**
   * Initialize interview — returns greeting + first question
   */ initializeInterview() {
        this.questionEngine.reset();
        this.answerAnalyzer.reset();
        this.conversationHistory = [];
        this.isInterviewActive = true;
        this.startTime = Date.now();
        const greetings = [
            "Hello! I'm your AI interviewer today. Welcome to this technical interview session. We'll go through 6 questions covering different areas of software engineering. Take your time with each answer, and feel free to think out loud — I'm interested in your thought process as much as your final answer. Let's get started!",
            "Hi there! Thanks for joining this interview. I'll be asking you 6 technical questions across various topics. Don't worry about getting everything perfect — I want to understand how you think and approach problems. Ready? Let's begin!",
            "Welcome! I'm excited to conduct your technical interview today. We'll cover 6 questions spanning programming fundamentals, data structures, system design, and more. Just be natural and explain your thinking — there are no trick questions here. Let's dive in!"
        ];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        this.conversationHistory.push({
            role: "interviewer",
            content: greeting,
            type: "greeting",
            timestamp: new Date()
        });
        const firstQ = this.questionEngine.startInterview();
        this.conversationHistory.push({
            role: "interviewer",
            content: firstQ.question,
            type: "question",
            questionNumber: firstQ.questionNumber,
            totalQuestions: firstQ.totalQuestions,
            timestamp: new Date()
        });
        this.currentQuestion = firstQ.question;
        return {
            greeting,
            question: firstQ.question,
            questionNumber: firstQ.questionNumber,
            totalQuestions: firstQ.totalQuestions,
            difficulty: firstQ.difficulty || "easy"
        };
    }
    /**
   * Process user answer — uses LLM for analysis and next question when available
   * @param {string} userAnswer - The user's answer text
   * @param {object} llmAnalysis - Pre-computed analysis scores (or null)
   */ async processAnswer(userAnswer, llmAnalysis) {
        if (!this.isInterviewActive) {
            throw new Error("Interview is not active");
        }
        // Record user answer
        this.conversationHistory.push({
            role: "candidate",
            content: userAnswer,
            type: "answer",
            timestamp: new Date()
        });
        // Try LLM analysis if not already provided and API key exists
        if (!llmAnalysis && this.apiKey) {
            try {
                llmAnalysis = await this.answerAnalyzer.analyzeWithLLM(this.apiKey, this.currentQuestion, userAnswer, this.conversationHistory);
            } catch (e) {
                console.error("LLM analysis fallback:", e);
            }
        }
        // Run analysis (merges LLM scores with local heuristics)
        const analysis = this.answerAnalyzer.analyzeAnswer(this.currentQuestion, userAnswer, llmAnalysis);
        // Build response
        const response = {
            feedback: llmAnalysis?.feedback || this._generateLocalFeedback(analysis),
            analysis: {
                technical_correctness: analysis.scores.technical,
                depth_of_explanation: analysis.scores.depthOfExplanation,
                clarity: analysis.scores.clarity,
                confidence: analysis.scores.confidence
            }
        };
        // Record feedback
        this.conversationHistory.push({
            role: "interviewer",
            content: response.feedback,
            type: "feedback",
            timestamp: new Date()
        });
        // Check completion
        const progress = this.questionEngine.getProgress();
        if (progress.questionsAsked >= 6) {
            this.isInterviewActive = false;
            response.interviewComplete = true;
            response.report = this.generateFinalReport();
        } else {
            // Generate next question — try LLM first, fall back to pool
            const nextQ = await this.questionEngine.generateNextQuestionLLM(this.apiKey, this.conversationHistory, analysis.scores.technical, userAnswer);
            if (nextQ) {
                this.conversationHistory.push({
                    role: "interviewer",
                    content: nextQ.question,
                    type: "question",
                    questionNumber: nextQ.questionNumber,
                    totalQuestions: nextQ.totalQuestions,
                    timestamp: new Date()
                });
                this.currentQuestion = nextQ.question;
                response.nextQuestion = nextQ.question;
                response.questionNumber = nextQ.questionNumber;
                response.totalQuestions = nextQ.totalQuestions;
                response.difficulty = nextQ.difficulty || this.questionEngine.difficulty;
                response.interviewComplete = false;
            }
        }
        return response;
    }
    /**
   * Get formatted conversation context for external use
   */ getConversationContext() {
        return this.conversationHistory.map((entry)=>({
                role: entry.role,
                type: entry.type,
                content: entry.content,
                timestamp: entry.timestamp
            }));
    }
    _generateLocalFeedback(analysis) {
        const tech = analysis.scores.technical;
        const depth = analysis.scores.depthOfExplanation;
        let fb = "Thank you for your answer. ";
        if (tech >= 80) fb += "You showed strong technical understanding. ";
        else if (tech >= 60) fb += "Good attempt — you covered the key points. ";
        else fb += "Consider reviewing the fundamentals of this topic. ";
        if (depth >= 75) fb += "Your explanation was thorough and detailed. ";
        else if (depth < 55) fb += "Try to provide more detailed explanations with examples. ";
        fb += "Let's move on to the next question.";
        return fb;
    }
    generateFinalReport() {
        return this.reportGenerator.generateReport(this.answerAnalyzer.analysisHistory);
    }
    getState() {
        return {
            isActive: this.isInterviewActive,
            currentQuestion: this.currentQuestion,
            progress: this.questionEngine.getProgress(),
            conversationHistory: this.conversationHistory
        };
    }
    endInterview() {
        this.isInterviewActive = false;
        return this.generateFinalReport();
    }
}
;
}),
"[project]/src/modules/ai-interview/sessionStore.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "deleteSession",
    ()=>deleteSession,
    "generateInterviewId",
    ()=>generateInterviewId,
    "getSession",
    ()=>getSession
]);
/**
 * Shared Session Store - Single source of truth for active interview sessions
 * Imported by all API routes to ensure session state is shared
 */ const activeInterviews = new Map();
// Cleanup stale sessions every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000;
const SESSION_TTL = 60 * 60 * 1000; // 1 hour
let cleanupTimer = null;
function startCleanup() {
    if (cleanupTimer) return;
    cleanupTimer = setInterval(()=>{
        const now = Date.now();
        for (const [id, session] of activeInterviews){
            if (now - session.lastActivity > SESSION_TTL) {
                activeInterviews.delete(id);
            }
        }
    }, CLEANUP_INTERVAL);
    // Don't block Node.js from exiting
    if (cleanupTimer.unref) cleanupTimer.unref();
}
startCleanup();
function createSession(id, agent) {
    const session = {
        agent,
        createdAt: Date.now(),
        lastActivity: Date.now()
    };
    activeInterviews.set(id, session);
    return session;
}
function getSession(id) {
    const session = activeInterviews.get(id);
    if (session) {
        session.lastActivity = Date.now();
    }
    return session;
}
function deleteSession(id) {
    activeInterviews.delete(id);
}
function generateInterviewId() {
    return `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
}),
"[project]/src/modules/ai-interview/demoConfig.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Demo Configuration - Pre-scripted interview data for demo/offline mode
 * Full 6-question demo with adaptive follow-ups and final report
 */ __turbopack_context__.s([
    "DEMO_ANALYSES",
    ()=>DEMO_ANALYSES,
    "DEMO_ANSWERS",
    ()=>DEMO_ANSWERS,
    "DEMO_FEEDBACK",
    ()=>DEMO_FEEDBACK,
    "DEMO_QUESTIONS",
    ()=>DEMO_QUESTIONS,
    "DEMO_REPORT",
    ()=>DEMO_REPORT
]);
const DEMO_QUESTIONS = [
    {
        q: "Tell me about your programming experience. What languages have you worked with and what do you enjoy most about coding?",
        topic: "Programming fundamentals",
        difficulty: "easy"
    },
    {
        q: "Can you explain what a data structure is and give me some examples? When would you choose one over another?",
        topic: "Data structures",
        difficulty: "easy"
    },
    {
        q: "Explain how a hash map works internally. What happens during a collision, and how is it resolved?",
        topic: "Data structures",
        difficulty: "medium"
    },
    {
        q: "What's the difference between REST and GraphQL APIs? When would you use each approach?",
        topic: "Web development",
        difficulty: "medium"
    },
    {
        q: "How would you optimize a slow database query? Walk me through your approach and the tools you'd use.",
        topic: "Database design",
        difficulty: "medium"
    },
    {
        q: "Design a URL shortener like bit.ly. What are the key components, data model, and how would you handle scale?",
        topic: "System design",
        difficulty: "hard"
    }
];
const DEMO_ANSWERS = [
    "I've been programming for about 3 years. I'm most comfortable with Python and JavaScript. I've used Python for backend development and data science projects, while JavaScript has been my primary tool for frontend development in React. I also have some experience with Java from university coursework. What I enjoy most is the problem-solving aspect — taking a complex problem and breaking it down into smaller, manageable pieces.",
    "Data structures are ways to organize and store data efficiently. Common ones include arrays for sequential access, linked lists for dynamic sizing, hash maps for fast key-value lookups, stacks for LIFO operations, and queues for FIFO. I'd choose an array when I need index-based access, a hash map for lookups, and a linked list when I need frequent insertions and deletions.",
    "A hash map uses a hash function to compute an index into an array of buckets. When you insert a key-value pair, the hash function transforms the key into an array index. The main advantage is O(1) average lookups. Collisions happen when two keys hash to the same index — they're resolved using chaining (linked list at each bucket) or open addressing (probing for the next empty slot). In the worst case with many collisions, performance can degrade to O(n).",
    "REST uses standard HTTP methods with resource-based URLs and returns data in a fixed structure. GraphQL uses a single endpoint where the client specifies exactly what data it needs through queries. REST is simpler and benefits from HTTP caching, but can lead to over-fetching or under-fetching. GraphQL is better when you have complex, nested data requirements or need to reduce the number of API calls. I'd use REST for simple CRUD APIs and GraphQL for complex frontends.",
    "First, I'd analyze the query execution plan using EXPLAIN to identify bottlenecks. Common optimizations include: adding proper indexes on frequently queried columns, avoiding SELECT * and only fetching needed columns, optimizing JOINs by ensuring foreign keys are indexed, using query caching, and considering denormalization for read-heavy workloads. I'd also check for N+1 query problems and consider using pagination for large result sets.",
    "For a URL shortener, the key components are: a web server for the API, a database to store URL mappings, and a hash/encoding function. I'd use Base62 encoding on an auto-incrementing ID to generate short codes. The data model needs a table with columns for the short code, original URL, creation date, and click count. For scale, I'd add a caching layer like Redis for popular URLs, use a load balancer, and consider partitioning the database. Read-heavy workload means I'd optimize for reads with caching and CDN."
];
const DEMO_FEEDBACK = [
    "Good overview of your background! You clearly articulate your experience and what motivates you. The mention of specific technologies and use cases shows practical experience.",
    "Nice explanation! You covered the key data structures with their use cases. The comparison between them shows you understand the trade-offs involved in choosing the right structure.",
    "Strong answer on hash maps! You explained the internal mechanism clearly and covered collision resolution strategies well. Mentioning the worst-case complexity shows analytical thinking.",
    "Great comparison! You highlighted the key differences and trade-offs between REST and GraphQL. Your recommendation of when to use each shows practical judgment.",
    "Thorough approach to query optimization! You covered multiple angles from indexing to execution plans. Mentioning N+1 problems and pagination shows real-world experience.",
    "Solid system design answer! You covered the core components, data model, and scaling considerations. The mention of caching, load balancing, and database partitioning shows you think about scale."
];
const DEMO_ANALYSES = [
    {
        technical_correctness: 72,
        depth_of_explanation: 70,
        clarity: 80,
        confidence: 75
    },
    {
        technical_correctness: 78,
        depth_of_explanation: 75,
        clarity: 82,
        confidence: 74
    },
    {
        technical_correctness: 85,
        depth_of_explanation: 82,
        clarity: 78,
        confidence: 80
    },
    {
        technical_correctness: 80,
        depth_of_explanation: 78,
        clarity: 85,
        confidence: 76
    },
    {
        technical_correctness: 82,
        depth_of_explanation: 80,
        clarity: 75,
        confidence: 78
    },
    {
        technical_correctness: 75,
        depth_of_explanation: 72,
        clarity: 70,
        confidence: 68
    }
];
const DEMO_REPORT = {
    overall_score: 78,
    technical_knowledge: 80,
    problem_solving: 75,
    communication: 82,
    confidence: 74,
    strengths: [
        "Good understanding of data structures and hash maps",
        "Clear and structured communication with examples",
        "Practical knowledge of database optimization",
        "Solid system design thinking with scaling considerations"
    ],
    weaknesses: [
        "Could go deeper on system design trade-offs",
        "Needs more practice with algorithm complexity analysis",
        "Could strengthen explanations with more concrete examples"
    ],
    recommendations: [
        "Practice LeetCode problems focusing on Big O analysis",
        "Study system design patterns — read 'Designing Data-Intensive Applications'",
        "Record yourself explaining solutions to improve delivery",
        "Work through distributed systems concepts (CAP theorem, consensus)",
        "Practice mock interviews more frequently to build confidence"
    ],
    total_questions: 6,
    interview_duration: "18-24 minutes",
    generated_at: new Date().toISOString()
};
}),
"[project]/src/modules/ai-interview/speechProcessor.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Speech Processor - Consolidated voice handling module
 * Handles Whisper API transcription and speech config
 */ /**
 * Transcribe audio buffer using OpenAI Whisper API
 * @param {Buffer} audioBuffer - Raw audio data
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<{transcript: string, success: boolean}>}
 */ __turbopack_context__.s([
    "getSpeechConfig",
    ()=>getSpeechConfig,
    "transcribeAudio",
    ()=>transcribeAudio
]);
async function transcribeAudio(audioBuffer, apiKey) {
    if (!apiKey) {
        return {
            transcript: "",
            success: false,
            message: "No API key configured"
        };
    }
    try {
        const formData = new FormData();
        const blob = new Blob([
            audioBuffer
        ], {
            type: "audio/webm"
        });
        formData.append("file", blob, "audio.webm");
        formData.append("model", "whisper-1");
        formData.append("language", "en");
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`
            },
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Whisper API returned ${response.status}`);
        }
        const data = await response.json();
        return {
            transcript: data.text || "",
            success: true
        };
    } catch (error) {
        console.error("Whisper transcription error:", error);
        return {
            transcript: "",
            success: false,
            message: error.message
        };
    }
}
function getSpeechConfig() {
    return {
        language: "en-US",
        continuous: true,
        interimResults: false,
        maxDuration: 120,
        sampleRate: 16000
    };
}
}),
"[project]/src/modules/ai-interview/index.js [api] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * AI Interview Module - ESM barrel file
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$interviewAgent$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/interviewAgent.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$questionEngine$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/questionEngine.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$answerAnalyzer$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/answerAnalyzer.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$reportGenerator$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/reportGenerator.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$sessionStore$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/sessionStore.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/demoConfig.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$speechProcessor$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/speechProcessor.js [api] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/pages/api/ai-interview/start.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
/**
 * API: POST /api/ai-interview/start
 * Initializes a new interview session with shared session store
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$index$2e$js__$5b$api$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/index.js [api] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$interviewAgent$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/interviewAgent.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$sessionStore$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/sessionStore.js [api] (ecmascript)");
;
function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    try {
        const interviewId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$sessionStore$2e$js__$5b$api$5d$__$28$ecmascript$29$__["generateInterviewId"])();
        const agent = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$interviewAgent$2e$js__$5b$api$5d$__$28$ecmascript$29$__["InterviewAgent"](process.env.OPENAI_API_KEY);
        const initData = agent.initializeInterview();
        // Store in shared session store
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$sessionStore$2e$js__$5b$api$5d$__$28$ecmascript$29$__["createSession"])(interviewId, agent);
        res.status(200).json({
            interviewId,
            greeting: initData.greeting,
            question: initData.question,
            questionNumber: initData.questionNumber,
            totalQuestions: initData.totalQuestions
        });
    } catch (error) {
        console.error("Error starting interview:", error);
        res.status(500).json({
            error: "Failed to start interview"
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__53fc1a12._.js.map