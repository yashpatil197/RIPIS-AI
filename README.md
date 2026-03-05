# RIPIS-AI  
**Real-Time Interview Practice Intelligence System**  
(PS-2 | Prototype Submission)

## 🔍 Problem Statement
Problem Statement PS-2 focuses on the lack of effective, real-time interview practice platforms that can help candidates improve their communication, confidence, and problem-solving skills in a simulated interview environment. Existing solutions are either static, costly, or lack real-time interaction and feedback.

## 💡 Solution Overview
RIPIS-AI is a web-based prototype designed to provide a real-time interview practice environment. The system allows users to simulate interview scenarios, interact with questions, and receive structured responses, helping them prepare more effectively for real-world interviews.

The solution focuses on simplicity, usability, and real-time interaction, making interview preparation more accessible and practical.

## ⚙️ Prototype Status (Round-1)
This repository contains a **functional prototype** developed for Round-1 submission.

### Implemented Features:
- Basic web-based interface for interview practice  
- Core flow demonstrating real-time interaction  
- Structured handling of interview questions and responses  
- Deployed working prototype for demonstration  
- **AI 1:1 Interviewer** - Adaptive conversational interview system
- **Dynamic Question Generation** - Difficulty adapts based on performance
- **Answer Analysis** - Evaluates technical correctness and communication
- **Voice Support** - Answer with text or voice input
- **Detailed Evaluation Reports** - Comprehensive scoring and recommendations

### Out of Scope (Planned for Future):
- User authentication and profiles  
- Advanced AI-based feedback and analytics  
- Performance tracking and reports  
- Scalability and optimization  

## 🧠 How the System Works
1. User accesses the web application  
2. Interview questions are presented through the interface  
3. User responds in real-time  
4. System processes the interaction and displays output  

This prototype demonstrates the feasibility of the proposed solution.

## 🛠️ Technology Stack
- **Frontend:** Next.js, React, Tailwind CSS, JavaScript  
- **Backend / Logic:** Node.js (integrated with Next.js)  
- **AI Integration:** OpenAI GPT-3.5 (for answer analysis)
- **Voice Processing:** Web Speech API / MediaRecorder (fallback)
- **Tools & Platform:** GitHub, Vercel  
- **Version Control:** Git  

## 🧩 System Architecture
User → Web Interface → Core Logic → Output / Response  

(Simple architecture focused on clarity and performance)

## 🚀 Live Demo
A deployed version of the prototype is available here:  
🔗 https://ripis-ai.vercel.app  

---

## 🤖 AI 1:1 Interviewer Feature

### Overview
The AI 1:1 Interviewer is a conversational AI system that simulates a realistic technical interview experience. It conducts a structured 6-question interview with adaptive difficulty based on your performance.

### How to Start an Interview

1. **Navigate to the AI Interview Page**
   - Click "AI 1:1 Interviewer" button on the home page
   - Or visit `/ai-interview` directly

2. **Read the Welcome Screen**
   - Understand how the interview works
   - Review the features and benefits
   - Check estimated duration (15-20 minutes)

3. **Click "Start AI Interview"**
   - The AI will greet you professionally
   - First question will be presented immediately
   - You can answer via text or voice

4. **Answer Each Question**
   - Type your answer directly in the text box, OR
   - Click "🎤 Use Voice" to record a voice response
   - Submit your answer when ready

5. **Get Instant Feedback**
   - Receive immediate analysis on each answer
   - See scores for:
     - Technical Correctness
     - Depth of Explanation
     - Clarity
     - Confidence
   - Get personalized feedback text

6. **Complete All Questions**
   - Answer 6 questions total (adaptive difficulty)
   - Progress bar shows your interview status
   - Each new question adapts based on your previous answer

7. **View Final Report**
   - Comprehensive evaluation with:
     - **Overall Score** (0-100)
     - **Technical Knowledge** (0-100)
     - **Problem Solving** (0-100)
     - **Communication** (0-100)
     - **Confidence** (0-100)
   - **Strengths** - Key areas where you performed well
   - **Weaknesses** - Areas for improvement
   - **Recommendations** - Actionable next steps
   - **Interview Duration** - Estimated time taken

### Interview Flow

```
Welcome Screen
      ↓
[Click Start Interview]
      ↓
AI Greeting + First Question
      ↓
User Answers (Text/Voice)
      ↓
AI Analyzes Answer
      ↓
Feedback + Next Question
      ↓
Repeat Questions 2-6
      ↓
Final Evaluation Report
```

### Scoring System

Each answer is evaluated on four key metrics:

#### **Technical Correctness (0-100)**
- Accuracy of technical concepts
- Relevance to the question
- Implementation understanding

#### **Depth of Explanation (0-100)**
- Level of detail provided
- Use of examples
- Exploration of edge cases

#### **Clarity (0-100)**
- Logical structure
- Clear communication
- Easy to follow reasoning

#### **Confidence (0-100)**
- Conviction in your answers
- Professional language
- Structured thinking

### How Scoring Works

**Overall Score** is calculated as:
```
Overall = (Technical × 0.35) + (Problem Solving × 0.25) 
        + (Communication × 0.25) + (Confidence × 0.15)
```

Weighted to emphasize technical knowledge while valuing communication skills.

### Sample Report Output

```json
{
  "overall_score": 78,
  "technical_knowledge": 80,
  "problem_solving": 75,
  "communication": 82,
  "confidence": 74,
  "strengths": [
    "Good understanding of JavaScript closures",
    "Explained concepts clearly",
    "Provided practical examples"
  ],
  "weaknesses": [
    "Needs deeper understanding of time complexity",
    "Could improve structured thinking",
    "Rushed through explanation at times"
  ],
  "recommendations": [
    "Practice DSA problems on LeetCode",
    "Work on explaining solutions step by step",
    "Record yourself practicing to improve delivery",
    "Study Big O complexity analysis in depth"
  ],
  "total_questions": 6,
  "interview_duration": "17-23 minutes"
}
```

### Adaptive Question System

The interview uses **intelligent difficulty adjustment**:

- **Strong Answer (Score ≥ 80)** → Difficulty increases for next question
- **Average Answer (50-79)** → Difficulty maintains current level
- **Weak Answer (< 50)** → Difficulty may decrease to reinforce fundamentals

Questions cover topics like:
- Programming fundamentals
- Data structures & algorithms
- Problem solving approach
- System design thinking
- Web development concepts
- Database design
- OOP principles

### Voice Interview Support

The system supports voice-based answers via:

- **Web Speech API** - Browser's native speech recognition
- **Audio Recording** - MediaRecorder for capturing voice
- **Fallback Text** - Type if voice isn't available

#### Using Voice:
1. Click "🎤 Use Voice" button
2. Click "🎤 Start Recording"
3. Speak your answer clearly
4. Click "Stop Recording" when done
5. Audio is transcribed automatically
6. Review and submit the transcribed text

### Module Structure

```
src/modules/ai-interview/
├── interviewAgent.js      # Main orchestrator
├── questionEngine.js      # Question generation & difficulty
├── answerAnalyzer.js      # Answer evaluation
├── reportGenerator.js     # Report creation
└── index.js              # Module exports

src/components/interview/
├── InterviewChat.js       # Main chat interface
├── InterviewMessage.js    # Individual messages
├── AnswerInput.js         # User input component
├── ProgressIndicator.js   # Progress bar
├── VoiceRecorder.js       # Voice recording
└── index.js              # Component exports

src/hooks/
└── useInterviewState.js   # State management hook

pages/api/ai-interview/
├── start.js              # Start interview endpoint
├── answer.js             # Process answer endpoint
├── analyze.js            # Analyze answer endpoint
└── transcribe.js         # Speech-to-text endpoint

pages/
└── ai-interview.js       # Main interview page
```

### API Endpoints

#### **POST /api/ai-interview/start**
Initializes a new interview session.

**Response:**
```json
{
  "interviewId": "interview_1234567890_abc123",
  "greeting": "Hello! I'm your AI interviewer...",
  "question": "Tell me about your experience with programming...",
  "questionNumber": 1,
  "totalQuestions": 6
}
```

#### **POST /api/ai-interview/answer**
Processes a user answer and returns feedback + next question.

**Request:**
```json
{
  "interviewId": "interview_1234567890_abc123",
  "answer": "I have worked with Python, JavaScript, and Java..."
}
```

**Response:**
```json
{
  "feedback": "Thank you for your answer. You demonstrated...",
  "analysis": {
    "technical_correctness": 80,
    "depth_of_explanation": 75,
    "clarity": 82,
    "confidence": 74
  },
  "nextQuestion": "Can you explain...",
  "questionNumber": 2,
  "totalQuestions": 6,
  "interviewComplete": false
}
```

#### **POST /api/ai-interview/analyze**
Analyzes an answer using AI (with OpenAI fallback).

**Request:**
```json
{
  "question": "Explain how a hash map works...",
  "answer": "A hash map uses a hash function..."
}
```

#### **POST /api/ai-interview/transcribe**
Converts audio to text (voice input support).

### Configuration

#### OpenAI Integration (Optional)
To enable OpenAI analysis, set environment variable:
```bash
OPENAI_API_KEY=your_api_key_here
```

If not set, the system uses local analysis (still very effective).

### Usage Example

```javascript
import { useInterviewState } from "@/hooks/useInterviewState";
import { InterviewChat } from "@/components/interview";

export default function AIInterview() {
  const interview = useInterviewState();

  return (
    <>
      <button onClick={interview.startInterview}>
        Start Interview
      </button>
      
      <InterviewChat
        messages={interview.messages}
        onSubmitAnswer={interview.submitAnswer}
        isLoading={interview.isLoading}
      />
    </>
  );
}
```

### Tips for Best Results

1. **Answer Completely** - Provide thorough explanations, not just yes/no
2. **Use Examples** - Include practical examples to demonstrate understanding
3. **Think Aloud** - Explain your thinking process, not just conclusions
4. **Be Honest** - Don't memorize answers; genuine responses are better
5. **Take Time** - The system measures quality, not speed
6. **Review Feedback** - Read all feedback to understand your performance
7. **Practice Multiple Times** - Each interview generates different questions
8. **Act Natural** - Speak/type conversationally as you would in real interviews

### Example Scenarios

#### Scenario 1: Strong Technical Background
- Questions quickly increase in difficulty
- Final score: 85+ (Excellent)
- Recommendation: Challenge yourself with system design questions

#### Scenario 2: Beginner Developer
- Questions stay at intermediate level
- Final score: 65-75 (Good with room to grow)
- Recommendations: Practice more DSA problems

#### Scenario 3: Great Communication, Moderate Technical
- Technical score lower but Communication score higher
- Recommendations: Deepen technical knowledge while maintaining soft skills
- Example strength: "Clear communication and explanation"

### Troubleshooting

**Problem:** "Failed to start interview"
- **Solution:** Check internet connection, try refreshing page

**Problem:** Voice recording not working
- **Solution:** Check microphone permissions, use text instead, or refresh

**Problem:** Answer analysis seems wrong
- **Solution:** Provide more details in answers, system learns from context

**Problem:** Cannot see report
- **Solution:** Ensure all 6 questions are answered, wait for processing

### Browser Requirements

- Chrome, Firefox, Safari, or Edge (modern versions)
- Microphone access (for voice feature - optional)
- JavaScript enabled
- Internet connection

### Performance Notes

- Interview state stored in browser memory (session-based)
- Reports can be saved as JSON
- Voice transcription depends on browser capabilities
- Typical interview duration: 15-20 minutes

---

## ▶️ How to Run Locally
1. Clone the repository  
   ```bash
   git clone https://github.com/yash-pakhale-07/RIPIS-AI.git
