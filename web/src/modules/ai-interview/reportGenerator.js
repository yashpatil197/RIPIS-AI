/**
 * Report Generator - Creates final interview evaluation report
 * Generates scores, strengths, weaknesses, and recommendations
 */

class ReportGenerator {
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
      interview_duration: this._estimateDuration(analysisHistory),
    };
  }

  _calculateScores(history) {
    if (history.length === 0) {
      return { overall: 0, technical: 0, problemSolving: 0, communication: 0, confidence: 0 };
    }
    let techSum = 0, commSum = 0, confSum = 0, psSum = 0;
    history.forEach((a) => {
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
    const overall = Math.round(
      technical * 0.35 + problemSolving * 0.25 + communication * 0.25 + confidence * 0.15
    );
    return { overall, technical, communication, confidence, problemSolving };
  }

  _identifyStrengths(history, scores) {
    const strengths = [];

    // Topic-based strengths from best answers
    const sorted = [...history].sort((a, b) => (b.scores?.technical ?? 0) - (a.scores?.technical ?? 0));
    sorted.slice(0, 3).forEach((a) => {
      if ((a.scores?.technical ?? 0) >= 75) {
        const q = (a.question || "").toLowerCase();
        if (q.includes("design") || q.includes("system") || q.includes("scale"))
          strengths.push("Strong system design and architectural thinking");
        else if (q.includes("data") || q.includes("structure") || q.includes("hash") || q.includes("tree"))
          strengths.push("Good understanding of data structures");
        else if (q.includes("algorithm") || q.includes("complexity") || q.includes("sort"))
          strengths.push("Strong algorithmic knowledge and analysis");
        else if (q.includes("web") || q.includes("api") || q.includes("rest") || q.includes("frontend"))
          strengths.push("Solid web development knowledge");
        else if (q.includes("oop") || q.includes("class") || q.includes("object") || q.includes("solid"))
          strengths.push("Good grasp of OOP principles");
        else
          strengths.push("Good technical understanding demonstrated");
      }
    });

    if (scores.communication >= 75) strengths.push("Clear and structured communication");
    if (scores.confidence >= 75) strengths.push("Confident delivery with conviction");
    if (scores.problemSolving >= 80) strengths.push("Thorough problem-solving approach with depth");

    // Deduplicate and limit
    return [...new Set(strengths)].slice(0, 4);
  }

  _identifyWeaknesses(history, scores) {
    const weaknesses = [];

    const sorted = [...history].sort((a, b) => (a.scores?.technical ?? 100) - (b.scores?.technical ?? 100));
    sorted.slice(0, 2).forEach((a) => {
      if ((a.scores?.technical ?? 100) < 60) {
        const q = (a.question || "").toLowerCase();
        if (q.includes("design") || q.includes("scale"))
          weaknesses.push("Could improve system design thinking");
        else if (q.includes("algorithm") || q.includes("complexity"))
          weaknesses.push("Needs deeper understanding of algorithms and complexity");
        else if (q.includes("data") || q.includes("structure"))
          weaknesses.push("Could strengthen data structures knowledge");
        else
          weaknesses.push("Some technical areas need reinforcement");
      }
    });

    if (scores.problemSolving < 65) weaknesses.push("Needs more detailed and structured explanations");
    if (scores.communication < 65) weaknesses.push("Could improve answer organization and clarity");
    if (scores.confidence < 60) weaknesses.push("Should work on expressing ideas with more conviction");

    return [...new Set(weaknesses)].slice(0, 4);
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

export { ReportGenerator };
