import React, { useEffect, useRef } from 'react';
import { MESSAGE_TYPES } from '../utils/constants';
import { User, Bot, ThumbsUp, HelpCircle, MessageSquare } from 'lucide-react';

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageStyle = (type) => {
    switch (type) {
      case MESSAGE_TYPES.USER:
        return 'bg-indigo-600 text-white ml-auto rounded-br-none';
      case MESSAGE_TYPES.AI:
        return 'bg-gray-100 text-gray-800 mr-auto rounded-bl-none';
      case MESSAGE_TYPES.FEEDBACK:
        return 'bg-green-50 text-green-900 border border-green-200 mr-auto rounded-bl-none';
      case MESSAGE_TYPES.QUESTION:
        return 'bg-blue-50 text-blue-900 border border-blue-200 mr-auto rounded-bl-none';
      case MESSAGE_TYPES.ANSWER:
        return 'bg-yellow-50 text-yellow-900 border border-yellow-200 ml-auto rounded-br-none';
      default:
        return 'bg-gray-100 text-gray-800 mr-auto';
    }
  };

  const getMessageLabel = (type) => {
    switch (type) {
      case MESSAGE_TYPES.FEEDBACK:
        return (
          <span className="flex items-center gap-1 text-green-700">
            <ThumbsUp className="h-4 w-4" /> AI Feedback
          </span>
        );
      case MESSAGE_TYPES.QUESTION:
        return (
          <span className="flex items-center gap-1 text-blue-700">
            <HelpCircle className="h-4 w-4" /> Interview Question
          </span>
        );
      case MESSAGE_TYPES.ANSWER:
        return (
          <span className="flex items-center gap-1 text-yellow-700">
            <MessageSquare className="h-4 w-4" /> Your Answer
          </span>
        );
      default:
        return null;
    }
  };

  const getAvatar = (type) => {
    if (type === MESSAGE_TYPES.USER || type === MESSAGE_TYPES.ANSWER) {
      return (
        <div className="flex-shrink-0 flex items-end">
          <User className="h-8 w-8 text-indigo-500 bg-indigo-100 rounded-full p-1 shadow" />
        </div>
      );
    }
    return (
      <div className="flex-shrink-0 flex items-end">
        <Bot className="h-8 w-8 text-gray-500 bg-gray-100 rounded-full p-1 shadow" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-96 overflow-y-auto">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isUser = message.type === MESSAGE_TYPES.USER || message.type === MESSAGE_TYPES.ANSWER;
            return (
              <div
                key={message.id || index}
                className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && getAvatar(message.type)}
                <div
                  className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${getMessageStyle(message.type)} mx-2`}
                >
                  {getMessageLabel(message.type) && (
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {getMessageLabel(message.type)}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1 text-right">{message.timestamp}</p>
                  {/* Speech bubble tail */}
                  <span
                    className={`absolute bottom-0 ${
                      isUser
                        ? 'right-0 translate-x-1/2 border-l-[12px] border-l-indigo-600 border-b-[12px] border-b-transparent'
                        : 'left-0 -translate-x-1/2 border-r-[12px] border-r-gray-100 border-b-[12px] border-b-transparent'
                    }`}
                    style={{ borderWidth: 0 }}
                  ></span>
                </div>
                {isUser && getAvatar(message.type)}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-sm">AI is thinking...</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;