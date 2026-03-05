/**
 * Answer Analyzer - Evaluates user answers with LLM + local heuristic fallback
 * Scores technical correctness, depth, clarity, and confidence
 */

const TECHNICAL_KEYWORDS = [
  "algorithm", "complexity", "optimize", "data structure", "cache", "database",
  "api", "distributed", "scalable", "server", "client", "protocol", "http",
  "tcp", "function", "variable", "loop", "recursion", "stack", "queue",
  "hash", "tree", "graph", "array", "linked list", "pointer", "memory",
  "thread", "process", "async", "await", "promise", "callback", "event",
  "middleware", "framework", "library", "component", "module", "class",
  "inheritance", "polymorphism", "encapsulation", "abstraction", "interface",
  "index", "query", "schema", "normalization", "transaction", "latency",
  "throughput", "load balancer", "microservice", "monolith", "container",
  "docker", "kubernetes", "rest", "graphql", "websocket", "cdn", "dns",
  "ssl", "tls", "oauth", "jwt", "token", "session", "cookie",
  "big o", "o(n)", "o(1)", "o(log n)", "o(n^2)", "constant time", "linear",
  "binary search", "sorting", "merge sort", "quick sort", "heap",
];

const CONFIDENCE_INDICATORS = [
  "i am sure", "definitely", "absolutely", "clearly", "certainly",
  "without a doubt", "i know", "proven", "well-established", "fundamentally",
];

const UNCERTAINTY_INDICATORS = [
  "maybe", "perhaps", "i think", "probably", "might be", "not sure",
  "i guess", "could be", "possibly", "i'm not certain", "i believe",
];

/** System prompt for answer analysis */
const ANALYSIS_SYSTEM_PROMPT = `You are an experienced technical interview evaluator. Analyze the candidate's answer to the given interview question.

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
  constructor() {
    this.analysisHistory = [];
  }

  /**
   * Analyze answer using LLM with full conversation context
   * @param {string} apiKey - OpenAI API key
   * @param {string} question - The question asked
   * @param {string} answer - The candidate's answer
   * @param {Array} conversationHistory - Full conversation context
   * @returns {Promise<object>} Analysis scores and feedback
   */
  async analyzeWithLLM(apiKey, question, answer, conversationHistory) {
    if (!apiKey) return null;

    try {
      const contextSummary = conversationHistory
        .filter((e) => e.type === "question" || e.type === "answer")
        .slice(-6)
        .map((e) => `${e.role === "interviewer" ? "Q" : "A"}: ${e.content.substring(0, 200)}`)
        .join("\n");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Interview context (recent exchanges):\n${contextSummary}\n\n---\n\nCurrent Question: ${question}\n\nCandidate's Answer: ${answer}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
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
          feedback: parsed.feedback || "Thank you for your answer. Let's continue.",
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
      confidence: llmAnalysis?.confidence ?? localScores.confidence,
    };

    const analysis = {
      question,
      answer,
      timestamp: new Date(),
      scores,
      feedback: llmAnalysis?.feedback || "",
      technicalCorrectness: scores.technical,
    };

    this.analysisHistory.push(analysis);
    return analysis;
  }

  _computeLocalScores(answer) {
    const lowerAnswer = answer.toLowerCase();
    const wordCount = answer.split(/\s+/).filter(Boolean).length;
    const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    // --- Technical Score ---
    let technical = 55;
    const techTermCount = TECHNICAL_KEYWORDS.filter((t) => lowerAnswer.includes(t)).length;
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
    const connectors = ["first", "second", "then", "therefore", "because", "however", "moreover", "additionally", "in conclusion", "as a result", "for example"];
    const connectorCount = connectors.filter((c) => lowerAnswer.includes(c)).length;
    clarity += Math.min(20, connectorCount * 5);
    // Numbered lists
    if (/\d\.\s/.test(answer) || /\d\)\s/.test(answer)) clarity += 8;

    // --- Confidence Score ---
    let confidence = 55;
    const confCount = CONFIDENCE_INDICATORS.filter((i) => lowerAnswer.includes(i)).length;
    const uncertCount = UNCERTAINTY_INDICATORS.filter((i) => lowerAnswer.includes(i)).length;
    confidence += confCount * 6;
    confidence -= uncertCount * 8;
    if (wordCount > 60) confidence += 8;
    if (wordCount > 120) confidence += 7;

    return {
      technical: Math.min(100, Math.max(0, technical)),
      depth: Math.min(100, Math.max(0, depth)),
      clarity: Math.min(100, Math.max(0, clarity)),
      confidence: Math.min(100, Math.max(0, confidence)),
    };
  }

  getAverageScores() {
    if (this.analysisHistory.length === 0) {
      return { technical: 0, depthOfExplanation: 0, clarity: 0, confidence: 0 };
    }
    const totals = { technical: 0, depthOfExplanation: 0, clarity: 0, confidence: 0 };
    this.analysisHistory.forEach((a) => {
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
      confidence: Math.round(totals.confidence / c),
    };
  }

  reset() {
    this.analysisHistory = [];
  }
}

export { AnswerAnalyzer };
