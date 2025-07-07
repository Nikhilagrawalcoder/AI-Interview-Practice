import React, { useState } from 'react';
import { RotateCcw, FileText, Settings, Eye, EyeOff } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

const InterviewMode = ({
  currentQuestion,
  questionIndex,
  totalQuestions,
  onSubmitAnswer,
  onReset,
  isLoading,
  isCustomQuestions = false,
  assemblyApiKey,
  showAssemblyKeyInput,
  setAssemblyApiKey,
  setShowAssemblyKeyInput
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(assemblyApiKey);

  const handleApiKeySubmit = () => {
    setAssemblyApiKey(tempApiKey);
    setShowAssemblyKeyInput(false);
  };

  const handleApiKeyCancel = () => {
    setTempApiKey(assemblyApiKey);
    setShowAssemblyKeyInput(false);
  };

  const handleShowAssemblyKeyInput = () => {
    setShowAssemblyKeyInput(true);
    setTempApiKey(assemblyApiKey);
  };

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

      {/* AssemblyAI API Key Input */}
      {showAssemblyKeyInput && (
        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              AssemblyAI API Key
            </label>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <input
            type={showApiKey ? "text" : "password"}
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="Enter your AssemblyAI API key"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleApiKeyCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleApiKeySubmit}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your API key is stored locally and used only for transcription. Get your key at{' '}
            <a href="https://www.assemblyai.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
              AssemblyAI
            </a>
          </p>
        </div>
      )}

      {/* Voice Recorder */}
      <VoiceRecorder 
        onSubmitAnswer={onSubmitAnswer}
        isLoading={isLoading}
        assemblyApiKey={assemblyApiKey}
        onShowAssemblyKeyInput={handleShowAssemblyKeyInput}
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
          <li>• {assemblyApiKey ? '✓ AssemblyAI configured for transcription' : '⚠ Set AssemblyAI API key for automatic transcription'}</li>
        </ul>
      </div>

      {/* API Key Status */}
      {!assemblyApiKey && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-medium">Setup AssemblyAI for Transcription</p>
              <p className="text-blue-600 text-sm">
                Add your AssemblyAI API key to enable automatic speech-to-text transcription
              </p>
            </div>
            <button
              onClick={handleShowAssemblyKeyInput}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-4 w-4 mr-1" />
              Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewMode;