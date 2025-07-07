import React, { useState } from 'react';
import { Settings } from 'lucide-react';

const ApiKeySetup = ({ onConnect }) => {
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your Gemini API key');
      return;
    }

    setIsConnecting(true);
    const success = await onConnect(apiKey);
    setIsConnecting(false);

    if (!success) {
      alert('Failed to connect. Please check your API key.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/80 via-indigo-100/80 to-indigo-200/80 flex items-center justify-center p-4">
      <div className="backdrop-blur-md bg-white/80 border border-indigo-100 rounded-2xl shadow-2xl p-8 w-full max-w-md transition-all">
        <div className="text-center mb-6">
          <Settings className="mx-auto h-16 w-16 text-indigo-500 mb-4 drop-shadow" />
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-1 tracking-tight">
            JobPrepAI
          </h1>
          <p className="text-lg text-indigo-600 font-medium mb-2">
            An AI Interview Assistant
          </p>
          <p className="text-indigo-500">Connect with your Gemini API key to get started</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-indigo-700 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-indigo-50/50 text-indigo-900 font-medium transition"
              onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
              autoFocus
            />
          </div>
          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all font-semibold shadow disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect to Gemini'}
          </button>
          
          <div className="text-xs text-indigo-500 text-center mt-4">
            <p>
              <span className="font-semibold">Get your API key</span> from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-indigo-700"
              >
                Google AI Studio
              </a>
            </p>
            <p>Your key is stored locally and never shared.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;