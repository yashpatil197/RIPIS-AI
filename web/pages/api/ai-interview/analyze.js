/**
 * API: POST /api/ai-interview/analyze
 * Standalone analysis endpoint — analyzes a single answer
 * Dual-mode: OpenAI + enhanced local fallback
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: "Missing question or answer" });
  }

  try {
    if (process.env.OPENAI_API_KEY) {
      return await analyzeWithOpenAI(question, answer, res);
    }
    return analyzeLocally(question, answer, res);
  } catch (error) {
    console.error("Error analyzing answer:", error);
    res.status(500).json({ error: "Failed to analyze answer" });
  }
}

async function analyzeWithOpenAI(question, answer, res) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an experienced technical interview evaluator. Evaluate the candidate's answer to the interview question.

Return a JSON response with these exact fields:
{
  "technical_correctness": number 0-100,
  "depth_of_explanation": number 0-100,
  "clarity": number 0-100,
  "confidence": number 0-100,
  "feedback": "string - brief professional feedback"
}

Be fair and constructive in your evaluation.`,
          },
          {
            role: "user",
            content: `Question: ${question}\n\nCandidate's Answer: ${answer}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) throw new Error("OpenAI API error");

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return analyzeLocally(question, answer, res);

    const analysis = JSON.parse(jsonMatch[0]);
    res.status(200).json({
      technical_correctness: Math.min(100, Math.max(0, analysis.technical_correctness)),
      depth_of_explanation: Math.min(100, Math.max(0, analysis.depth_of_explanation)),
      clarity: Math.min(100, Math.max(0, analysis.clarity)),
      confidence: Math.min(100, Math.max(0, analysis.confidence)),
      feedback: analysis.feedback || "Thank you for your answer. Let's continue.",
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return analyzeLocally(question, answer, res);
  }
}

const TECH_TERMS = [
  "algorithm", "complexity", "optimize", "data structure", "cache", "database",
  "api", "distributed", "scalable", "server", "client", "protocol", "http",
  "function", "variable", "loop", "recursion", "stack", "queue", "hash",
  "tree", "graph", "array", "linked list", "memory", "thread", "async",
  "promise", "callback", "middleware", "framework", "component", "class",
  "inheritance", "polymorphism", "encapsulation", "index", "query", "schema",
  "normalization", "latency", "throughput", "load balancer", "microservice",
  "rest", "graphql", "websocket", "cdn", "big o", "o(n)", "o(1)", "binary search",
  "sorting", "merge sort", "container", "docker", "token", "session",
];

function analyzeLocally(question, answer, res) {
  const lower = answer.toLowerCase();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const hasExamples = lower.includes("example") || lower.includes("for instance") || lower.includes("such as");
  const hasStructure = sentences.length > 3;
  const hasDetail = answer.length > 300;

  // Technical score
  let technical = 55;
  const termCount = TECH_TERMS.filter((t) => lower.includes(t)).length;
  technical += Math.min(30, termCount * 5);
  if (wordCount > 50) technical += 8;
  if (hasDetail) technical += 7;

  // Depth score
  let depth = 50;
  if (wordCount > 40) depth += 10;
  if (wordCount > 80) depth += 10;
  if (hasExamples) depth += 15;
  if (hasDetail) depth += 10;
  if (lower.includes("trade-off") || lower.includes("advantage") || lower.includes("disadvantage")) depth += 8;

  // Clarity score
  let clarity = 50;
  if (hasStructure) clarity += 15;
  if (hasExamples) clarity += 10;
  const connectors = ["first", "second", "then", "therefore", "because", "however", "additionally"];
  clarity += Math.min(20, connectors.filter((c) => lower.includes(c)).length * 5);
  if (/\d\.\s/.test(answer)) clarity += 8;

  // Confidence score
  let confidence = 55;
  const confPhrases = ["definitely", "clearly", "i know", "certain", "proven", "fundamentally"];
  const uncertPhrases = ["i think", "maybe", "not sure", "probably", "i guess"];
  confidence += confPhrases.filter((p) => lower.includes(p)).length * 6;
  confidence -= uncertPhrases.filter((p) => lower.includes(p)).length * 8;
  if (wordCount > 60) confidence += 8;

  technical = Math.min(100, Math.max(0, technical));
  depth = Math.min(100, Math.max(0, depth));
  clarity = Math.min(100, Math.max(0, clarity));
  confidence = Math.min(100, Math.max(0, confidence));

  const feedback = generateFeedback(technical, depth, clarity, hasExamples, hasStructure);

  res.status(200).json({
    technical_correctness: technical,
    depth_of_explanation: depth,
    clarity,
    confidence,
    feedback,
  });
}

function generateFeedback(technical, depth, clarity, hasExamples, hasStructure) {
  let fb = "Thank you for your answer. ";
  if (technical > 75) fb += "You demonstrated solid technical understanding. ";
  else if (technical < 50) fb += "Consider reviewing the fundamentals of this topic. ";
  if (depth > 75 && hasExamples) fb += "Your examples helped clarify your thinking. ";
  else if (depth < 50) fb += "Try providing more detailed explanations with examples. ";
  if (clarity > 75 && hasStructure) fb += "Your structured approach made your answer clear. ";
  else if (clarity < 50) fb += "Work on organizing your thoughts before answering. ";
  fb += "Let's continue with the next question.";
  return fb;
}
