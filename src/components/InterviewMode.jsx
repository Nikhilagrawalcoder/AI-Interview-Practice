import React from 'react';
import { RotateCcw, FileText } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

const InterviewMode = ({
  currentQuestion,
  questionIndex,
  totalQuestions,
  onSubmitAnswer,
  onReset,
  isLoading,
  isCustomQuestions = false
}) => {
  return (
    <div className="space-y-6">
      {/* Question Display */}
      <div className={`p-4 rounded-lg ${isCustomQuestions ? 'bg-green-50' : 'bg-blue-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <p className={`text-sm font-medium ${isCustomQuestions ? 'text-green-600' : 'text-blue-600'}`}>
                Question {questionIndex + 1} of {totalQuestions}
              </p>
              {isCustomQuestions && (
                <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  <FileText className="h-3 w-3" />
                  <span>Custom JD</span>
                </div>
              )}
            </div>
            <p className={`font-medium mt-1 text-lg ${isCustomQuestions ? 'text-green-800' : 'text-blue-800'}`}>
              {currentQuestion}
            </p>
          </div>
          <button
            onClick={onReset}
            className={`flex items-center px-3 py-1 rounded-lg hover:bg-opacity-80 transition-colors text-sm ${
              isCustomQuestions 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </button>
        </div>
      </div>

      {/* Voice Recorder */}
      <VoiceRecorder 
        onSubmitAnswer={onSubmitAnswer}
        isLoading={isLoading}
      />

      {/* Instructions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">Interview Tips:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Take your time to think before recording</li>
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
          <li>• Be specific and provide concrete examples</li>
          {isCustomQuestions && (
            <li>• These questions are tailored to the job description you uploaded</li>
          )}
          <li>• Review the AI feedback to improve your answers</li>
        </ul>
      </div>
    </div>
  );
};

export default InterviewMode;