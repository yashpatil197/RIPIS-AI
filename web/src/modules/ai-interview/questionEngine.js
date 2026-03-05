/**
 * Question Engine - Dynamic question generation with adaptive difficulty
 * Supports LLM-powered generation with large diverse pool fallback
 */

const DIFFICULTY_LEVELS = { EASY: "easy", MEDIUM: "medium", HARD: "hard" };

const QUESTION_POOL = {
  easy: [
    { topic: "Programming fundamentals", q: "Tell me about your programming experience. What languages have you worked with and what do you enjoy most about coding?" },
    { topic: "Programming fundamentals", q: "Can you explain the difference between compiled and interpreted languages? Give me some examples of each." },
    { topic: "Data structures", q: "What is a data structure? Can you name a few common ones and when you'd use them?" },
    { topic: "Data structures", q: "What's the difference between an array and a linked list? When would you prefer one over the other?" },
    { topic: "Problem solving", q: "How do you approach solving a new programming problem? Walk me through your thought process." },
    { topic: "Problem solving", q: "If you encounter a bug in your code that you can't immediately find, what steps do you take to debug it?" },
    { topic: "Web development", q: "Can you explain the difference between frontend and backend development? What technologies are used for each?" },
    { topic: "Web development", q: "What happens when you type a URL into a browser and press Enter? Walk me through the journey." },
    { topic: "OOP concepts", q: "What is Object-Oriented Programming? Can you explain its main principles?" },
    { topic: "OOP concepts", q: "What's the difference between a class and an object? Can you give a real-world analogy?" },
    { topic: "Database design", q: "What is a database? What's the difference between SQL and NoSQL databases?" },
    { topic: "Algorithms", q: "What is an algorithm? Can you describe a simple one you've used in your projects?" },
  ],
  medium: [
    { topic: "Data structures", q: "Explain how a hash map works internally. What happens during a collision, and how is it resolved?" },
    { topic: "Data structures", q: "Compare and contrast stacks and queues. Give me a real-world use case for each." },
    { topic: "Data structures", q: "What is a binary search tree? How does insertion and lookup work, and what's the time complexity?" },
    { topic: "Algorithms", q: "Explain the difference between BFS and DFS. When would you use one over the other?" },
    { topic: "Algorithms", q: "What is time complexity? Explain Big O notation with examples of O(1), O(n), and O(n²)." },
    { topic: "Algorithms", q: "Explain how merge sort works. What's its time and space complexity, and why is it preferred for linked lists?" },
    { topic: "Web development", q: "What's the difference between REST and GraphQL APIs? What are the trade-offs of each approach?" },
    { topic: "Web development", q: "Explain the concept of middleware in web frameworks. How does it work in Express.js or similar?" },
    { topic: "Web development", q: "What are WebSockets? How do they differ from HTTP, and when would you use them?" },
    { topic: "System design", q: "How would you design a caching layer for a web application? What strategies would you consider?" },
    { topic: "System design", q: "Explain the concept of load balancing. Why is it important and what are the common strategies?" },
    { topic: "OOP concepts", q: "Explain the SOLID principles with examples. Which one do you think is most important and why?" },
    { topic: "OOP concepts", q: "What are design patterns? Describe the Observer and Singleton patterns with use cases." },
    { topic: "Database design", q: "Explain database normalization. What are the different normal forms and when might you denormalize?" },
    { topic: "Database design", q: "How would you optimize a slow database query? Walk me through your approach." },
    { topic: "Problem solving", q: "Given an array of integers, how would you find two numbers that add up to a target sum? What's the most efficient approach?" },
  ],
  hard: [
    { topic: "System design", q: "Design a URL shortener like bit.ly. What are the key components, data model, and how would you handle billions of URLs?" },
    { topic: "System design", q: "How would you design a real-time chat application like WhatsApp? Consider message delivery, read receipts, and offline support." },
    { topic: "System design", q: "Describe your approach to scaling a web application from 1 million to 100 million users. What architectural changes would be needed?" },
    { topic: "System design", q: "How would you implement a distributed cache like Redis? What consistency and eviction strategies would you use?" },
    { topic: "System design", q: "Design a rate limiter for an API. What algorithms would you consider and how would you make it distributed?" },
    { topic: "Algorithms", q: "Explain dynamic programming. Walk me through solving the longest common subsequence problem step by step." },
    { topic: "Algorithms", q: "What is the difference between greedy algorithms and dynamic programming? When is each approach appropriate?" },
    { topic: "Data structures", q: "Explain how a B-tree works and why databases use them for indexing instead of binary search trees." },
    { topic: "Web development", q: "Explain the event loop in Node.js. How does it handle asynchronous operations and what are microtasks vs macrotasks?" },
    { topic: "Database design", q: "What are the trade-offs between consistency and availability in distributed systems? Explain the CAP theorem with real examples." },
    { topic: "Database design", q: "How would you design a database schema for a social media platform? Consider posts, comments, likes, and follower relationships." },
    { topic: "Problem solving", q: "How would you detect a cycle in a linked list? Explain your approach and analyze its time and space complexity." },
  ],
};

// Follow-up templates based on answer quality
const FOLLOW_UP_TEMPLATES = {
  strong: [
    "That was a great explanation. Let me dig deeper — {followup}",
    "Excellent answer. Building on that, {followup}",
    "Very thorough. Let's take it further — {followup}",
  ],
  weak: [
    "Let me approach this from a different angle. {followup}",
    "That's a good start. Let me ask it differently — {followup}",
    "No worries, let's try something related. {followup}",
  ],
  clarify: [
    "Can you elaborate more on that? Specifically, {followup}",
    "That's interesting, but I'd like to understand better — {followup}",
    "Could you walk me through a concrete example of what you mean?",
  ],
};

/** System prompt for the LLM interviewer */
const INTERVIEWER_SYSTEM_PROMPT = `You are an experienced technical interviewer conducting a realistic 1:1 interview.

Rules:
* Ask one question at a time
* Adjust difficulty based on the candidate's previous answer
* Ask follow-up questions when needed
* Test both conceptual understanding and practical thinking
* Be professional and conversational
* Conduct a total of 6 interview questions.

Topics can include:
* Programming fundamentals
* Data structures
* Problem solving
* System design
* Web development

Generate the next interview question based on the conversation so far. Return ONLY in this JSON format:
{
  "question": "your question here",
  "topic": "topic category",
  "difficulty": "easy|medium|hard",
  "reasoning": "brief note on why this question was chosen"
}`;

class QuestionEngine {
  constructor() {
    this.questionsAsked = [];
    this.topicsAsked = [];
    this.difficulty = DIFFICULTY_LEVELS.EASY;
    this.totalQuestions = 6;
  }

  startInterview() {
    this.difficulty = DIFFICULTY_LEVELS.EASY;
    const question = this._pickQuestion(DIFFICULTY_LEVELS.EASY);
    this.questionsAsked.push({ question: question.q, topic: question.topic, difficulty: DIFFICULTY_LEVELS.EASY });
    this.topicsAsked.push(question.topic);
    return {
      question: question.q,
      questionNumber: 1,
      totalQuestions: this.totalQuestions,
      difficulty: DIFFICULTY_LEVELS.EASY,
    };
  }

  /**
   * Generate next question using LLM when available
   * @param {string} apiKey - OpenAI API key
   * @param {Array} conversationHistory - Full conversation history
   * @param {number} answerScore - Score from previous answer
   * @param {string} answerContent - Previous answer content
   * @returns {Promise<object|null>}
   */
  async generateNextQuestionLLM(apiKey, conversationHistory, answerScore, answerContent) {
    const count = this.questionsAsked.length;
    if (count >= this.totalQuestions) return null;

    this._adjustDifficulty(answerScore);

    // Try LLM generation
    if (apiKey) {
      try {
        const llmQuestion = await this._askLLMForQuestion(apiKey, conversationHistory, answerScore);
        if (llmQuestion) {
          this.questionsAsked.push({
            question: llmQuestion.question,
            topic: llmQuestion.topic || "General",
            difficulty: llmQuestion.difficulty || this.difficulty,
          });
          this.topicsAsked.push(llmQuestion.topic || "General");
          return {
            question: llmQuestion.question,
            questionNumber: count + 1,
            totalQuestions: this.totalQuestions,
            difficulty: llmQuestion.difficulty || this.difficulty,
          };
        }
      } catch (e) {
        console.error("LLM question generation failed, using pool:", e);
      }
    }

    // Fallback to pool-based generation
    return this.generateNextQuestion(answerScore, answerContent);
  }

  /** Pool-based next question (fallback) */
  generateNextQuestion(answerScore, answerContent) {
    const count = this.questionsAsked.length;
    if (count >= this.totalQuestions) return null;

    this._adjustDifficulty(answerScore);
    const question = this._pickQuestion(this.difficulty);
    this.questionsAsked.push({ question: question.q, topic: question.topic, difficulty: this.difficulty });
    this.topicsAsked.push(question.topic);

    return {
      question: question.q,
      questionNumber: count + 1,
      totalQuestions: this.totalQuestions,
      difficulty: this.difficulty,
    };
  }

  /**
   * Ask LLM to generate the next question
   */
  async _askLLMForQuestion(apiKey, conversationHistory, lastScore) {
    const contextMessages = [
      { role: "system", content: INTERVIEWER_SYSTEM_PROMPT },
    ];

    // Add conversation history for context
    const recentHistory = conversationHistory.slice(-10); // Last 10 entries
    for (const entry of recentHistory) {
      if (entry.role === "interviewer" && entry.type === "question") {
        contextMessages.push({ role: "assistant", content: `[Question] ${entry.content}` });
      } else if (entry.role === "candidate") {
        contextMessages.push({ role: "user", content: entry.content });
      } else if (entry.role === "interviewer" && entry.type === "feedback") {
        contextMessages.push({ role: "assistant", content: `[Feedback] ${entry.content}` });
      }
    }

    // Add instruction for next question
    contextMessages.push({
      role: "user",
      content: `The candidate's last answer scored ${lastScore}/100. Current difficulty level: ${this.difficulty}. Questions asked so far: ${this.questionsAsked.length}/${this.totalQuestions}. Topics already covered: ${[...new Set(this.topicsAsked)].join(", ")}. Generate the next interview question — pick a different topic if possible. ${lastScore >= 80 ? "The candidate is strong — ask a harder question." : lastScore < 50 ? "The candidate struggled — ask a simpler question on a fundamental topic." : "Maintain the current difficulty."}`,
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: contextMessages,
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.question) return parsed;
    }

    return null;
  }

  _adjustDifficulty(score) {
    if (score >= 80) {
      if (this.difficulty === DIFFICULTY_LEVELS.EASY) this.difficulty = DIFFICULTY_LEVELS.MEDIUM;
      else if (this.difficulty === DIFFICULTY_LEVELS.MEDIUM) this.difficulty = DIFFICULTY_LEVELS.HARD;
    } else if (score < 50) {
      if (this.difficulty === DIFFICULTY_LEVELS.HARD) this.difficulty = DIFFICULTY_LEVELS.MEDIUM;
      else if (this.difficulty === DIFFICULTY_LEVELS.MEDIUM) this.difficulty = DIFFICULTY_LEVELS.EASY;
    }
  }

  _pickQuestion(difficulty) {
    const pool = QUESTION_POOL[difficulty] || QUESTION_POOL.medium;
    // Prefer topics not yet asked
    const askedQuestions = this.questionsAsked.map((q) => q.question);
    const unaskedFromNewTopics = pool.filter(
      (q) => !askedQuestions.includes(q.q) && !this.topicsAsked.includes(q.topic)
    );
    if (unaskedFromNewTopics.length > 0) {
      return unaskedFromNewTopics[Math.floor(Math.random() * unaskedFromNewTopics.length)];
    }
    // Fallback to any unasked question
    const unasked = pool.filter((q) => !askedQuestions.includes(q.q));
    if (unasked.length > 0) {
      return unasked[Math.floor(Math.random() * unasked.length)];
    }
    // Ultimate fallback
    return pool[Math.floor(Math.random() * pool.length)];
  }

  getProgress() {
    return {
      questionsAsked: this.questionsAsked.length,
      totalQuestions: this.totalQuestions,
      percentage: (this.questionsAsked.length / this.totalQuestions) * 100,
      currentDifficulty: this.difficulty,
    };
  }

  isInterviewComplete() {
    return this.questionsAsked.length >= this.totalQuestions;
  }

  reset() {
    this.questionsAsked = [];
    this.topicsAsked = [];
    this.difficulty = DIFFICULTY_LEVELS.EASY;
  }
}

export { QuestionEngine, QUESTION_POOL, FOLLOW_UP_TEMPLATES, DIFFICULTY_LEVELS, INTERVIEWER_SYSTEM_PROMPT };
