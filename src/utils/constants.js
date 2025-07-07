export const INTERVIEW_QUESTIONS = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths and weaknesses?",
  "Why do you want to work for our company?",
  "Describe a challenging situation you faced and how you handled it.",
  "Where do you see yourself in 5 years?",
  "What motivates you in your work?",
  "How do you handle pressure and tight deadlines?",
  "Tell me about a time when you had to work with a difficult team member.",
  "What is your biggest professional achievement?",
  "Do you have any questions for us?"
];

export const SYSTEM_PROMPTS = {
  CHAT: "You are an AI assistant helping with interview preparation. Respond in a professional, interview-appropriate manner. Be helpful and encouraging.",
  INTERVIEW_FEEDBACK: "You are an experienced HR interviewer. Provide constructive feedback on interview answers. Be encouraging but honest about areas for improvement. Focus on communication skills, content relevance, and professional presentation. Provide specific suggestions for improvement.",
  JD_QUESTION_GENERATOR: "You are an experienced HR interviewer. Based on the job description provided, generate exactly 10 relevant interview questions that would help assess a candidate's fit for this specific role. Focus on role-specific skills, experience, and behavioral questions relevant to the position. Return only the questions, numbered 1-10, without any additional explanation."
};

export const MESSAGE_TYPES = {
  USER: 'user',
  AI: 'ai',
  FEEDBACK: 'feedback',
  QUESTION: 'question',
  ANSWER: 'answer'
};