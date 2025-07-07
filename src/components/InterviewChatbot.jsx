import React, { useState, useEffect } from 'react';
import { MessageCircle, Users } from 'lucide-react';
import ApiKeySetup from './ApikeySetup';
import MessageList from './MessageList';
import ChatMode from './ChatMode';
import InterviewMode from './InterviewMode';
import { testConnection, generateResponse } from '../services/geminiApi';
import { INTERVIEW_QUESTIONS, SYSTEM_PROMPTS, MESSAGE_TYPES } from '../utils/constants';
import { createMessage } from '../utils/helpers';
import FileUpload from './FileUpload';
import { GeminiService } from '../services/geminiApi';

const InterviewChatbot = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentMode, setCurrentMode] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasCustomQuestions, setHasCustomQuestions] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [geminiService, setGeminiService] = useState(null);
  
  // AssemblyAI API key state
  const [assemblyApiKey, setAssemblyApiKey] = useState('');
  const [showAssemblyKeyInput, setShowAssemblyKeyInput] = useState(false);

  // Gemini API key state
  const [showGeminiKeyInput, setShowGeminiKeyInput] = useState(false);

  // Load AssemblyAI API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('assemblyApiKey');
    const savedTimestamp = localStorage.getItem('assemblyApiKeyTimestamp');
    if (savedKey && savedTimestamp) {
      const now = Date.now();
      const age = now - parseInt(savedTimestamp, 10);
      if (age < 20*60*1000) { // 20 minutes in ms
        setAssemblyApiKey(savedKey);
      } else {
        // Expired
        localStorage.removeItem('assemblyApiKey');
        localStorage.removeItem('assemblyApiKeyTimestamp');
        setAssemblyApiKey('');
        setShowAssemblyKeyInput(true);
      }
    }
  }, []);

  // Save AssemblyAI API key to localStorage when it changes
  useEffect(() => {
    if (assemblyApiKey) {
      localStorage.setItem('assemblyApiKey', assemblyApiKey);
      localStorage.setItem('assemblyApiKeyTimestamp', Date.now().toString());
    }
  }, [assemblyApiKey]);

  // Load Gemini API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('geminiApiKey');
    const savedTimestamp = localStorage.getItem('geminiApiKeyTimestamp');
    if (savedKey && savedTimestamp) {
      const now = Date.now();
      const age = now - parseInt(savedTimestamp, 10);
      if (age < 20 * 60 * 1000) { // 20 minutes in ms
        setApiKey(savedKey);
      } else {
        // Expired
        localStorage.removeItem('geminiApiKey');
        localStorage.removeItem('geminiApiKeyTimestamp');
        setApiKey('');
        setShowGeminiKeyInput(true);
      }
    } else {
      setShowGeminiKeyInput(true);
    }
  }, []);

  // Save Gemini API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
      localStorage.setItem('geminiApiKeyTimestamp', Date.now().toString());
    }
  }, [apiKey]);

  // Initialize interview questions
  useEffect(() => {
    if (
      currentMode === 'interview' &&
      interviewQuestions.length === 0 &&
      !hasCustomQuestions
    ) {
      setInterviewQuestions(INTERVIEW_QUESTIONS);
    }
  }, [currentMode, interviewQuestions.length, hasCustomQuestions]);

  // Connect to Gemini API
  const connectToGemini = async (apiKey) => {
    try {
      const isValid = await testConnection(apiKey);
      
      if (isValid) {
        setApiKey(apiKey);
        setIsConnected(true);
        setGeminiService(new GeminiService(apiKey));
        const welcomeMessage = createMessage(
          MESSAGE_TYPES.AI,
          'Connected successfully! I\'m your AI interview assistant. I can help you practice interviews or answer questions in an interview-style format. Choose a mode above to get started.'
        );
        setMessages([welcomeMessage]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  };

  // Handle chat message
  const handleChatMessage = async (message) => {
    const userMessage = createMessage(MESSAGE_TYPES.USER, message);
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    try {
      const response = await generateResponse(apiKey, message, SYSTEM_PROMPTS.CHAT);
      const aiMessage = createMessage(MESSAGE_TYPES.AI, response);
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = createMessage(
        MESSAGE_TYPES.AI, 
        'I apologize, but I encountered an error. Please try again.'
      );
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };

  // Handle interview answer submission
  const handleAnswerSubmission = async (transcription, audioUrl) => {
    const currentQuestion = interviewQuestions[currentQuestionIndex];
    
    // Add question and answer to messages
    const questionMessage = createMessage(MESSAGE_TYPES.QUESTION, currentQuestion);
    const answerMessage = createMessage(MESSAGE_TYPES.ANSWER, transcription);
    
    setMessages(prev => [...prev, questionMessage, answerMessage]);
    
    // Store answer
    const answer = {
      question: currentQuestion,
      answer: transcription,
      audioUrl: audioUrl,
      timestamp: new Date().toISOString()
    };
    setUserAnswers(prev => [...prev, answer]);
    
    // Get AI feedback
    setIsLoading(true);
    try {
      const feedbackPrompt = `Interview Question: "${currentQuestion}"\nCandidate Answer: "${transcription}"\n\nPlease provide constructive feedback on this interview answer.`;
      const feedback = await generateResponse(apiKey, feedbackPrompt, SYSTEM_PROMPTS.INTERVIEW_FEEDBACK);
      
      const feedbackMessage = createMessage(MESSAGE_TYPES.FEEDBACK, feedback);
      setMessages(prev => [...prev, feedbackMessage]);
      
      // Move to next question or complete interview
      if (currentQuestionIndex < interviewQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        
        // Add next question after a delay
        setTimeout(() => {
          const nextQuestion = interviewQuestions[currentQuestionIndex + 1];
          const nextQuestionMessage = createMessage(
            MESSAGE_TYPES.AI,
            `Great! Let's move to the next question: "${nextQuestion}"`
          );
          setMessages(prev => [...prev, nextQuestionMessage]);
        }, 1000);
      } else {
        // Interview complete
        const completionMessage = createMessage(
          MESSAGE_TYPES.AI,
          'Interview complete! Excellent work. You\'ve successfully answered all questions. Review the feedback above to continue improving your interview skills. You can start a new interview session by clicking the Reset button.'
        );
        setMessages(prev => [...prev, completionMessage]);
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      const errorMessage = createMessage(
        MESSAGE_TYPES.AI,
        'I apologize, but I encountered an error while generating feedback. Please try again.'
      );
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };

  // Reset interview
  const resetInterview = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setMessages([]);
    setHasCustomQuestions(false);
    setInterviewQuestions([]);
    setJobDescription('');

    const resetMessage = createMessage(
      MESSAGE_TYPES.AI,
      'Interview session reset! Ready to start a new practice session. Upload a job description for custom questions or I\'ll use default questions.'
    );
    setMessages([resetMessage]);
  };

  // Switch modes
  const switchMode = (mode) => {
    setCurrentMode(mode);
    setMessages([]);
    
    if (mode === 'chat') {
      const chatMessage = createMessage(
        MESSAGE_TYPES.AI,
        'Switched to Chat Mode! Ask me anything about interviews, career advice, or practice answering questions. I\'ll respond in a professional, interview-appropriate manner.'
      );
      setMessages([chatMessage]);
    } else {
      const interviewMessage = createMessage(
        MESSAGE_TYPES.AI,
        'Switched to Interview Mode! Upload a job description to get custom questions, or I\'ll use default questions. Record your answers and I\'ll provide detailed feedback to help you improve.'
      );
      setMessages([interviewMessage]);
    }
  };

  // Handle file content extraction
  const handleFileContent = (content) => {
    setJobDescription(content);
  };

  // Handle questions generated from job description
  const handleQuestionsGenerated = (newQuestions) => {
    setInterviewQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setHasCustomQuestions(newQuestions !== INTERVIEW_QUESTIONS);
    
    const messageText = newQuestions === INTERVIEW_QUESTIONS
      ? 'Using default interview questions. Ready to start your practice session!'
      : 'Custom interview questions generated from your job description! These questions are tailored to the specific role. Ready to start your practice session!';
    
    const message = createMessage(MESSAGE_TYPES.AI, messageText);
    setMessages(prev => [...prev, message]);
  };

  if (!isConnected) {
    return <ApiKeySetup onConnect={connectToGemini} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/80 via-indigo-100/80 to-indigo-200/80 flex flex-col items-center py-2 px-2">
      {/* Header */}
      <div className="w-full mb-4 px-0 ">
        <div className="backdrop-blur-md bg-white/80 border border-indigo-100 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-all w-full">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 tracking-tight">JobPrepAI</h1>
            <p className="text-indigo-600 font-medium">AI Interview Assistant - Practice interviews or ask questions in a professional, interview-style format.</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-semibold">Connected</span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 justify-center w-full px-4">
          <button
            onClick={() => switchMode('chat')}
            className={`flex items-center px-5 py-2 rounded-lg font-semibold transition-all shadow ${
              currentMode === 'chat'
                ? 'bg-indigo-600 text-white scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat Mode
          </button>
          <button
            onClick={() => switchMode('interview')}
            className={`flex items-center px-5 py-2 rounded-lg font-semibold transition-all shadow ${
              currentMode === 'interview'
                ? 'bg-indigo-600 text-white scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Interview Mode
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-full px-4 py-6">
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input Section */}
        <div className="bg-white/90 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-xl p-6 mt-6 w-full">
          {currentMode === 'chat' ? (
            <ChatMode 
              onSendMessage={handleChatMessage} 
              isLoading={isLoading}
            />
          ) : (
            <>
              {/* File Upload Section - Show at top in interview mode */}
              <div className="mb-6">
                <FileUpload 
                  onFileContent={handleFileContent}
                  onQuestionsGenerated={handleQuestionsGenerated}
                  geminiApiKey={apiKey}
                />
              </div>

              {/* Interview Mode - Only show if questions are available */}
              {interviewQuestions.length > 0 ? (
                <InterviewMode
                  currentQuestion={interviewQuestions[currentQuestionIndex]}
                  questionIndex={currentQuestionIndex}
                  totalQuestions={interviewQuestions.length}
                  onSubmitAnswer={handleAnswerSubmission}
                  onReset={resetInterview}
                  isLoading={isLoading}
                  isCustomQuestions={hasCustomQuestions}
                  assemblyApiKey={assemblyApiKey}
                  setAssemblyApiKey={setAssemblyApiKey}
                  showAssemblyKeyInput={showAssemblyKeyInput}
                  setShowAssemblyKeyInput={setShowAssemblyKeyInput}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Upload a job description to generate custom interview questions, or the default questions will be used automatically.
                  </p>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewChatbot;