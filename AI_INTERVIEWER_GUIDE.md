# AI 1:1 Interviewer - Implementation Guide

## 📋 Table of Contents
1. [Project Structure](#project-structure)
2. [Installation & Setup](#installation--setup)
3. [Running Locally](#running-locally)
4. [Environment Configuration](#environment-configuration)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Architecture Deep Dive](#architecture-deep-dive)
8. [Customization](#customization)

---

## Project Structure

### Backend Modules (`/src/modules/ai-interview`)

#### `interviewAgent.js`
**Main orchestrator for the entire interview flow**
- Initializes interview sessions
- Manages conversation history
- Orchestrates question-answer flow
- Coordinates analysis and report generation

Key Classes/Methods:
- `InterviewAgent` - Main class
- `initializeInterview()` - Start new interview
- `processAnswer()` - Handle user answers
- `generateFinalReport()` - Create final report
- `analyzAnswerWithLLM()` - Call LLM API
- `getFallbackAnalysis()` - Offline analysis

#### `questionEngine.js`
**Manages interview questions and adaptive difficulty**
- Pre-defined question pools (easy, medium, hard)
- Difficulty adjustment logic
- Progress tracking

Key Classes/Methods:
- `QuestionEngine` - Main class
- `startInterview()` - Get first question
- `generateNextQuestion()` - Get next question with adaptation
- `adjustDifficulty()` - Change difficulty level
- `getProgress()` - Get interview status

#### `answerAnalyzer.js`
**Analyzes user answers and extracts scores**
- Evaluates technical correctness
- Measures communication clarity
- Estimates confidence level
- Calculates depth of explanation

Key Classes/Methods:
- `AnswerAnalyzer` - Main class
- `analyzeAnswer()` - Full answer evaluation
- `extractScores()` - Parse LLM response
- `calculateConfidence()` - Analyze confidence indicators
- `calculateClarity()` - Measure explanation quality
- `getAverageScores()` - Aggregate statistics

#### `reportGenerator.js`
**Creates final evaluation report**
- Calculates overall and category scores
- Identifies strengths and weaknesses
- Generates recommendations

Key Classes/Methods:
- `ReportGenerator` - Main class
- `generateReport()` - Create full report
- `calculateScores()` - Compute all scores
- `identifyStrengths()` - Find strengths
- `identifyWeaknesses()` - Find weaknesses
- `generateRecommendations()` - Create actionable recommendations

#### `demoConfig.js`
**Demo data and test configurations**
- Sample questions
- Demo answers
- Test report data
- Session management class

### Frontend Components (`/src/components/interview`)

#### `InterviewChat.js`
**Main interview chat interface**
- Displays conversation history
- Shows progress bar
- Renders final report
- Manages chat layout

Props:
- `messages` - Array of message objects
- `currentQuestionNumber` - Current question number
- `totalQuestions` - Total questions (6)
- `isLoading` - Loading state
- `onSubmitAnswer` - Answer submission handler
- `interviewComplete` - Interview completion flag
- `report` - Final report object

#### `InterviewMessage.js`
**Individual message display component**
- Renders interview messages
- Shows analysis scores
- Displays timestamps
- Different styling for AI vs user

#### `AnswerInput.js`
**User input component**
- Text textarea for answers
- Voice recording button
- Submit button
- Loading states

Props:
- `onSubmit` - Answer submission callback
- `isLoading` - Disabled state during processing

#### `ProgressIndicator.js`
**Shows interview progress**
- Progress bar
- Question count
- Percentage complete
- Completion status

#### `VoiceRecorder.js`
**Voice recording and transcription**
- Start/stop recording
- Audio processing
- Transcription display
- Error handling

### State Management (`/src/hooks`)

#### `useInterviewState.js`
**React hook for interview state management**
- Manages interview state
- Handles API calls
- Tracks messages
- Manages submission flow

Functions:
- `startInterview()` - Initialize interview
- `submitAnswer()` - Submit user answer
- `endInterview()` - End interview early
- `resetInterview()` - Reset state

### API Routes (`/pages/api/ai-interview`)

#### `/api/ai-interview/start` (POST)
Initializes a new interview session

**Response:**
```json
{
  "interviewId": "...",
  "greeting": "...",
  "question": "...",
  "questionNumber": 1,
  "totalQuestions": 6
}
```

#### `/api/ai-interview/answer` (POST)
Processes answer and returns feedback

**Request:**
```json
{
  "interviewId": "...",
  "answer": "user answer text"
}
```

**Response:**
```json
{
  "feedback": "...",
  "analysis": {
    "technical_correctness": 80,
    "depth_of_explanation": 75,
    "clarity": 82,
    "confidence": 74
  },
  "nextQuestion": "...",
  "questionNumber": 2,
  "totalQuestions": 6,
  "interviewComplete": false,
  "report": null
}
```

#### `/api/ai-interview/analyze` (POST)
Analyzes an answer using AI

**Request:**
```json
{
  "question": "...",
  "answer": "..."
}
```

**Response:**
```json
{
  "technical_correctness": 80,
  "depth_of_explanation": 75,
  "clarity": 82,
  "confidence": 74,
  "feedback": "..."
}
```

#### `/api/ai-interview/transcribe` (POST)
Transcribes audio to text

**Request:** Form data with audio file

**Response:**
```json
{
  "transcript": "transcribed text",
  "confidence": 0.95
}
```

---

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/yash-pakhale-07/RIPIS-AI.git
cd RIPIS-AI/web
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create `.env.local` file:
```bash
# Optional: OpenAI API Key for enhanced answer analysis
OPENAI_API_KEY=your_api_key_here

# Optional: Other configurations
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Running Locally

### Development Mode
```bash
cd web
npm run dev
```

Open browser and navigate to:
- Home page: `http://localhost:3000`
- AI Interview: `http://localhost:3000/ai-interview`
- Mock Interview: `http://localhost:3000/mock`

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## Environment Configuration

### Optional: OpenAI Integration

If you want to use OpenAI's GPT API for answer analysis:

1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Add to `.env.local`:
```bash
OPENAI_API_KEY=sk-...
```

3. Restart development server

**Note:** The system works fine without OpenAI key. It uses smart local analysis as fallback.

### Environment Variables Reference

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `OPENAI_API_KEY` | string | No | - | OpenAI API key for GPT analysis |
| `NEXT_PUBLIC_APP_URL` | string | No | http://localhost:3000 | App URL for deployment |

---

## Testing

### Manual Testing Checklist

#### Interview Flow
- [ ] Click "Start AI Interview" button
- [ ] Greeting message displays
- [ ] First question appears
- [ ] Can type answer
- [ ] Can submit answer
- [ ] Feedback appears
- [ ] Next question loads
- [ ] Progress bar updates
- [ ] Can end interview early

#### Answer Analysis
- [ ] Scores display correctly
- [ ] Feedback is relevant
- [ ] Different questions generate different scores
- [ ] Weak answers show lower scores
- [ ] Strong answers show higher scores

#### Voice Recording (Optional)
- [ ] Voice button toggles
- [ ] Recording starts
- [ ] Recording stops
- [ ] Transcription appears
- [ ] Text is editable before submit

#### Final Report
- [ ] Report shows after 6 questions
- [ ] All scores are calculated
- [ ] Strengths section displays
- [ ] Weaknesses section displays
- [ ] Recommendations are actionable
- [ ] Can start new interview

#### UI/UX
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Dark mode looks good
- [ ] Loading states show
- [ ] Error messages display

### Test Scenarios

#### Scenario 1: Text-Only Interview
1. Start interview
2. Answer all 6 questions with text
3. Verify progression
4. Check final report

#### Scenario 2: Voice Interview
1. Start interview
2. Use voice for some answers
3. Verify transcription
4. Check voice answers processed correctly

#### Scenario 3: Mixed Answers
1. Start interview
2. Use voice for questions 1-3
3. Use text for questions 4-6
4. Verify both types processed

#### Scenario 4: Strong Candidate
1. Answer with long, detailed explanations
2. Include technical terms
3. Provide examples
4. Check if difficulty increases
5. Verify high final scores

#### Scenario 5: Weak Answers
1. Answer with short responses
2. Avoid technical terms
3. Show uncertainty
4. Check if difficulty adjusts
5. Verify recommendations in report

### Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Deploy to Other Platforms

#### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Architecture Deep Dive

### Data Flow

```
User Interface
      ↓
useInterviewState Hook
      ↓
API Routes (/pages/api/ai-interview)
      ↓
InterviewAgent (orchestrator)
      ↓
┌─────────────────────────────┐
│ QuestionEngine              │
│ AnswerAnalyzer              │
│ ReportGenerator             │
└─────────────────────────────┘
      ↓
LLM API (OpenAI) or Local Analysis
      ↓
Response to UI
```

### Session Management

Currently, sessions are stored in:
- Server memory (API routes)
- Browser state (React hook)

For production with multiple servers:
```javascript
// Use Redis for session storage
const redis = require('redis');
const client = redis.createClient();

// Store interview sessions
async function storeSession(sessionId, data) {
  await client.setex(sessionId, 3600, JSON.stringify(data)); // 1 hour TTL
}

async function getSession(sessionId) {
  const data = await client.get(sessionId);
  return data ? JSON.parse(data) : null;
}
```

### Scaling Considerations

1. **Multiple Servers:**
   - Use Redis for session persistence
   - Use load balancing

2. **API Rate Limiting:**
   - Implement rate limiter for `/api/ai-interview` routes
   - Throttle OpenAI API calls

3. **Database:**
   - Store interview history
   - Track user progress
   - Analytics

4. **Caching:**
   - Cache question pools
   - Cache analysis results

---

## Customization

### Modify Questions

Edit `/src/modules/ai-interview/questionEngine.js`:

```javascript
const INITIAL_QUESTIONS = {
  easy: [
    "Your custom easy question 1?",
    "Your custom easy question 2?",
    // ...
  ],
  medium: [
    "Your custom medium question 1?",
    // ...
  ],
  hard: [
    "Your custom hard question 1?",
    // ...
  ],
};
```

### Adjust Difficulty Algorithm

In `questionEngine.js`, modify `adjustDifficulty()` method:

```javascript
adjustDifficulty(answerScore) {
  // Customize your logic here
  if (answerScore >= 85) { // Changed from 80
    // Increase difficulty
  }
}
```

### Change Scoring Weights

In `reportGenerator.js`, modify `calculateScores()`:

```javascript
const overall = Math.round(
  (technical * 0.40) +  // Changed from 0.35
  (problemSolving * 0.30) +  // Changed from 0.25
  (communication * 0.20) +  // Changed from 0.25
  (confidence * 0.10)  // Changed from 0.15
);
```

### Customize UI Styling

All components use Tailwind CSS. Modify `/styles/globals.css` or component files.

Example - Change primary color:
```jsx
// In components, change from blue-600 to your color
<button className="bg-indigo-600 hover:bg-indigo-700">
  Custom Color
</button>
```

### Add New Metrics

In `answerAnalyzer.js`, add new metric:

```javascript
calculateNewMetric(answer) {
  // Your calculation logic
  return score; // 0-100
}

analyzeAnswer(question, answer, llmAnalysis) {
  const analysis = {
    // ... existing code ...
    scores: {
      // ... existing scores ...
      newMetric: this.calculateNewMetric(answer),
    },
  };
  return analysis;
}
```

---

## Troubleshooting

### Issue: Interview fails to start

**Solution:**
1. Check browser console for errors
2. Verify API endpoint is responding
3. Check network tab for failed requests
4. Try refreshing page

### Issue: Voice not working

**Solution:**
1. Grant microphone permissions
2. Check browser support (Chrome/Firefox recommended)
3. Use text input instead
4. Try different browser

### Issue: Slow analysis

**Solution:**
1. If using OpenAI, check API quota
2. Reduce number of API calls
3. Optimize local analysis

### Issue: Session lost

**Solution:**
1. Sessions are cleared on page refresh
2. Implement database for persistence
3. Use local storage for basic persistence

---

## Performance Optimization

### Tips

1. **Lazy Load Components**
```javascript
const InterviewChat = dynamic(() => import('@/components/interview/InterviewChat'));
```

2. **Memoize Components**
```javascript
export default memo(InterviewMessage);
```

3. **Optimize Images**
- Use next/image
- Compress before upload

4. **Monitor Performance**
- Use Vercel Analytics
- Check Core Web Vitals
- Profile with DevTools

---

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

---

## Support

For issues or questions:
- Check GitHub Issues
- Review documentation
- Check browser console logs
- Enable debug mode

---

## License

Project License: [Check repo for license]

