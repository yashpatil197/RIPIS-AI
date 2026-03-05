/**
 * API: POST /api/ai-interview/answer
 * Processes a user answer: runs LLM analysis, generates next question or report
 * The agent handles LLM calls internally — no separate analysis needed
 */

import { getSession, deleteSession } from "@/modules/ai-interview";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { interviewId, answer } = req.body;

  if (!interviewId || !answer) {
    return res.status(400).json({ error: "Missing interviewId or answer" });
  }

  try {
    const session = getSession(interviewId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found. Please start a new interview." });
    }

    const { agent } = session;

    // Process the answer — agent handles LLM analysis internally
    const response = await agent.processAnswer(answer, null);

    // Schedule cleanup if interview is complete
    if (response.interviewComplete) {
      setTimeout(() => deleteSession(interviewId), 5 * 60 * 1000);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error processing answer:", error);
    res.status(500).json({ error: "Failed to process answer" });
  }
}
