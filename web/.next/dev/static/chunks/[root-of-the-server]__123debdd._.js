(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/modules/ai-interview/demoConfig.js [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useInterviewState.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useInterviewState",
    ()=>useInterviewState
]);
/**
 * useInterviewState - Main state management hook for the interview
 * Supports live mode (API calls) and demo mode (pre-scripted flow)
 * Tracks difficulty, question history, and elapsed time
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/ai-interview/demoConfig.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const useInterviewState = ()=>{
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        isActive: false,
        currentQuestionNumber: 0,
        totalQuestions: 6,
        messages: [],
        currentQuestion: null,
        isLoading: false,
        interviewComplete: false,
        report: null,
        interviewId: null,
        error: null,
        isDemo: false,
        difficulty: "easy",
        questionHistory: [],
        elapsedTime: 0
    });
    const interviewRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const demoStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Elapsed time tracking
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useInterviewState.useEffect": ()=>{
            if (state.isActive && !state.interviewComplete) {
                timerRef.current = setInterval({
                    "useInterviewState.useEffect": ()=>{
                        setState({
                            "useInterviewState.useEffect": (p)=>({
                                    ...p,
                                    elapsedTime: p.elapsedTime + 1
                                })
                        }["useInterviewState.useEffect"]);
                    }
                }["useInterviewState.useEffect"], 1000);
            } else if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            return ({
                "useInterviewState.useEffect": ()=>{
                    if (timerRef.current) clearInterval(timerRef.current);
                }
            })["useInterviewState.useEffect"];
        }
    }["useInterviewState.useEffect"], [
        state.isActive,
        state.interviewComplete
    ]);
    // ─── Start Live Interview ───
    const startInterview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInterviewState.useCallback[startInterview]": async ()=>{
            setState({
                "useInterviewState.useCallback[startInterview]": (p)=>({
                        ...p,
                        isActive: true,
                        isLoading: true,
                        messages: [],
                        error: null,
                        interviewComplete: false,
                        report: null,
                        isDemo: false,
                        questionHistory: [],
                        elapsedTime: 0,
                        difficulty: "easy"
                    })
            }["useInterviewState.useCallback[startInterview]"]);
            try {
                const res = await fetch("/api/ai-interview/start", {
                    method: "POST"
                });
                if (!res.ok) throw new Error("Failed to start interview");
                const data = await res.json();
                setState({
                    "useInterviewState.useCallback[startInterview]": (p)=>({
                            ...p,
                            messages: [
                                {
                                    id: "greeting",
                                    type: "interviewer",
                                    content: data.greeting,
                                    timestamp: new Date()
                                },
                                {
                                    id: "q-1",
                                    type: "interviewer",
                                    content: data.question,
                                    questionNumber: data.questionNumber,
                                    totalQuestions: data.totalQuestions,
                                    timestamp: new Date()
                                }
                            ],
                            currentQuestion: data.question,
                            currentQuestionNumber: data.questionNumber,
                            isLoading: false,
                            interviewId: data.interviewId,
                            difficulty: data.difficulty || "easy"
                        })
                }["useInterviewState.useCallback[startInterview]"]);
                interviewRef.current = {
                    id: data.interviewId
                };
            } catch (error) {
                console.error("Failed to start interview:", error);
                setState({
                    "useInterviewState.useCallback[startInterview]": (p)=>({
                            ...p,
                            isActive: false,
                            isLoading: false,
                            error: "Failed to start interview. Please try again."
                        })
                }["useInterviewState.useCallback[startInterview]"]);
            }
        }
    }["useInterviewState.useCallback[startInterview]"], []);
    // ─── Start Demo Interview ───
    const startDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInterviewState.useCallback[startDemo]": ()=>{
            demoStep.current = 0;
            setState({
                "useInterviewState.useCallback[startDemo]": (p)=>({
                        ...p,
                        isActive: true,
                        isLoading: false,
                        isDemo: true,
                        interviewComplete: false,
                        report: null,
                        error: null,
                        currentQuestionNumber: 1,
                        totalQuestions: 6,
                        currentQuestion: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_QUESTIONS"][0].q,
                        difficulty: "easy",
                        questionHistory: [],
                        elapsedTime: 0,
                        messages: [
                            {
                                id: "greeting",
                                type: "interviewer",
                                content: "Hello! Welcome to this demo interview. I'll ask you 6 technical questions — you can type any answer or just hit submit to see the pre-scripted flow. Let's begin!",
                                timestamp: new Date()
                            },
                            {
                                id: "q-1",
                                type: "interviewer",
                                content: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_QUESTIONS"][0].q,
                                questionNumber: 1,
                                totalQuestions: 6,
                                timestamp: new Date()
                            }
                        ]
                    })
            }["useInterviewState.useCallback[startDemo]"]);
        }
    }["useInterviewState.useCallback[startDemo]"], []);
    // ─── Submit Answer ───
    const submitAnswer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInterviewState.useCallback[submitAnswer]": async (userAnswer)=>{
            // Add user message immediately
            setState({
                "useInterviewState.useCallback[submitAnswer]": (p)=>({
                        ...p,
                        isLoading: true,
                        messages: [
                            ...p.messages,
                            {
                                id: `a-${p.messages.length}`,
                                type: "candidate",
                                content: userAnswer,
                                timestamp: new Date()
                            }
                        ]
                    })
            }["useInterviewState.useCallback[submitAnswer]"]);
            // Demo mode
            if (state.isDemo) {
                await new Promise({
                    "useInterviewState.useCallback[submitAnswer]": (r)=>setTimeout(r, 1200)
                }["useInterviewState.useCallback[submitAnswer]"]); // Simulate thinking
                const step = demoStep.current;
                const analysis = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_ANALYSES"][step];
                const feedback = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_FEEDBACK"][step];
                const nextStep = step + 1;
                demoStep.current = nextStep;
                setState({
                    "useInterviewState.useCallback[submitAnswer]": (p)=>{
                        const newMsgs = [
                            ...p.messages,
                            {
                                id: `fb-${step}`,
                                type: "interviewer",
                                content: feedback,
                                analysis: {
                                    technical_correctness: analysis.technical_correctness,
                                    depth_of_explanation: analysis.depth_of_explanation,
                                    clarity: analysis.clarity,
                                    confidence: analysis.confidence
                                },
                                timestamp: new Date()
                            }
                        ];
                        const newHistory = [
                            ...p.questionHistory,
                            {
                                question: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_QUESTIONS"][step].q,
                                score: Math.round((analysis.technical_correctness + analysis.depth_of_explanation + analysis.clarity + analysis.confidence) / 4),
                                difficulty: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_QUESTIONS"][step].difficulty
                            }
                        ];
                        if (nextStep >= 6) {
                            newMsgs.push({
                                id: "complete",
                                type: "system",
                                content: "Interview Complete! 🎉",
                                timestamp: new Date()
                            });
                            return {
                                ...p,
                                messages: newMsgs,
                                isLoading: false,
                                interviewComplete: true,
                                report: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_REPORT"],
                                questionHistory: newHistory
                            };
                        }
                        newMsgs.push({
                            id: `q-${nextStep + 1}`,
                            type: "interviewer",
                            content: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_QUESTIONS"][nextStep].q,
                            questionNumber: nextStep + 1,
                            totalQuestions: 6,
                            timestamp: new Date()
                        });
                        return {
                            ...p,
                            messages: newMsgs,
                            currentQuestion: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_QUESTIONS"][nextStep].q,
                            currentQuestionNumber: nextStep + 1,
                            isLoading: false,
                            difficulty: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$ai$2d$interview$2f$demoConfig$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEMO_QUESTIONS"][nextStep].difficulty || p.difficulty,
                            questionHistory: newHistory
                        };
                    }
                }["useInterviewState.useCallback[submitAnswer]"]);
                return;
            }
            // Live mode
            try {
                const res = await fetch("/api/ai-interview/answer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        interviewId: state.interviewId,
                        answer: userAnswer
                    })
                });
                if (!res.ok) throw new Error("Failed to submit answer");
                const data = await res.json();
                setState({
                    "useInterviewState.useCallback[submitAnswer]": (p)=>{
                        const newMsgs = [
                            ...p.messages,
                            {
                                id: `fb-${p.messages.length}`,
                                type: "interviewer",
                                content: data.feedback,
                                analysis: data.analysis,
                                timestamp: new Date()
                            }
                        ];
                        const avgScore = data.analysis ? Math.round((data.analysis.technical_correctness + data.analysis.depth_of_explanation + data.analysis.clarity + data.analysis.confidence) / 4) : 70;
                        const newHistory = [
                            ...p.questionHistory,
                            {
                                question: p.currentQuestion,
                                score: avgScore,
                                difficulty: data.difficulty || p.difficulty
                            }
                        ];
                        if (data.interviewComplete) {
                            newMsgs.push({
                                id: "complete",
                                type: "system",
                                content: "Interview Complete! 🎉",
                                timestamp: new Date()
                            });
                            return {
                                ...p,
                                messages: newMsgs,
                                isLoading: false,
                                interviewComplete: true,
                                report: data.report,
                                questionHistory: newHistory
                            };
                        }
                        if (data.nextQuestion) {
                            newMsgs.push({
                                id: `q-${data.questionNumber}`,
                                type: "interviewer",
                                content: data.nextQuestion,
                                questionNumber: data.questionNumber,
                                totalQuestions: data.totalQuestions,
                                timestamp: new Date()
                            });
                        }
                        return {
                            ...p,
                            messages: newMsgs,
                            currentQuestion: data.nextQuestion || null,
                            currentQuestionNumber: data.questionNumber || p.currentQuestionNumber,
                            isLoading: false,
                            interviewComplete: data.interviewComplete || false,
                            report: data.report || null,
                            difficulty: data.difficulty || p.difficulty,
                            questionHistory: newHistory
                        };
                    }
                }["useInterviewState.useCallback[submitAnswer]"]);
            } catch (error) {
                console.error("Failed to submit answer:", error);
                setState({
                    "useInterviewState.useCallback[submitAnswer]": (p)=>({
                            ...p,
                            isLoading: false,
                            error: "Failed to submit answer. Please try again."
                        })
                }["useInterviewState.useCallback[submitAnswer]"]);
            }
        }
    }["useInterviewState.useCallback[submitAnswer]"], [
        state.interviewId,
        state.isDemo
    ]);
    const endInterview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInterviewState.useCallback[endInterview]": ()=>{
            setState({
                "useInterviewState.useCallback[endInterview]": (p)=>({
                        ...p,
                        isActive: false,
                        interviewComplete: true
                    })
            }["useInterviewState.useCallback[endInterview]"]);
        }
    }["useInterviewState.useCallback[endInterview]"], []);
    const resetInterview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInterviewState.useCallback[resetInterview]": ()=>{
            demoStep.current = 0;
            setState({
                isActive: false,
                currentQuestionNumber: 0,
                totalQuestions: 6,
                messages: [],
                currentQuestion: null,
                isLoading: false,
                interviewComplete: false,
                report: null,
                interviewId: null,
                error: null,
                isDemo: false,
                difficulty: "easy",
                questionHistory: [],
                elapsedTime: 0
            });
            interviewRef.current = null;
        }
    }["useInterviewState.useCallback[resetInterview]"], []);
    // Format elapsed time
    const formatTime = (seconds)=>{
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };
    return {
        ...state,
        startInterview,
        startDemo,
        submitAnswer,
        endInterview,
        resetInterview,
        formattedTime: formatTime(state.elapsedTime)
    };
};
_s(useInterviewState, "/C+59CBRyv4FHUUP1uAE8CrFQqQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/interview/InterviewMessage.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * InterviewMessage - Chat bubble with avatar, animated entry, and analysis scores
 * Premium dark glassmorphism theme with micro-animations
 */ __turbopack_context__.s([
    "default",
    ()=>InterviewMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function InterviewMessage({ message }) {
    const isInterviewer = message.type === "interviewer";
    const isCandidate = message.type === "candidate";
    const isSystem = message.type === "system";
    if (isSystem) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center my-4 animate-scale-in",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 py-2 rounded-full text-sm font-medium",
                style: {
                    background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.15))",
                    color: "#4ade80",
                    border: "1px solid rgba(34,197,94,0.2)"
                },
                children: message.content
            }, void 0, false, {
                fileName: "[project]/src/components/interview/InterviewMessage.js",
                lineNumber: 14,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/interview/InterviewMessage.js",
            lineNumber: 13,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex ${isInterviewer ? "justify-start animate-slide-in-left" : "justify-end animate-slide-in-right"} mb-4`,
        children: [
            isInterviewer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm mr-3 mt-1 animate-pulse-glow",
                style: {
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)"
                },
                children: "🤖"
            }, void 0, false, {
                fileName: "[project]/src/components/interview/InterviewMessage.js",
                lineNumber: 25,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `max-w-[75%] lg:max-w-[65%] px-4 py-3 rounded-2xl ${isInterviewer ? "rounded-tl-sm" : "rounded-tr-sm"}`,
                style: {
                    background: isInterviewer ? "rgba(31, 41, 55, 0.7)" : "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.2))",
                    border: isInterviewer ? "1px solid rgba(55, 65, 81, 0.5)" : "1px solid rgba(99,102,241,0.3)",
                    backdropFilter: "blur(8px)"
                },
                children: [
                    message.questionNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-medium mb-1.5 tracking-wider uppercase",
                        style: {
                            color: "rgba(139,92,246,0.8)"
                        },
                        children: [
                            "Question ",
                            message.questionNumber,
                            " of ",
                            message.totalQuestions
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/interview/InterviewMessage.js",
                        lineNumber: 43,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm leading-relaxed text-gray-200",
                        children: message.content
                    }, void 0, false, {
                        fileName: "[project]/src/components/interview/InterviewMessage.js",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    message.analysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 pt-3 animate-fade-in-up",
                        style: {
                            borderTop: "1px solid rgba(75,85,99,0.3)",
                            animationDelay: "0.3s"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                                {
                                    label: "Technical",
                                    value: message.analysis.technical_correctness,
                                    color: "#3b82f6"
                                },
                                {
                                    label: "Depth",
                                    value: message.analysis.depth_of_explanation,
                                    color: "#8b5cf6"
                                },
                                {
                                    label: "Clarity",
                                    value: message.analysis.clarity,
                                    color: "#10b981"
                                },
                                {
                                    label: "Confidence",
                                    value: message.analysis.confidence,
                                    color: "#f59e0b"
                                }
                            ].map(({ label, value, color }, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between mb-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-gray-400",
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/interview/InterviewMessage.js",
                                                        lineNumber: 64,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-semibold",
                                                        style: {
                                                            color
                                                        },
                                                        children: [
                                                            value,
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/interview/InterviewMessage.js",
                                                        lineNumber: 65,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/interview/InterviewMessage.js",
                                                lineNumber: 63,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-1 rounded-full",
                                                style: {
                                                    background: "rgba(55,65,81,0.5)"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-full rounded-full score-bar-fill",
                                                    style: {
                                                        width: `${value}%`,
                                                        background: color,
                                                        animationDelay: `${0.4 + idx * 0.15}s`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/InterviewMessage.js",
                                                    lineNumber: 68,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/interview/InterviewMessage.js",
                                                lineNumber: 67,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/interview/InterviewMessage.js",
                                        lineNumber: 62,
                                        columnNumber: 19
                                    }, this)
                                }, label, false, {
                                    fileName: "[project]/src/components/interview/InterviewMessage.js",
                                    lineNumber: 61,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/interview/InterviewMessage.js",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/interview/InterviewMessage.js",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] mt-2",
                        style: {
                            color: "rgba(107,114,128,0.6)"
                        },
                        children: message.timestamp && new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/interview/InterviewMessage.js",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/interview/InterviewMessage.js",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            isCandidate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm ml-3 mt-1",
                style: {
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)"
                },
                children: "👤"
            }, void 0, false, {
                fileName: "[project]/src/components/interview/InterviewMessage.js",
                lineNumber: 88,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/interview/InterviewMessage.js",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = InterviewMessage;
var _c;
__turbopack_context__.k.register(_c, "InterviewMessage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/interview/VoiceRecorder.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VoiceRecorder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
/**
 * VoiceRecorder - Voice input with waveform visualizer and dark theme
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function VoiceRecorder({ onTranscript, onCancel }) {
    _s();
    const [isRecording, setIsRecording] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [useBrowserSpeech, setUseBrowserSpeech] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [audioLevel, setAudioLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioChunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const recognitionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const analyserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VoiceRecorder.useEffect": ()=>{
            return ({
                "VoiceRecorder.useEffect": ()=>{
                    if (timerRef.current) clearInterval(timerRef.current);
                    if (recognitionRef.current) recognitionRef.current.abort();
                    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                }
            })["VoiceRecorder.useEffect"];
        }
    }["VoiceRecorder.useEffect"], []);
    // Audio level analyzer for waveform
    const startAudioAnalysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceRecorder.useCallback[startAudioAnalysis]": (stream)=>{
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const src = audioCtx.createMediaStreamSource(stream);
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                src.connect(analyser);
                analyserRef.current = analyser;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                const tick = {
                    "VoiceRecorder.useCallback[startAudioAnalysis].tick": ()=>{
                        analyser.getByteFrequencyData(dataArray);
                        const avg = dataArray.reduce({
                            "VoiceRecorder.useCallback[startAudioAnalysis].tick": (a, b)=>a + b
                        }["VoiceRecorder.useCallback[startAudioAnalysis].tick"], 0) / dataArray.length;
                        setAudioLevel(avg / 255);
                        animFrameRef.current = requestAnimationFrame(tick);
                    }
                }["VoiceRecorder.useCallback[startAudioAnalysis].tick"];
                tick();
            } catch (e) {
            // Audio analysis not available, non-critical
            }
        }
    }["VoiceRecorder.useCallback[startAudioAnalysis]"], []);
    const startRecording = async ()=>{
        // Try browser SpeechRecognition first
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setUseBrowserSpeech(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = "en-US";
            recognitionRef.current = recognition;
            let transcript = "";
            recognition.onresult = (e)=>{
                for(let i = e.resultIndex; i < e.results.length; i++){
                    if (e.results[i].isFinal) {
                        transcript += e.results[i][0].transcript + " ";
                    }
                }
            };
            recognition.onerror = (e)=>{
                console.error("Speech recognition error:", e.error);
                setIsRecording(false);
                if (timerRef.current) clearInterval(timerRef.current);
            };
            recognition.onend = ()=>{
                setIsRecording(false);
                setIsProcessing(false);
                if (timerRef.current) clearInterval(timerRef.current);
                if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                if (transcript.trim()) {
                    onTranscript(transcript.trim());
                }
            };
            // Also try to get audio stream for visualization
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
                startAudioAnalysis(stream);
            } catch (e) {
            // Visualization won't work but recording still will
            }
            recognition.start();
            setIsRecording(true);
            setDuration(0);
            timerRef.current = setInterval(()=>setDuration((d)=>d + 1), 1000);
            return;
        }
        // Fallback to MediaRecorder
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            startAudioAnalysis(stream);
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (e)=>audioChunksRef.current.push(e.data);
            mediaRecorder.onstop = async ()=>{
                setIsRecording(false);
                setIsProcessing(true);
                if (timerRef.current) clearInterval(timerRef.current);
                if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/webm"
                });
                await processAudio(audioBlob);
                setIsProcessing(false);
                stream.getTracks().forEach((t)=>t.stop());
            };
            mediaRecorder.start();
            setIsRecording(true);
            setDuration(0);
            timerRef.current = setInterval(()=>setDuration((d)=>d + 1), 1000);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please check permissions or use text input.");
        }
    };
    const stopRecording = ()=>{
        if (recognitionRef.current && useBrowserSpeech) {
            setIsProcessing(true);
            recognitionRef.current.stop();
        } else if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
        if (timerRef.current) clearInterval(timerRef.current);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
    const processAudio = async (audioBlob)=>{
        try {
            const formData = new FormData();
            formData.append("audio", audioBlob);
            const res = await fetch("/api/ai-interview/transcribe", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.transcript) {
                onTranscript(data.transcript);
            } else if (data.useBrowserSpeech) {
                alert("Server transcription unavailable. Please use the text input.");
            } else {
                alert("Could not transcribe audio. Please try again or use text input.");
            }
        } catch (error) {
            console.error("Error processing audio:", error);
            alert("Error processing audio. Please use text input.");
        }
    };
    const formatDuration = (s)=>`${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
    // Waveform bars component
    const WaveformBars = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-[2px] h-5",
            children: Array.from({
                length: 12
            }, (_, i)=>{
                const baseHeight = 4;
                const extraHeight = audioLevel * 16 * (1 + Math.sin(Date.now() / 200 + i * 0.5) * 0.5);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "waveform-bar rounded-full",
                    style: {
                        height: `${baseHeight + extraHeight}px`,
                        animationDelay: `${i * 0.08}s`,
                        opacity: 0.5 + audioLevel * 0.5,
                        background: `linear-gradient(180deg, #3b82f6, #8b5cf6)`
                    }
                }, i, false, {
                    fileName: "[project]/src/components/interview/VoiceRecorder.js",
                    lineNumber: 169,
                    columnNumber: 11
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/interview/VoiceRecorder.js",
            lineNumber: 164,
            columnNumber: 5
        }, this);
    if (isRecording) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl p-4 flex items-center justify-between animate-fade-in-up",
            style: {
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-4 h-4 bg-red-500 rounded-full animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/interview/VoiceRecorder.js",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-40"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/interview/VoiceRecorder.js",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/interview/VoiceRecorder.js",
                            lineNumber: 188,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-400 font-medium text-sm",
                            children: "Recording..."
                        }, void 0, false, {
                            fileName: "[project]/src/components/interview/VoiceRecorder.js",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-300 text-sm font-mono",
                            children: formatDuration(duration)
                        }, void 0, false, {
                            fileName: "[project]/src/components/interview/VoiceRecorder.js",
                            lineNumber: 193,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WaveformBars, {}, void 0, false, {
                            fileName: "[project]/src/components/interview/VoiceRecorder.js",
                            lineNumber: 194,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/interview/VoiceRecorder.js",
                    lineNumber: 187,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-16 h-1.5 rounded-full overflow-hidden",
                            style: {
                                background: "rgba(239,68,68,0.2)"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full rounded-full transition-all duration-100",
                                style: {
                                    width: `${audioLevel * 100}%`,
                                    background: "linear-gradient(90deg, #f87171, #ef4444)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/interview/VoiceRecorder.js",
                                lineNumber: 199,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/interview/VoiceRecorder.js",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: stopRecording,
                            className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium text-sm hover:scale-105 active:scale-95",
                            children: "⏹ Stop"
                        }, void 0, false, {
                            fileName: "[project]/src/components/interview/VoiceRecorder.js",
                            lineNumber: 202,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/interview/VoiceRecorder.js",
                    lineNumber: 197,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/interview/VoiceRecorder.js",
            lineNumber: 185,
            columnNumber: 7
        }, this);
    }
    if (isProcessing) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl p-4 flex items-center gap-3 animate-fade-in-up",
            style: {
                background: "rgba(234, 179, 8, 0.1)",
                border: "1px solid rgba(234, 179, 8, 0.3)"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/src/components/interview/VoiceRecorder.js",
                    lineNumber: 215,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-yellow-400 font-medium",
                    children: "Processing speech..."
                }, void 0, false, {
                    fileName: "[project]/src/components/interview/VoiceRecorder.js",
                    lineNumber: 216,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/interview/VoiceRecorder.js",
            lineNumber: 213,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl p-4 flex items-center justify-between animate-fade-in-up",
        style: {
            background: "rgba(59, 130, 246, 0.08)",
            border: "1px solid rgba(59, 130, 246, 0.2)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-blue-300 text-sm",
                children: "🎤 Voice recording ready"
            }, void 0, false, {
                fileName: "[project]/src/components/interview/VoiceRecorder.js",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: startRecording,
                        className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium hover:scale-105 active:scale-95",
                        children: "🎤 Start Recording"
                    }, void 0, false, {
                        fileName: "[project]/src/components/interview/VoiceRecorder.js",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onCancel,
                        className: "px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all text-sm",
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/src/components/interview/VoiceRecorder.js",
                        lineNumber: 230,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/interview/VoiceRecorder.js",
                lineNumber: 225,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/interview/VoiceRecorder.js",
        lineNumber: 222,
        columnNumber: 5
    }, this);
}
_s(VoiceRecorder, "znCacHgy3OjfuF4CYDcxNiWS4jI=");
_c = VoiceRecorder;
var _c;
__turbopack_context__.k.register(_c, "VoiceRecorder");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/interview/AnswerInput.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnswerInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
/**
 * AnswerInput - User input with glassmorphism theme, voice toggle, keyboard shortcuts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$VoiceRecorder$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/VoiceRecorder.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function AnswerInput({ onSubmit, isLoading }) {
    _s();
    const [answer, setAnswer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [useVoice, setUseVoice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const textRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleSubmit = (e)=>{
        e?.preventDefault();
        if (answer.trim() && !isLoading) {
            onSubmit(answer.trim());
            setAnswer("");
            setUseVoice(false);
        }
    };
    const handleKeyDown = (e)=>{
        // Ctrl+Enter or Cmd+Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };
    const handleVoiceTranscript = (transcript)=>{
        setAnswer(transcript);
        setUseVoice(false);
        if (textRef.current) textRef.current.focus();
    };
    const charCount = answer.length;
    const maxChars = 5000;
    const charProgress = Math.min(1, charCount / maxChars);
    // Auto-resize textarea
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnswerInput.useEffect": ()=>{
            if (textRef.current) {
                textRef.current.style.height = "auto";
                textRef.current.style.height = Math.min(textRef.current.scrollHeight, 160) + "px";
            }
        }
    }["AnswerInput.useEffect"], [
        answer
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-t border-gray-700/50 p-4 md:p-5",
        style: {
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(12px)"
        },
        children: [
            useVoice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 animate-fade-in-up",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$VoiceRecorder$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    onTranscript: handleVoiceTranscript,
                    onCancel: ()=>setUseVoice(false)
                }, void 0, false, {
                    fileName: "[project]/src/components/interview/AnswerInput.js",
                    lineNumber: 53,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/interview/AnswerInput.js",
                lineNumber: 52,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "flex flex-col gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                ref: textRef,
                                value: answer,
                                onChange: (e)=>{
                                    if (e.target.value.length <= maxChars) setAnswer(e.target.value);
                                },
                                onKeyDown: handleKeyDown,
                                placeholder: "Type your answer here... (Ctrl+Enter to submit)",
                                className: "w-full p-4 rounded-xl resize-none text-white placeholder-gray-500 focus:outline-none transition-all text-sm leading-relaxed focus-glow",
                                style: {
                                    background: "rgba(31, 41, 55, 0.8)",
                                    border: "1px solid rgba(75, 85, 99, 0.4)",
                                    minHeight: "80px"
                                },
                                disabled: isLoading
                            }, void 0, false, {
                                fileName: "[project]/src/components/interview/AnswerInput.js",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            charCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-3 right-3 w-7 h-7",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-full h-full -rotate-90",
                                        viewBox: "0 0 28 28",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "14",
                                                cy: "14",
                                                r: "11",
                                                fill: "none",
                                                stroke: "rgba(55,65,81,0.4)",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/interview/AnswerInput.js",
                                                lineNumber: 73,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "14",
                                                cy: "14",
                                                r: "11",
                                                fill: "none",
                                                stroke: charProgress > 0.9 ? "#f59e0b" : charProgress > 0.75 ? "#6366f1" : "#3b82f6",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeDasharray: `${charProgress * 69.1} 69.1`,
                                                style: {
                                                    transition: "stroke-dasharray 0.2s ease"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/interview/AnswerInput.js",
                                                lineNumber: 74,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/interview/AnswerInput.js",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `absolute inset-0 flex items-center justify-center text-[8px] font-medium ${charProgress > 0.9 ? "text-amber-400" : "text-gray-500"}`,
                                        children: charCount > 999 ? `${(charCount / 1000).toFixed(1)}k` : charCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/interview/AnswerInput.js",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/interview/AnswerInput.js",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/interview/AnswerInput.js",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setUseVoice(!useVoice),
                                className: `flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${useVoice ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-gray-800 text-gray-400 hover:text-gray-300 border border-gray-700 hover:border-gray-600"}`,
                                disabled: isLoading,
                                children: [
                                    "🎤 ",
                                    useVoice ? "Hide Voice" : "Use Voice"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/interview/AnswerInput.js",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-600 hidden md:block",
                                        children: "Ctrl+Enter"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/interview/AnswerInput.js",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: !answer.trim() || isLoading,
                                        className: "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]",
                                        style: {
                                            background: !answer.trim() || isLoading ? "rgba(59, 130, 246, 0.3)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
                                            color: "white",
                                            boxShadow: answer.trim() && !isLoading ? "0 4px 16px rgba(99,102,241,0.25)" : "none"
                                        },
                                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/AnswerInput.js",
                                                    lineNumber: 116,
                                                    columnNumber: 19
                                                }, this),
                                                "Processing..."
                                            ]
                                        }, void 0, true) : "Submit Answer →"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/interview/AnswerInput.js",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/interview/AnswerInput.js",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/interview/AnswerInput.js",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/interview/AnswerInput.js",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/interview/AnswerInput.js",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(AnswerInput, "5L/RUf+RRZmlu4b8Hz+x4l7JEcs=");
_c = AnswerInput;
var _c;
__turbopack_context__.k.register(_c, "AnswerInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/interview/ProgressIndicator.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * ProgressIndicator - Animated progress bar with step markers and difficulty badge
 */ __turbopack_context__.s([
    "default",
    ()=>ProgressIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function ProgressIndicator({ current, total, complete, difficulty }) {
    const percentage = complete ? 100 : Math.round(current / total * 100);
    const difficultyColors = {
        easy: {
            bg: "rgba(34, 197, 94, 0.15)",
            color: "#4ade80",
            label: "Easy"
        },
        medium: {
            bg: "rgba(245, 158, 11, 0.15)",
            color: "#fbbf24",
            label: "Medium"
        },
        hard: {
            bg: "rgba(239, 68, 68, 0.15)",
            color: "#f87171",
            label: "Hard"
        }
    };
    const diff = difficultyColors[difficulty] || difficultyColors.easy;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 py-3 md:px-6 md:py-4 border-b border-gray-700/50",
        style: {
            background: "rgba(17, 24, 39, 0.9)",
            backdropFilter: "blur(12px)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-lg animate-float",
                                children: "🤖"
                            }, void 0, false, {
                                fileName: "[project]/src/components/interview/ProgressIndicator.js",
                                lineNumber: 21,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold text-white",
                                children: complete ? "Interview Complete" : "AI Technical Interview"
                            }, void 0, false, {
                                fileName: "[project]/src/components/interview/ProgressIndicator.js",
                                lineNumber: 22,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/interview/ProgressIndicator.js",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            !complete && difficulty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-medium px-2 py-0.5 rounded-full transition-all",
                                style: {
                                    background: diff.bg,
                                    color: diff.color
                                },
                                children: diff.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/interview/ProgressIndicator.js",
                                lineNumber: 29,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-medium px-3 py-1 rounded-full",
                                style: {
                                    background: complete ? "rgba(34, 197, 94, 0.15)" : "rgba(59, 130, 246, 0.15)",
                                    color: complete ? "#4ade80" : "#60a5fa"
                                },
                                children: complete ? "✓ Done" : `Q${current} of ${total}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/interview/ProgressIndicator.js",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/interview/ProgressIndicator.js",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/interview/ProgressIndicator.js",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full h-1.5 rounded-full overflow-hidden",
                style: {
                    background: "rgba(55, 65, 81, 0.6)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full rounded-full transition-all duration-700 ease-out",
                    style: {
                        width: `${percentage}%`,
                        background: complete ? "linear-gradient(90deg, #22c55e, #10b981)" : "linear-gradient(90deg, #3b82f6, #8b5cf6, #6366f1)"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/interview/ProgressIndicator.js",
                    lineNumber: 46,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/interview/ProgressIndicator.js",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-2 px-1",
                children: Array.from({
                    length: total
                }, (_, i)=>{
                    const isActive = i === current - 1 && !complete;
                    const isDone = i < current;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `rounded-full transition-all duration-300 ${isActive ? "w-2.5 h-2.5 animate-pulse-glow" : "w-2 h-2"}`,
                        style: {
                            background: isDone ? complete ? "#22c55e" : "#3b82f6" : isActive ? "#8b5cf6" : "rgba(55, 65, 81, 0.6)",
                            transform: isActive ? "scale(1.3)" : "scale(1)"
                        }
                    }, i, false, {
                        fileName: "[project]/src/components/interview/ProgressIndicator.js",
                        lineNumber: 63,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/interview/ProgressIndicator.js",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/interview/ProgressIndicator.js",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = ProgressIndicator;
var _c;
__turbopack_context__.k.register(_c, "ProgressIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/interview/InterviewChat.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InterviewChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
/**
 * InterviewChat - Main interview conversation UI with animated report display
 * Premium dark glassmorphism theme with micro-animations
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$InterviewMessage$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/InterviewMessage.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$AnswerInput$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/AnswerInput.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$ProgressIndicator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/ProgressIndicator.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function InterviewChat({ messages, currentQuestionNumber, totalQuestions, isLoading, onSubmitAnswer, interviewComplete, report, difficulty }) {
    _s();
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [reportVisible, setReportVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InterviewChat.useEffect": ()=>{
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["InterviewChat.useEffect"], [
        messages
    ]);
    // Animate report entrance
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InterviewChat.useEffect": ()=>{
            if (interviewComplete && report) {
                const t = setTimeout({
                    "InterviewChat.useEffect.t": ()=>setReportVisible(true)
                }["InterviewChat.useEffect.t"], 200);
                return ({
                    "InterviewChat.useEffect": ()=>clearTimeout(t)
                })["InterviewChat.useEffect"];
            } else {
                setReportVisible(false);
            }
        }
    }["InterviewChat.useEffect"], [
        interviewComplete,
        report
    ]);
    const handleDownloadReport = ()=>{
        if (!report) return;
        const blob = new Blob([
            JSON.stringify(report, null, 2)
        ], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `interview-report-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    // ─── Report Screen ───
    if (interviewComplete && report) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$ProgressIndicator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    current: currentQuestionNumber,
                    total: totalQuestions,
                    complete: true
                }, void 0, false, {
                    fileName: "[project]/src/components/interview/InterviewChat.js",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex-1 overflow-y-auto p-4 md:p-6 space-y-5 custom-scrollbar ${reportVisible ? "animate-fade-in-up" : "opacity-0"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-4 animate-scale-in",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-3xl font-bold text-white mb-2",
                                    children: "Interview Complete! 🎉"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400",
                                    children: "Here's your comprehensive evaluation report"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/interview/InterviewChat.js",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center animate-scale-in",
                            style: {
                                animationDelay: "0.2s"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-40 h-40",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-full h-full -rotate-90",
                                        viewBox: "0 0 36 36",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831",
                                                fill: "none",
                                                stroke: "rgba(55,65,81,0.4)",
                                                strokeWidth: "2.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/interview/InterviewChat.js",
                                                lineNumber: 66,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831",
                                                fill: "none",
                                                stroke: "url(#scoreGrad)",
                                                strokeWidth: "2.5",
                                                strokeDasharray: `${report.overall_score}, 100`,
                                                strokeLinecap: "round",
                                                style: {
                                                    animation: "strokeDraw 1.5s ease-out forwards"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/interview/InterviewChat.js",
                                                lineNumber: 68,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                    id: "scoreGrad",
                                                    x1: "0%",
                                                    y1: "0%",
                                                    x2: "100%",
                                                    y2: "0%",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                            offset: "0%",
                                                            stopColor: "#3b82f6"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                                            lineNumber: 75,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                            offset: "50%",
                                                            stopColor: "#8b5cf6"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                                            lineNumber: 76,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                            offset: "100%",
                                                            stopColor: "#06b6d4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                                            lineNumber: 77,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 74,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/interview/InterviewChat.js",
                                                lineNumber: 73,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/interview/InterviewChat.js",
                                        lineNumber: 65,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 flex flex-col items-center justify-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-5xl font-bold gradient-text-accent",
                                                children: report.overall_score
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/interview/InterviewChat.js",
                                                lineNumber: 82,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-400 mt-0.5",
                                                children: "Overall Score"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/interview/InterviewChat.js",
                                                lineNumber: 83,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/interview/InterviewChat.js",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/interview/InterviewChat.js",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/interview/InterviewChat.js",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                            children: [
                                {
                                    label: "Technical",
                                    value: report.technical_knowledge,
                                    gradient: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.08))",
                                    border: "rgba(59,130,246,0.25)",
                                    color: "#60a5fa",
                                    icon: "💻"
                                },
                                {
                                    label: "Problem Solving",
                                    value: report.problem_solving,
                                    gradient: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(139,92,246,0.08))",
                                    border: "rgba(139,92,246,0.25)",
                                    color: "#a78bfa",
                                    icon: "🧩"
                                },
                                {
                                    label: "Communication",
                                    value: report.communication,
                                    gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.08))",
                                    border: "rgba(16,185,129,0.25)",
                                    color: "#34d399",
                                    icon: "💬"
                                },
                                {
                                    label: "Confidence",
                                    value: report.confidence,
                                    gradient: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.08))",
                                    border: "rgba(245,158,11,0.25)",
                                    color: "#fbbf24",
                                    icon: "⚡"
                                }
                            ].map(({ label, value, gradient, border, color, icon }, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl p-4 text-center animate-fade-in-up",
                                    style: {
                                        background: gradient,
                                        border: `1px solid ${border}`,
                                        animationDelay: `${0.3 + idx * 0.1}s`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-lg mb-1",
                                            children: icon
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 98,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-400 mb-1",
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 99,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-3xl font-bold",
                                            style: {
                                                color
                                            },
                                            children: value
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 100,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-1 rounded-full mt-2",
                                            style: {
                                                background: "rgba(55,65,81,0.5)"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-full rounded-full score-bar-fill",
                                                style: {
                                                    width: `${value}%`,
                                                    background: color,
                                                    animationDelay: `${0.6 + idx * 0.15}s`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/interview/InterviewChat.js",
                                                lineNumber: 103,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 102,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, label, true, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 96,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/interview/InterviewChat.js",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl p-5 animate-fade-in-up",
                            style: {
                                background: "rgba(34,197,94,0.06)",
                                border: "1px solid rgba(34,197,94,0.15)",
                                animationDelay: "0.7s"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-green-400 mb-3 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "✨"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 114,
                                            columnNumber: 15
                                        }, this),
                                        " Strengths"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: report.strengths.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "text-sm text-gray-300 flex items-start gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-green-400 mt-0.5 flex-shrink-0",
                                                    children: "✓"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 119,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: s
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 120,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 118,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/interview/InterviewChat.js",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl p-5 animate-fade-in-up",
                            style: {
                                background: "rgba(245,158,11,0.06)",
                                border: "1px solid rgba(245,158,11,0.15)",
                                animationDelay: "0.8s"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "📍"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, this),
                                        " Areas for Improvement"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: report.weaknesses.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "text-sm text-gray-300 flex items-start gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-amber-400 mt-0.5 flex-shrink-0",
                                                    children: "→"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 135,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: w
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 136,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 134,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/interview/InterviewChat.js",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl p-5 animate-fade-in-up",
                            style: {
                                background: "rgba(59,130,246,0.06)",
                                border: "1px solid rgba(59,130,246,0.15)",
                                animationDelay: "0.9s"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "🎯"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 146,
                                            columnNumber: 15
                                        }, this),
                                        " Recommendations"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                    className: "space-y-2",
                                    children: report.recommendations.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "text-sm text-gray-300 flex items-start gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-blue-400 font-semibold flex-shrink-0",
                                                    children: [
                                                        i + 1,
                                                        "."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 151,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: r
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 152,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 150,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/interview/InterviewChat.js",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between py-3 px-4 rounded-xl animate-fade-in-up",
                            style: {
                                background: "rgba(31,41,55,0.5)",
                                border: "1px solid rgba(55,65,81,0.3)",
                                animationDelay: "1s"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400 text-sm",
                                    children: [
                                        "Duration: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-300 font-medium",
                                            children: report.interview_duration
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 162,
                                            columnNumber: 25
                                        }, this),
                                        " · ",
                                        "Questions: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-300 font-medium",
                                            children: report.total_questions
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 164,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleDownloadReport,
                                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 transition-all",
                                    style: {
                                        background: "rgba(59,130,246,0.1)",
                                        border: "1px solid rgba(59,130,246,0.2)"
                                    },
                                    children: "📥 Download JSON"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/interview/InterviewChat.js",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: messagesEndRef
                        }, void 0, false, {
                            fileName: "[project]/src/components/interview/InterviewChat.js",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/interview/InterviewChat.js",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/interview/InterviewChat.js",
            lineNumber: 52,
            columnNumber: 7
        }, this);
    }
    // ─── Chat Screen ───
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$ProgressIndicator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                current: currentQuestionNumber,
                total: totalQuestions,
                complete: false,
                difficulty: difficulty
            }, void 0, false, {
                fileName: "[project]/src/components/interview/InterviewChat.js",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar",
                children: [
                    messages.map((message, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$InterviewMessage$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            message: message
                        }, message.id || idx, false, {
                            fileName: "[project]/src/components/interview/InterviewChat.js",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this)),
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3 mb-4 animate-fade-in-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-9 h-9 rounded-full flex items-center justify-center text-sm",
                                style: {
                                    background: "linear-gradient(135deg, #3b82f6, #6366f1)"
                                },
                                children: "🤖"
                            }, void 0, false, {
                                fileName: "[project]/src/components/interview/InterviewChat.js",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 py-3 rounded-2xl rounded-tl-sm",
                                style: {
                                    background: "rgba(31,41,55,0.7)",
                                    border: "1px solid rgba(55,65,81,0.5)"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-2 h-2 bg-gray-500 rounded-full animate-bounce",
                                                    style: {
                                                        animationDelay: "0ms"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 199,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-2 h-2 bg-gray-500 rounded-full animate-bounce",
                                                    style: {
                                                        animationDelay: "150ms"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 200,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-2 h-2 bg-gray-500 rounded-full animate-bounce",
                                                    style: {
                                                        animationDelay: "300ms"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                                    lineNumber: 201,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 198,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-500 ml-1",
                                            children: "AI is thinking..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/interview/InterviewChat.js",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/interview/InterviewChat.js",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/interview/InterviewChat.js",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/interview/InterviewChat.js",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/src/components/interview/InterviewChat.js",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/interview/InterviewChat.js",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            !interviewComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$AnswerInput$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                onSubmit: onSubmitAnswer,
                isLoading: isLoading
            }, void 0, false, {
                fileName: "[project]/src/components/interview/InterviewChat.js",
                lineNumber: 213,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/interview/InterviewChat.js",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
_s(InterviewChat, "VSjGFzttDgI+QOQy2wgkCSASni4=");
_c = InterviewChat;
var _c;
__turbopack_context__.k.register(_c, "InterviewChat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/interview/index.js [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Interview Components - ESM barrel file
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$InterviewChat$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/InterviewChat.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$InterviewMessage$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/InterviewMessage.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$AnswerInput$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/AnswerInput.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$ProgressIndicator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/ProgressIndicator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$VoiceRecorder$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/VoiceRecorder.js [client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/interview/InterviewChat.js [client] (ecmascript) <export default as InterviewChat>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InterviewChat",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$InterviewChat$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$InterviewChat$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/interview/InterviewChat.js [client] (ecmascript)");
}),
"[project]/pages/ai-interview.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AIInterview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
/**
 * AI Interview Page - Premium glassmorphism welcome + interview interface
 * Features animated welcome screen, live time tracking, smooth state transitions
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useInterviewState$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useInterviewState.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/interview/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$InterviewChat$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InterviewChat$3e$__ = __turbopack_context__.i("[project]/src/components/interview/InterviewChat.js [client] (ecmascript) <export default as InterviewChat>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function AIInterview() {
    _s();
    const [showWelcome, setShowWelcome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const interview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useInterviewState$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useInterviewState"])();
    const handleStart = async ()=>{
        setShowWelcome(false);
        await interview.startInterview();
    };
    const handleStartDemo = ()=>{
        setShowWelcome(false);
        interview.startDemo();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "AI 1:1 Interviewer - RIPIS"
                    }, void 0, false, {
                        fileName: "[project]/pages/ai-interview.js",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Practice with a realistic AI technical interviewer that adapts to your skill level"
                    }, void 0, false, {
                        fileName: "[project]/pages/ai-interview.js",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/ai-interview.js",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen text-white",
                style: {
                    background: "linear-gradient(135deg, #0a0a0a 0%, #111827 40%, #0f172a 70%, #0a0a0a 100%)"
                },
                children: showWelcome && !interview.isActive ? /* ═══════════════ WELCOME SCREEN ═══════════════ */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-screen flex items-center justify-center px-4 py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-2xl w-full animate-fade-in-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition mb-8 cursor-pointer",
                                    children: "← Back to Home"
                                }, void 0, false, {
                                    fileName: "[project]/pages/ai-interview.js",
                                    lineNumber: 41,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/ai-interview.js",
                                lineNumber: 40,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center mb-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 animate-float",
                                        style: {
                                            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                            boxShadow: "0 8px 40px rgba(99,102,241,0.35)"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-4xl",
                                            children: "🤖"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/ai-interview.js",
                                            lineNumber: 50,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 48,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-4xl md:text-5xl font-bold mb-3 tracking-tight gradient-text",
                                        children: "AI 1:1 Interviewer"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 52,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg text-gray-400 mb-1",
                                        children: "Practice with a realistic technical interview"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-500",
                                        children: "Adaptive questions • Instant feedback • Detailed report"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 56,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/ai-interview.js",
                                lineNumber: 47,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-10",
                                children: [
                                    {
                                        icon: "🧠",
                                        title: "Adaptive Questions",
                                        desc: "Difficulty adjusts based on your performance across 6 questions",
                                        color: "#3b82f6",
                                        delay: "0.1s"
                                    },
                                    {
                                        icon: "🎯",
                                        title: "Instant Analysis",
                                        desc: "Get scores for technical accuracy, depth, clarity, and confidence",
                                        color: "#8b5cf6",
                                        delay: "0.2s"
                                    },
                                    {
                                        icon: "🎤",
                                        title: "Voice Support",
                                        desc: "Answer with voice or text — your choice, your pace",
                                        color: "#06b6d4",
                                        delay: "0.3s"
                                    },
                                    {
                                        icon: "📊",
                                        title: "Detailed Report",
                                        desc: "Strengths, weaknesses, and personalized recommendations",
                                        color: "#10b981",
                                        delay: "0.4s"
                                    }
                                ].map(({ icon, title, desc, color, delay })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "glass-card glass-card-hover rounded-xl p-5 animate-fade-in-up",
                                        style: {
                                            animationDelay: delay
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3",
                                                style: {
                                                    background: `${color}15`,
                                                    border: `1px solid ${color}30`
                                                },
                                                children: icon
                                            }, void 0, false, {
                                                fileName: "[project]/pages/ai-interview.js",
                                                lineNumber: 69,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-semibold text-white mb-1",
                                                children: title
                                            }, void 0, false, {
                                                fileName: "[project]/pages/ai-interview.js",
                                                lineNumber: 73,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400 leading-relaxed",
                                                children: desc
                                            }, void 0, false, {
                                                fileName: "[project]/pages/ai-interview.js",
                                                lineNumber: 74,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, title, true, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 67,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/ai-interview.js",
                                lineNumber: 60,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl p-6 mb-8 animate-fade-in-up",
                                style: {
                                    background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))",
                                    border: "1px solid rgba(99,102,241,0.15)",
                                    animationDelay: "0.5s"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold text-white mb-4",
                                        children: "How It Works"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 82,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-4 gap-3",
                                        children: [
                                            {
                                                step: "1",
                                                label: "Start",
                                                icon: "🚀"
                                            },
                                            {
                                                step: "2",
                                                label: "Answer",
                                                icon: "💬"
                                            },
                                            {
                                                step: "3",
                                                label: "Feedback",
                                                icon: "📝"
                                            },
                                            {
                                                step: "4",
                                                label: "Report",
                                                icon: "📊"
                                            }
                                        ].map(({ step, label, icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full flex items-center justify-center text-lg mx-auto mb-1.5",
                                                        style: {
                                                            background: "rgba(99,102,241,0.15)",
                                                            border: "1px solid rgba(99,102,241,0.25)"
                                                        },
                                                        children: icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/ai-interview.js",
                                                        lineNumber: 91,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-400",
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/ai-interview.js",
                                                        lineNumber: 95,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, step, true, {
                                                fileName: "[project]/pages/ai-interview.js",
                                                lineNumber: 90,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 83,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/ai-interview.js",
                                lineNumber: 80,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-3 animate-fade-in-up",
                                style: {
                                    animationDelay: "0.6s"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleStart,
                                        className: "w-full py-4 rounded-xl font-semibold text-white text-lg transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group",
                                        style: {
                                            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                            boxShadow: "0 4px 24px rgba(99,102,241,0.3)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "relative z-10",
                                                children: "🚀 Start AI Interview"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/ai-interview.js",
                                                lineNumber: 109,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/ai-interview.js",
                                                lineNumber: 110,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleStartDemo,
                                        className: "w-full py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.005] glass-card-hover",
                                        style: {
                                            background: "rgba(31,41,55,0.5)",
                                            border: "1px solid rgba(55,65,81,0.5)",
                                            color: "#9ca3af"
                                        },
                                        children: "▶ Try Demo Mode"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 112,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-center text-gray-600 text-xs mt-1",
                                        children: "No setup required • 15–20 minutes • Full evaluation report"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/ai-interview.js",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/ai-interview.js",
                        lineNumber: 37,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/ai-interview.js",
                    lineNumber: 36,
                    columnNumber: 11
                }, this) : interview.isActive ? /* ═══════════════ INTERVIEW SCREEN ═══════════════ */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-screen flex flex-col",
                    style: {
                        background: "linear-gradient(180deg, #0f172a 0%, #0a0a0a 100%)"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$interview$2f$InterviewChat$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InterviewChat$3e$__["InterviewChat"], {
                            messages: interview.messages,
                            currentQuestionNumber: interview.currentQuestionNumber,
                            totalQuestions: interview.totalQuestions,
                            isLoading: interview.isLoading,
                            onSubmitAnswer: interview.submitAnswer,
                            interviewComplete: interview.interviewComplete,
                            report: interview.report,
                            difficulty: interview.difficulty
                        }, void 0, false, {
                            fileName: "[project]/pages/ai-interview.js",
                            lineNumber: 131,
                            columnNumber: 13
                        }, this),
                        interview.isActive && !interview.interviewComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between px-4 py-2 border-t border-gray-800/50",
                            style: {
                                background: "rgba(17,24,39,0.9)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-600",
                                            children: interview.isDemo ? "Demo Mode" : "Live Interview"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/ai-interview.js",
                                            lineNumber: 147,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-gray-600 font-mono px-2 py-0.5 rounded",
                                            style: {
                                                background: "rgba(55,65,81,0.3)"
                                            },
                                            children: [
                                                "⏱ ",
                                                interview.formattedTime
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/ai-interview.js",
                                            lineNumber: 150,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/ai-interview.js",
                                    lineNumber: 146,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: interview.endInterview,
                                    className: "px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-800/50 rounded-lg transition-all hover:scale-105",
                                    children: "End Interview"
                                }, void 0, false, {
                                    fileName: "[project]/pages/ai-interview.js",
                                    lineNumber: 155,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/ai-interview.js",
                            lineNumber: 144,
                            columnNumber: 15
                        }, this),
                        interview.interviewComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-3 px-4 py-3 border-t border-gray-800/50",
                            style: {
                                background: "rgba(17,24,39,0.9)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        interview.resetInterview();
                                        setShowWelcome(true);
                                    },
                                    className: "px-5 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95",
                                    style: {
                                        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                        color: "white"
                                    },
                                    children: "Start New Interview"
                                }, void 0, false, {
                                    fileName: "[project]/pages/ai-interview.js",
                                    lineNumber: 165,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-5 py-2 rounded-xl text-sm text-gray-400 hover:text-gray-300 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer",
                                        children: "Back to Home"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/ai-interview.js",
                                        lineNumber: 171,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/ai-interview.js",
                                    lineNumber: 170,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/ai-interview.js",
                            lineNumber: 163,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/ai-interview.js",
                    lineNumber: 129,
                    columnNumber: 11
                }, this) : /* ═══════════════ ERROR / EMPTY STATE ═══════════════ */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-screen flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center animate-fade-in-up",
                        children: [
                            interview.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6 p-4 rounded-xl",
                                style: {
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.2)"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-red-400 text-sm",
                                    children: interview.error
                                }, void 0, false, {
                                    fileName: "[project]/pages/ai-interview.js",
                                    lineNumber: 184,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/ai-interview.js",
                                lineNumber: 183,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    interview.resetInterview();
                                    setShowWelcome(true);
                                },
                                className: "px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105",
                                style: {
                                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                    color: "white"
                                },
                                children: "← Return to Welcome"
                            }, void 0, false, {
                                fileName: "[project]/pages/ai-interview.js",
                                lineNumber: 187,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/ai-interview.js",
                        lineNumber: 181,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/ai-interview.js",
                    lineNumber: 180,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/ai-interview.js",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(AIInterview, "XXo/INP6PxsC3XegMNYtdGoFXic=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useInterviewState$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useInterviewState"]
    ];
});
_c = AIInterview;
var _c;
__turbopack_context__.k.register(_c, "AIInterview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/ai-interview.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/ai-interview";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/ai-interview.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/ai-interview\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/ai-interview.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__123debdd._.js.map