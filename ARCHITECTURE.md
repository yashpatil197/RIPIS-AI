# 🏗️ AI 1:1 Interviewer - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER INTERFACE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              /ai-interview Page (React Component)              │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐    │  │
│  │  │   Welcome    │  │  Interview   │  │  Final Report   │    │  │
│  │  │   Screen     │→ │  Chat UI     │→ │   Display       │    │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘    │  │
│  │                            │                                 │  │
│  │                            ▼                                 │  │
│  │                  ┌──────────────────┐                        │  │
│  │                  │ useInterviewState │ (React Hook)         │  │
│  │                  │     State Hook    │                       │  │
│  │                  └──────────────────┘                        │  │
│  │                            │                                 │  │
│  │    ┌───────────────────────┼───────────────────────┐         │  │
│  │    │                       │                       │         │  │
│  │    ▼                       ▼                       ▼         │  │
│  │ Start API             Answer API              Analyze API   │  │
│  │                                                             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS API LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐           │
│  │  POST /start   │  │  POST /answer  │  │ POST /analyze  │           │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤           │
│  │                │  │                │  │                │           │
│  │ Initialize     │  │ Process        │  │ Analyze        │           │
│  │ Interview      │  │ User Answer    │  │ Answer         │           │
│  │ Session        │  │ & Generate     │  │                │           │
│  │                │  │ Feedback       │  │                │           │
│  └────────────────┘  └────────────────┘  └────────────────┘           │
│          │                  │                    │                      │
│          │                  └────────────────┬───┘                      │
│          │                                   │                          │
│          └───────────────┬──────────────────┘                           │
│                          ▼                                              │
│            ┌──────────────────────────────┐                            │
│            │   Interview Agent            │                            │
│            │   (Main Orchestrator)        │                            │
│            └──────────────────────────────┘                            │
│                          │                                              │
│          ┌───────────────┼───────────────┬─────────────┐                │
│          │               │               │             │                │
│          ▼               ▼               ▼             ▼                │
│    ┌─────────────┐ ┌─────────────┐ ┌──────────┐ ┌──────────────┐      │
│    │  Question   │ │   Answer    │ │  Report  │ │   Demo Data  │      │
│    │  Engine     │ │  Analyzer   │ │Generator │ │   & Config   │      │
│    ├─────────────┤ ├─────────────┤ ├──────────┤ └──────────────┘      │
│    │             │ │             │ │          │                        │
│    │ - Generate  │ │ - Score     │ │ - Create │                        │
│    │   questions │ │   answers   │ │   report │                        │
│    │             │ │             │ │          │                        │
│    │ - Track     │ │ - Analyze   │ │ - Format │                        │
│    │   progress  │ │   clarity   │ │   scores │                        │
│    │             │ │             │ │          │                        │
│    │ - Adjust    │ │ - Evaluate  │ │ - Generate│                       │
│    │   difficulty│ │   confidence│ │   recommendations│                │
│    └─────────────┘ └─────────────┘ └──────────┘                        │
│                          │                                              │
│                          ▼                                              │
│            ┌──────────────────────────────┐                            │
│            │   OpenAI API (Optional)      │                            │
│            │   - GPT-3.5 for Analysis     │                            │
│            │   - Or Local Analysis        │                            │
│            └──────────────────────────────┘                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
ai-interview.js (Page)
│
├─ Welcome Screen
│  └─ Features Cards (6)
│  └─ How It Works (4 steps)
│  └─ CTA Button
│
└─ InterviewChat Component
   │
   ├─ ProgressIndicator
   │  └─ Progress Bar
   │  └─ Question Count
   │
   ├─ Message List
   │  └─ InterviewMessage (multiple)
   │     ├─ Interviewer Message
   │     ├─ User Message
   │     ├─ System Message
   │     └─ Score Display (inline)
   │
   └─ AnswerInput Component
      ├─ Textarea
      ├─ VoiceRecorder (toggle)
      │  └─ Recording Controls
      └─ Submit Button

Final Report Screen
├─ Score Cards (5)
├─ Strengths Section
├─ Weaknesses Section
├─ Recommendations Section
└─ Start New Interview Button
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           INTERVIEW FLOW                                 │
└──────────────────────────────────────────────────────────────────────────┘

1. USER CLICKS "START INTERVIEW"
   │
   └─► useInterviewState.startInterview()
       │
       └─► POST /api/ai-interview/start
           │
           └─► InterviewAgent.initializeInterview()
               │
               ├─► QuestionEngine.startInterview()
               │
               └─► Return { greeting, question, questionNumber }
                   │
                   └─► Display on screen


2. USER ANSWERS QUESTION
   │
   ├─► Type answer or Record voice
   │
   ├─► (If voice) VoiceRecorder.stopRecording()
   │   │
   │   └─► POST /api/ai-interview/transcribe
   │       │
   │       └─► Transcribed text
   │
   └─► useInterviewState.submitAnswer(answer)
       │
       └─► POST /api/ai-interview/answer
           │
           └─► InterviewAgent.processAnswer(answer)
               │
               ├─► AnswerAnalyzer.analyzeAnswer()
               │   │
               │   ├─► (Optional) POST /api/ai-interview/analyze
               │   │   │
               │   │   └─► OpenAI GPT API or Local Analysis
               │   │
               │   └─► Return scores { technical, depth, clarity, confidence }
               │
               ├─► QuestionEngine.generateNextQuestion()
               │   │
               │   ├─► Check if interview complete (6 questions)
               │   │
               │   └─► Return next question or null
               │
               └─► Return { feedback, analysis, nextQuestion, report? }


3. DISPLAY FEEDBACK & NEXT QUESTION
   │
   ├─► Show feedback message
   ├─► Show scores
   ├─► Show progress bar update
   │
   ├─► If NOT complete:
   │   └─► Show next question
   │       └─► REPEAT step 2
   │
   └─► If complete:
       └─► ReportGenerator.generateReport()
           │
           ├─► Calculate all scores
           ├─► Identify strengths
           ├─► Identify weaknesses
           ├─► Generate recommendations
           │
           └─► Return final report
               │
               └─► Display report on screen


4. USER VIEWS REPORT
   │
   ├─ See all scores (5 categories)
   ├─ Read strengths section
   ├─ Read weaknesses section
   ├─ Read recommendations
   │
   └─ Click "Start New Interview" to restart
      │
      └─ Reset state and go to step 1
```

---

## Module Dependency Graph

```
┌─────────────────┐
│  ai-interview   │
│  (Main Page)    │
└────────┬────────┘
         │ imports
         ▼
    ┌────────────────────────────────────────┐
    │    useInterviewState Hook               │
    └────┬────────────────────┬──────────────┘
         │                    │ calls
         │                    ▼
         │              ┌─────────────────┐
         │              │ API Routes      │
         │              │ (/start, /answer│
         │              │  /analyze, etc) │
         │              └────────┬────────┘
         │                       │ imports
         │                       ▼
         │              ┌────────────────────┐
         │              │ interviewAgent.js   │
         │              ├────────────────────┤
         │              │ InterviewAgent     │
         │              └────┬────┬────┬────┘
         │                   │    │    │ imports
         │                   │    │    ├─────────────────┐
         │                   ▼    ▼    ▼                 ▼
         │              ┌──────────────────────┐   ┌────────────┐
         │              │ questionEngine.js     │   │ demoConfig │
         │              │ answerAnalyzer.js     │   │            │
         │              │ reportGenerator.js    │   └────────────┘
         │              └──────────────────────┘
         │
         └──────────────────┐
                            │ imports
                            ▼
                    ┌───────────────────────┐
                    │ Interview Components   │
                    ├───────────────────────┤
                    │ - InterviewChat       │
                    │ - InterviewMessage    │
                    │ - AnswerInput         │
                    │ - ProgressIndicator   │
                    │ - VoiceRecorder       │
                    └───────────────────────┘
```

---

## State Management Flow

```
USER ACTIONS                          STATE CHANGES
─────────────                         ──────────────

Click "Start"                ──►    isActive = true
                             ──►    isLoading = true
                             
API returns                  ──►    isLoading = false
                             ──►    messages = [greeting, question]
                             ──►    currentQuestionNumber = 1
                             
User types answer            ──►    (local textarea state)

User clicks Submit           ──►    isLoading = true
                             ──►    messages.push(userAnswer)
                             
API returns feedback         ──►    isLoading = false
                             ──►    messages.push(feedback)
                             ──►    currentQuestionNumber = 2
                             
API returns next question    ──►    messages.push(newQuestion)

... repeat for Q3-Q6 ...

After 6th answer             ──►    interviewComplete = true
                             ──►    isActive = false
                             ──►    report = {...}

User clicks "Start New"      ──►    reset all state
                             ──►    go to step 1
```

---

## API Contract Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        API ENDPOINTS                                    │
├─────────────────────────────────────────────────────────────────────────┤

1. POST /api/ai-interview/start
   │
   Request:  { } (empty body)
   │
   Response: {
               "interviewId": "string",
               "greeting": "string",
               "question": "string",
               "questionNumber": 1,
               "totalQuestions": 6
             }

2. POST /api/ai-interview/answer
   │
   Request:  {
               "interviewId": "string",
               "answer": "string"
             }
   │
   Response: {
               "feedback": "string",
               "analysis": {
                 "technical_correctness": 0-100,
                 "depth_of_explanation": 0-100,
                 "clarity": 0-100,
                 "confidence": 0-100
               },
               "nextQuestion": "string" (or null if complete),
               "questionNumber": 2-6,
               "totalQuestions": 6,
               "interviewComplete": boolean,
               "report": {...} (if complete)
             }

3. POST /api/ai-interview/analyze
   │
   Request:  {
               "question": "string",
               "answer": "string"
             }
   │
   Response: {
               "technical_correctness": 0-100,
               "depth_of_explanation": 0-100,
               "clarity": 0-100,
               "confidence": 0-100,
               "feedback": "string"
             }

4. POST /api/ai-interview/transcribe
   │
   Request:  FormData { audio: Blob }
   │
   Response: {
               "transcript": "string",
               "confidence": 0-1
             }

```

---

## Scoring Algorithm Flow

```
┌─────────────────────────────────────────────────────────┐
│           ANSWER SCORING PIPELINE                       │
├─────────────────────────────────────────────────────────┤

INPUT: { question, answer }
│
├─► Check if OpenAI key available?
│   │
│   YES ──► Call OpenAI API
│   │       └─ Return { technical, depth, clarity, confidence }
│   │
│   NO ──► Local Analysis
│           │
│           ├─ Text Length Analysis
│           │  └─ Word count, character count
│           │
│           ├─ Technical Term Detection
│           │  └─ Search for programming keywords
│           │
│           ├─ Structure Analysis
│           │  └─ Sentence count, logical flow
│           │
│           ├─ Confidence Language Analysis
│           │  └─ Certainty vs uncertainty phrases
│           │
│           └─ Return calculated scores
│
├─► Process scores:
│   ├─ technical_correctness = max(0, min(100, score))
│   ├─ depth_of_explanation = max(0, min(100, score))
│   ├─ clarity = max(0, min(100, score))
│   └─ confidence = max(0, min(100, score))
│
├─► Generate feedback based on scores
│
└─► OUTPUT: { scores, feedback }
```

---

## Difficulty Adjustment Algorithm

```
┌─────────────────────────────────────────────────┐
│      DIFFICULTY ADJUSTMENT LOGIC                │
├─────────────────────────────────────────────────┤

INPUT: { currentDifficulty, answerScore }
│
├─ Is answerScore >= 80?
│  │
│  YES ──► Increase difficulty
│  │       ├─ easy ──► medium
│  │       ├─ medium ──► hard
│  │       └─ hard ──► hard (stays)
│  │
│  NO ──► Is answerScore < 50?
│         │
│         YES ──► Decrease difficulty
│         │       ├─ hard ──► medium
│         │       ├─ medium ──► easy
│         │       └─ easy ──► easy (stays)
│         │
│         NO ──► Keep same difficulty
│                 └─ easy/medium/hard ──► same
│
└─► OUTPUT: { newDifficulty }
```

---

## Overall Score Calculation

```
┌──────────────────────────────────────────────────────┐
│         FINAL SCORE CALCULATION                      │
├──────────────────────────────────────────────────────┤

INPUT: All 6 answers with scores

Calculate Averages:
├─ Avg Technical = sum(all technical scores) / 6
├─ Avg Depth = sum(all depth scores) / 6
├─ Avg Clarity = sum(all clarity scores) / 6
└─ Avg Confidence = sum(all confidence scores) / 6

Map to Categories:
├─ Technical Knowledge = Avg Technical (0-100)
├─ Problem Solving = Avg Depth (0-100)
├─ Communication = Avg Clarity (0-100)
└─ Confidence = Avg Confidence (0-100)

Calculate Weighted Overall Score:
│
Overall_Score = (Technical_Knowledge × 0.35)
              + (Problem_Solving × 0.25)
              + (Communication × 0.25)
              + (Confidence × 0.15)
│
└─► OUTPUT: { overall_score, technical, problem_solving, 
              communication, confidence } (0-100)
```

---

## Session Lifecycle

```
┌──────────────────────────────────────────────────────┐
│           SESSION LIFECYCLE                          │
├──────────────────────────────────────────────────────┤

1. CREATION
   │
   POST /api/ai-interview/start
   ├─ Generate sessionId
   ├─ Create InterviewAgent instance
   ├─ Store in activeInterviews Map
   └─ Return sessionId to client

2. ACTIVE
   │
   [6 questions / answers cycle]
   │
   POST /api/ai-interview/answer (multiple times)
   ├─ Retrieve session by sessionId
   ├─ Process answer
   ├─ Return feedback
   └─ Update lastActivity timestamp

3. COMPLETION
   │
   After 6th question answered
   │
   POST /api/ai-interview/answer (6th time)
   ├─ Generate final report
   ├─ Set isInterviewComplete = true
   └─ Schedule cleanup (5 minutes)

4. CLEANUP
   │
   [After 5 minutes of completion]
   │
   ├─ Delete from activeInterviews Map
   └─ Free memory

5. NEW INTERVIEW
   │
   User clicks "Start New Interview"
   ├─ Reset client state
   └─ Create new session (go to step 1)
```

---

## Performance Optimization

```
┌──────────────────────────────────────────────────────┐
│         PERFORMANCE CONSIDERATIONS                   │
├──────────────────────────────────────────────────────┤

Frontend:
├─ Component Memoization
│  └─ Prevent unnecessary re-renders
├─ Lazy Loading
│  └─ Load components on demand
├─ Image Optimization
│  └─ Use next/image
└─ Code Splitting
   └─ Dynamic imports

Backend:
├─ Session Caching
│  └─ Store in memory, not DB
├─ API Rate Limiting
│  └─ Throttle OpenAI calls
├─ Response Compression
│  └─ GZIP compression
└─ Database Indexing
   └─ For future persistence

Network:
├─ Minimal API Calls
│  └─ Batch requests where possible
├─ Response Size Reduction
│  └─ Only send needed data
├─ CDN Deployment
│  └─ Serve static assets
└─ Caching Headers
   └─ Browser cache strategy
```

---

This architecture is **scalable, modular, and maintainable**.
Each component has a single responsibility and clear interfaces.

Created: March 5, 2026
Version: 1.0

