/**
 * Demo Configuration - Pre-scripted interview data for demo/offline mode
 * Full 6-question demo with adaptive follow-ups and final report
 */

export const DEMO_QUESTIONS = [
  {
    q: "Tell me about your programming experience. What languages have you worked with and what do you enjoy most about coding?",
    topic: "Programming fundamentals",
    difficulty: "easy",
  },
  {
    q: "Can you explain what a data structure is and give me some examples? When would you choose one over another?",
    topic: "Data structures",
    difficulty: "easy",
  },
  {
    q: "Explain how a hash map works internally. What happens during a collision, and how is it resolved?",
    topic: "Data structures",
    difficulty: "medium",
  },
  {
    q: "What's the difference between REST and GraphQL APIs? When would you use each approach?",
    topic: "Web development",
    difficulty: "medium",
  },
  {
    q: "How would you optimize a slow database query? Walk me through your approach and the tools you'd use.",
    topic: "Database design",
    difficulty: "medium",
  },
  {
    q: "Design a URL shortener like bit.ly. What are the key components, data model, and how would you handle scale?",
    topic: "System design",
    difficulty: "hard",
  },
];

export const DEMO_ANSWERS = [
  "I've been programming for about 3 years. I'm most comfortable with Python and JavaScript. I've used Python for backend development and data science projects, while JavaScript has been my primary tool for frontend development in React. I also have some experience with Java from university coursework. What I enjoy most is the problem-solving aspect — taking a complex problem and breaking it down into smaller, manageable pieces.",
  "Data structures are ways to organize and store data efficiently. Common ones include arrays for sequential access, linked lists for dynamic sizing, hash maps for fast key-value lookups, stacks for LIFO operations, and queues for FIFO. I'd choose an array when I need index-based access, a hash map for lookups, and a linked list when I need frequent insertions and deletions.",
  "A hash map uses a hash function to compute an index into an array of buckets. When you insert a key-value pair, the hash function transforms the key into an array index. The main advantage is O(1) average lookups. Collisions happen when two keys hash to the same index — they're resolved using chaining (linked list at each bucket) or open addressing (probing for the next empty slot). In the worst case with many collisions, performance can degrade to O(n).",
  "REST uses standard HTTP methods with resource-based URLs and returns data in a fixed structure. GraphQL uses a single endpoint where the client specifies exactly what data it needs through queries. REST is simpler and benefits from HTTP caching, but can lead to over-fetching or under-fetching. GraphQL is better when you have complex, nested data requirements or need to reduce the number of API calls. I'd use REST for simple CRUD APIs and GraphQL for complex frontends.",
  "First, I'd analyze the query execution plan using EXPLAIN to identify bottlenecks. Common optimizations include: adding proper indexes on frequently queried columns, avoiding SELECT * and only fetching needed columns, optimizing JOINs by ensuring foreign keys are indexed, using query caching, and considering denormalization for read-heavy workloads. I'd also check for N+1 query problems and consider using pagination for large result sets.",
  "For a URL shortener, the key components are: a web server for the API, a database to store URL mappings, and a hash/encoding function. I'd use Base62 encoding on an auto-incrementing ID to generate short codes. The data model needs a table with columns for the short code, original URL, creation date, and click count. For scale, I'd add a caching layer like Redis for popular URLs, use a load balancer, and consider partitioning the database. Read-heavy workload means I'd optimize for reads with caching and CDN.",
];

export const DEMO_FEEDBACK = [
  "Good overview of your background! You clearly articulate your experience and what motivates you. The mention of specific technologies and use cases shows practical experience.",
  "Nice explanation! You covered the key data structures with their use cases. The comparison between them shows you understand the trade-offs involved in choosing the right structure.",
  "Strong answer on hash maps! You explained the internal mechanism clearly and covered collision resolution strategies well. Mentioning the worst-case complexity shows analytical thinking.",
  "Great comparison! You highlighted the key differences and trade-offs between REST and GraphQL. Your recommendation of when to use each shows practical judgment.",
  "Thorough approach to query optimization! You covered multiple angles from indexing to execution plans. Mentioning N+1 problems and pagination shows real-world experience.",
  "Solid system design answer! You covered the core components, data model, and scaling considerations. The mention of caching, load balancing, and database partitioning shows you think about scale.",
];

export const DEMO_ANALYSES = [
  { technical_correctness: 72, depth_of_explanation: 70, clarity: 80, confidence: 75 },
  { technical_correctness: 78, depth_of_explanation: 75, clarity: 82, confidence: 74 },
  { technical_correctness: 85, depth_of_explanation: 82, clarity: 78, confidence: 80 },
  { technical_correctness: 80, depth_of_explanation: 78, clarity: 85, confidence: 76 },
  { technical_correctness: 82, depth_of_explanation: 80, clarity: 75, confidence: 78 },
  { technical_correctness: 75, depth_of_explanation: 72, clarity: 70, confidence: 68 },
];

export const DEMO_REPORT = {
  overall_score: 78,
  technical_knowledge: 80,
  problem_solving: 75,
  communication: 82,
  confidence: 74,
  strengths: [
    "Good understanding of data structures and hash maps",
    "Clear and structured communication with examples",
    "Practical knowledge of database optimization",
    "Solid system design thinking with scaling considerations",
  ],
  weaknesses: [
    "Could go deeper on system design trade-offs",
    "Needs more practice with algorithm complexity analysis",
    "Could strengthen explanations with more concrete examples",
  ],
  recommendations: [
    "Practice LeetCode problems focusing on Big O analysis",
    "Study system design patterns — read 'Designing Data-Intensive Applications'",
    "Record yourself explaining solutions to improve delivery",
    "Work through distributed systems concepts (CAP theorem, consensus)",
    "Practice mock interviews more frequently to build confidence",
  ],
  total_questions: 6,
  interview_duration: "18-24 minutes",
  generated_at: new Date().toISOString(),
};
