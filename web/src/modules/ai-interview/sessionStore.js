/**
 * Shared Session Store - Single source of truth for active interview sessions
 * Imported by all API routes to ensure session state is shared
 */

const activeInterviews = new Map();

// Cleanup stale sessions every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000;
const SESSION_TTL = 60 * 60 * 1000; // 1 hour

let cleanupTimer = null;

function startCleanup() {
    if (cleanupTimer) return;
    cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [id, session] of activeInterviews) {
            if (now - session.lastActivity > SESSION_TTL) {
                activeInterviews.delete(id);
            }
        }
    }, CLEANUP_INTERVAL);
    // Don't block Node.js from exiting
    if (cleanupTimer.unref) cleanupTimer.unref();
}

startCleanup();

export function createSession(id, agent) {
    const session = {
        agent,
        createdAt: Date.now(),
        lastActivity: Date.now(),
    };
    activeInterviews.set(id, session);
    return session;
}

export function getSession(id) {
    const session = activeInterviews.get(id);
    if (session) {
        session.lastActivity = Date.now();
    }
    return session;
}

export function deleteSession(id) {
    activeInterviews.delete(id);
}

export function generateInterviewId() {
    return `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
