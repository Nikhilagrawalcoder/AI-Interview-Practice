import { INTERVIEW_QUESTIONS, SYSTEM_PROMPTS } from '../utils/constants';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const testConnection = async (apiKey) => {
    try {
    const response = await fetch(`${BASE_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Hello, this is a test message."
            }]
          }]
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
};

export const generateResponse = async (apiKey, prompt, systemPrompt = '') => {
    try {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt;
      
    const response = await fetch(`${BASE_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      });
      
      const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini API.";
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble generating a response right now. Please try again.";
    }
};

export class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  }

  async generateQuestions(jobDescription) {
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }

    const prompt = `Based on the following job description, generate exactly 10 interview questions, numbered 1 to 10, with each question on a new line and no explanations or extra text. Only output the questions.

Job Description:
${jobDescription}
`;

    try {
      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      console.log('Gemini raw output:', generatedText);
      
      // Parse the generated questions
      const questions = this.parseQuestions(generatedText);
      
      if (questions.length < 5) {
        console.warn('Generated questions count is less than 5, falling back to default questions');
        return INTERVIEW_QUESTIONS;
      }
      
      return questions;
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      // Fallback to default questions
      return INTERVIEW_QUESTIONS;
    }
  }

  parseQuestions(text) {
    // Split by lines and filter out empty lines
    const lines = text.split('\n').filter(line => line.trim());
    
    // Extract questions (remove numbering if present)
    const questions = lines
      .map(line => line.replace(/^\d+\.?\s*/, '').trim())
      .filter(line => line.length > 0 && line.endsWith('?'));
    
    return questions;
  }
}