/**
 * Interview Agent - Main orchestrator for interview flow
 * Server-only: manages conversation history, scoring, and report generation
 * Supports LLM-powered dynamic questions when API key is available
 */

import { QuestionEngine } from "./questionEngine.js";
import { AnswerAnalyzer } from "./answerAnalyzer.js";
import { ReportGenerator } from "./reportGenerator.js";

class InterviewAgent {
  constructor(apiKey) {
    this.questionEngine = new QuestionEngine();
    this.answerAnalyzer = new AnswerAnalyzer();
    this.reportGenerator = new ReportGenerator();
    this.apiKey = apiKey;
    this.conversationHistory = [];
    this.isInterviewActive = false;
    this.currentQuestion = null;
    this.startTime = Date.now();
  }

  /**
   * Initialize interview — returns greeting + first question
   */
  initializeInterview() {
    this.questionEngine.reset();
    this.answerAnalyzer.reset();
    this.conversationHistory = [];
    this.isInterviewActive = true;
    this.startTime = Date.now();

    const greetings = [
      "Hello! I'm your AI interviewer today. Welcome to this technical interview session. We'll go through 6 questions covering different areas of software engineering. Take your time with each answer, and feel free to think out loud — I'm interested in your thought process as much as your final answer. Let's get started!",
      "Hi there! Thanks for joining this interview. I'll be asking you 6 technical questions across various topics. Don't worry about getting everything perfect — I want to understand how you think and approach problems. Ready? Let's begin!",
      "Welcome! I'm excited to conduct your technical interview today. We'll cover 6 questions spanning programming fundamentals, data structures, system design, and more. Just be natural and explain your thinking — there are no trick questions here. Let's dive in!",
    ];

    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    this.conversationHistory.push({
      role: "interviewer",
      content: greeting,
      type: "greeting",
      timestamp: new Date(),
    });

    const firstQ = this.questionEngine.startInterview();
    this.conversationHistory.push({
      role: "interviewer",
      content: firstQ.question,
      type: "question",
      questionNumber: firstQ.questionNumber,
      totalQuestions: firstQ.totalQuestions,
      timestamp: new Date(),
    });
    this.currentQuestion = firstQ.question;

    return {
      greeting,
      question: firstQ.question,
      questionNumber: firstQ.questionNumber,
      totalQuestions: firstQ.totalQuestions,
      difficulty: firstQ.difficulty || "easy",
    };
  }

  /**
   * Process user answer — uses LLM for analysis and next question when available
   * @param {string} userAnswer - The user's answer text
   * @param {object} llmAnalysis - Pre-computed analysis scores (or null)
   */
  async processAnswer(userAnswer, llmAnalysis) {
    if (!this.isInterviewActive) {
      throw new Error("Interview is not active");
    }

    // Record user answer
    this.conversationHistory.push({
      role: "candidate",
      content: userAnswer,
      type: "answer",
      timestamp: new Date(),
    });

    // Try LLM analysis if not already provided and API key exists
    if (!llmAnalysis && this.apiKey) {
      try {
        llmAnalysis = await this.answerAnalyzer.analyzeWithLLM(
          this.apiKey,
          this.currentQuestion,
          userAnswer,
          this.conversationHistory
        );
      } catch (e) {
        console.error("LLM analysis fallback:", e);
      }
    }

    // Run analysis (merges LLM scores with local heuristics)
    const analysis = this.answerAnalyzer.analyzeAnswer(
      this.currentQuestion,
      userAnswer,
      llmAnalysis
    );

    // Build response
    const response = {
      feedback: llmAnalysis?.feedback || this._generateLocalFeedback(analysis),
      analysis: {
        technical_correctness: analysis.scores.technical,
        depth_of_explanation: analysis.scores.depthOfExplanation,
        clarity: analysis.scores.clarity,
        confidence: analysis.scores.confidence,
      },
    };

    // Record feedback
    this.conversationHistory.push({
      role: "interviewer",
      content: response.feedback,
      type: "feedback",
      timestamp: new Date(),
    });

    // Check completion
    const progress = this.questionEngine.getProgress();
    if (progress.questionsAsked >= 6) {
      this.isInterviewActive = false;
      response.interviewComplete = true;
      response.report = this.generateFinalReport();
    } else {
      // Generate next question — try LLM first, fall back to pool
      const nextQ = await this.questionEngine.generateNextQuestionLLM(
        this.apiKey,
        this.conversationHistory,
        analysis.scores.technical,
        userAnswer
      );

      if (nextQ) {
        this.conversationHistory.push({
          role: "interviewer",
          content: nextQ.question,
          type: "question",
          questionNumber: nextQ.questionNumber,
          totalQuestions: nextQ.totalQuestions,
          timestamp: new Date(),
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
   */
  getConversationContext() {
    return this.conversationHistory.map((entry) => ({
      role: entry.role,
      type: entry.type,
      content: entry.content,
      timestamp: entry.timestamp,
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
      conversationHistory: this.conversationHistory,
    };
  }

  endInterview() {
    this.isInterviewActive = false;
    return this.generateFinalReport();
  }
}

export { InterviewAgent };
