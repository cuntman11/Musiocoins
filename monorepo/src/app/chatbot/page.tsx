'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/providers/ModalProvider';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Utility functions
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const renderMessageContent = (text: string, isUser: boolean) => {
  // Simple markdown-like rendering for links and basic formatting
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = text.split(linkRegex);
  
  return parts.map((part, index) => {
    if (index % 3 === 1) {
      return (
        <a
          key={index}
          href={parts[index + 1]}
          className={`underline hover:opacity-80 ${
            isUser ? 'text-blue-600 dark:text-blue-400' : 'text-blue-300 dark:text-blue-500'
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    } else if (index % 3 === 2) {
      return null;
    } else {
      return part;
    }
  });
};

export default function ChatbotPage() {
  const router = useRouter();
  const { openCreateCoinModal } = useModal();
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `Hi! I'm your Tokebot. How can I help you today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      text: input, 
      isUser: true, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);

    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();
      console.log(data);
      
      if(data.response_type == 'create-coin') {
        console.log(data.data);
        openCreateCoinModal(data.data,data['predict-performance'],data['analyze-content']);
      }

      if(data.response_type == 'token-research') {
        let tokenAddress = data.data.address;
        let type = data.data.target;
        console.log(tokenAddress, type);

        if(type == 'token') {
          window.location.href = `/coin/${tokenAddress}`;
        }
        else if(type == 'creator') {
          window.location.href = `/profile/${tokenAddress}`;
        }
      }

      setTimeout(() => {
        setIsTyping(false);
        if (response) {
          const botMessage: Message = { 
            text: data.message, 
            isUser: false, 
            timestamp: new Date() 
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          const errorMessage: Message = { 
            text: `Error: ${data.error}`, 
            isUser: false, 
            timestamp: new Date() 
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        const errorMessage: Message = { 
          text: 'Network error occurred', 
          isUser: false, 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, errorMessage]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white dark:text-black" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Tokebot</h1>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isUser ? 'bg-gray-200 dark:bg-gray-700' : 'bg-black dark:bg-white'}`}>
                    {msg.isUser ? (
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Bot className="h-5 w-5 text-white dark:text-black" />
                    )}
                  </div>
                  <div className={`rounded-lg p-4 shadow-sm ${msg.isUser ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'bg-black dark:bg-white text-white dark:text-black'}`}>
                    <div className="text-sm max-w-none leading-relaxed">
                      {renderMessageContent(msg.text, msg.isUser)}
                    </div>
                    <p className={`text-xs mt-2 ${msg.isUser ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="h-10 w-10 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-white dark:text-black" />
                  </div>
                  <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm mr-2">Typing</span>
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}