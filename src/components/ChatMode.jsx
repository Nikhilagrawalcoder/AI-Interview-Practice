import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatMode = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full flex items-end space-x-1 bg-white/80 backdrop-blur-md border border-indigo-100 rounded-xl shadow-md p-1">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message or ask interview-related questions..."
        className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-indigo-50/50 text-indigo-900 font-medium resize-none transition"
        rows="1"
        style={{ minHeight: '42px', maxHeight: '120px' }}
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !inputText.trim()}
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        title="Send"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ChatMode;