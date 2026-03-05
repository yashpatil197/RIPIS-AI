/**
 * useInterviewState - Main state management hook for the interview
 * Supports live mode (API calls) and demo mode (pre-scripted flow)
 * Tracks difficulty, question history, and elapsed time
 */

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DEMO_QUESTIONS,
  DEMO_ANSWERS,
  DEMO_FEEDBACK,
  DEMO_ANALYSES,
  DEMO_REPORT,
} from "@/modules/ai-interview/demoConfig";

export const useInterviewState = () => {
  const [state, setState] = useState({
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
    elapsedTime: 0,
  });

  const interviewRef = useRef(null);
  const demoStep = useRef(0);
  const timerRef = useRef(null);

  // Elapsed time tracking
  useEffect(() => {
    if (state.isActive && !state.interviewComplete) {
      timerRef.current = setInterval(() => {
        setState((p) => ({ ...p, elapsedTime: p.elapsedTime + 1 }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isActive, state.interviewComplete]);

  // ─── Start Live Interview ───
  const startInterview = useCallback(async () => {
    setState((p) => ({ ...p, isActive: true, isLoading: true, messages: [], error: null, interviewComplete: false, report: null, isDemo: false, questionHistory: [], elapsedTime: 0, difficulty: "easy" }));

    try {
      const res = await fetch("/api/ai-interview/start", { method: "POST" });
      if (!res.ok) throw new Error("Failed to start interview");
      const data = await res.json();

      setState((p) => ({
        ...p,
        messages: [
          { id: "greeting", type: "interviewer", content: data.greeting, timestamp: new Date() },
          { id: "q-1", type: "interviewer", content: data.question, questionNumber: data.questionNumber, totalQuestions: data.totalQuestions, timestamp: new Date() },
        ],
        currentQuestion: data.question,
        currentQuestionNumber: data.questionNumber,
        isLoading: false,
        interviewId: data.interviewId,
        difficulty: data.difficulty || "easy",
      }));

      interviewRef.current = { id: data.interviewId };
    } catch (error) {
      console.error("Failed to start interview:", error);
      setState((p) => ({ ...p, isActive: false, isLoading: false, error: "Failed to start interview. Please try again." }));
    }
  }, []);

  // ─── Start Demo Interview ───
  const startDemo = useCallback(() => {
    demoStep.current = 0;
    setState((p) => ({
      ...p,
      isActive: true,
      isLoading: false,
      isDemo: true,
      interviewComplete: false,
      report: null,
      error: null,
      currentQuestionNumber: 1,
      totalQuestions: 6,
      currentQuestion: DEMO_QUESTIONS[0].q,
      difficulty: "easy",
      questionHistory: [],
      elapsedTime: 0,
      messages: [
        { id: "greeting", type: "interviewer", content: "Hello! Welcome to this demo interview. I'll ask you 6 technical questions — you can type any answer or just hit submit to see the pre-scripted flow. Let's begin!", timestamp: new Date() },
        { id: "q-1", type: "interviewer", content: DEMO_QUESTIONS[0].q, questionNumber: 1, totalQuestions: 6, timestamp: new Date() },
      ],
    }));
  }, []);

  // ─── Submit Answer ───
  const submitAnswer = useCallback(async (userAnswer) => {
    // Add user message immediately
    setState((p) => ({
      ...p,
      isLoading: true,
      messages: [...p.messages, { id: `a-${p.messages.length}`, type: "candidate", content: userAnswer, timestamp: new Date() }],
    }));

    // Demo mode
    if (state.isDemo) {
      await new Promise((r) => setTimeout(r, 1200)); // Simulate thinking
      const step = demoStep.current;
      const analysis = DEMO_ANALYSES[step];
      const feedback = DEMO_FEEDBACK[step];
      const nextStep = step + 1;
      demoStep.current = nextStep;

      setState((p) => {
        const newMsgs = [
          ...p.messages,
          { id: `fb-${step}`, type: "interviewer", content: feedback, analysis: { technical_correctness: analysis.technical_correctness, depth_of_explanation: analysis.depth_of_explanation, clarity: analysis.clarity, confidence: analysis.confidence }, timestamp: new Date() },
        ];

        const newHistory = [...p.questionHistory, {
          question: DEMO_QUESTIONS[step].q,
          score: Math.round((analysis.technical_correctness + analysis.depth_of_explanation + analysis.clarity + analysis.confidence) / 4),
          difficulty: DEMO_QUESTIONS[step].difficulty,
        }];

        if (nextStep >= 6) {
          newMsgs.push({ id: "complete", type: "system", content: "Interview Complete! 🎉", timestamp: new Date() });
          return { ...p, messages: newMsgs, isLoading: false, interviewComplete: true, report: DEMO_REPORT, questionHistory: newHistory };
        }

        newMsgs.push({ id: `q-${nextStep + 1}`, type: "interviewer", content: DEMO_QUESTIONS[nextStep].q, questionNumber: nextStep + 1, totalQuestions: 6, timestamp: new Date() });
        return {
          ...p,
          messages: newMsgs,
          currentQuestion: DEMO_QUESTIONS[nextStep].q,
          currentQuestionNumber: nextStep + 1,
          isLoading: false,
          difficulty: DEMO_QUESTIONS[nextStep].difficulty || p.difficulty,
          questionHistory: newHistory,
        };
      });
      return;
    }

    // Live mode
    try {
      const res = await fetch("/api/ai-interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId: state.interviewId, answer: userAnswer }),
      });

      if (!res.ok) throw new Error("Failed to submit answer");
      const data = await res.json();

      setState((p) => {
        const newMsgs = [
          ...p.messages,
          { id: `fb-${p.messages.length}`, type: "interviewer", content: data.feedback, analysis: data.analysis, timestamp: new Date() },
        ];

        const avgScore = data.analysis
          ? Math.round((data.analysis.technical_correctness + data.analysis.depth_of_explanation + data.analysis.clarity + data.analysis.confidence) / 4)
          : 70;

        const newHistory = [...p.questionHistory, {
          question: p.currentQuestion,
          score: avgScore,
          difficulty: data.difficulty || p.difficulty,
        }];

        if (data.interviewComplete) {
          newMsgs.push({ id: "complete", type: "system", content: "Interview Complete! 🎉", timestamp: new Date() });
          return { ...p, messages: newMsgs, isLoading: false, interviewComplete: true, report: data.report, questionHistory: newHistory };
        }

        if (data.nextQuestion) {
          newMsgs.push({ id: `q-${data.questionNumber}`, type: "interviewer", content: data.nextQuestion, questionNumber: data.questionNumber, totalQuestions: data.totalQuestions, timestamp: new Date() });
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
          questionHistory: newHistory,
        };
      });
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setState((p) => ({ ...p, isLoading: false, error: "Failed to submit answer. Please try again." }));
    }
  }, [state.interviewId, state.isDemo]);

  const endInterview = useCallback(() => {
    setState((p) => ({ ...p, isActive: false, interviewComplete: true }));
  }, []);

  const resetInterview = useCallback(() => {
    demoStep.current = 0;
    setState({
      isActive: false, currentQuestionNumber: 0, totalQuestions: 6, messages: [],
      currentQuestion: null, isLoading: false, interviewComplete: false, report: null,
      interviewId: null, error: null, isDemo: false, difficulty: "easy", questionHistory: [], elapsedTime: 0,
    });
    interviewRef.current = null;
  }, []);

  // Format elapsed time
  const formatTime = (seconds) => {
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
    formattedTime: formatTime(state.elapsedTime),
  };
};
