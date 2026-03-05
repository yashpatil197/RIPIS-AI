/**
 * API: POST /api/ai-interview/start
 * Initializes a new interview session with shared session store
 */

import { InterviewAgent, createSession, generateInterviewId } from "@/modules/ai-interview";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const interviewId = generateInterviewId();
    const agent = new InterviewAgent(process.env.OPENAI_API_KEY);
    const initData = agent.initializeInterview();

    // Store in shared session store
    createSession(interviewId, agent);

    res.status(200).json({
      interviewId,
      greeting: initData.greeting,
      question: initData.question,
      questionNumber: initData.questionNumber,
      totalQuestions: initData.totalQuestions,
    });
  } catch (error) {
    console.error("Error starting interview:", error);
    res.status(500).json({ error: "Failed to start interview" });
  }
}
