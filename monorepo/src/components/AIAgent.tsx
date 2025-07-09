'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useModal } from '@/providers/ModalProvider';
import { formatTime } from '@/utils/formatTime';
import { Message, AIAgentProps } from '@/utils/interfaces';
import { renderMessageContent } from '@/utils/renderMD';
import { getPositionClasses } from '@/utils/getPositionClass';

const AIAgent: React.FC<AIAgentProps> = ({
  position = 'bottom-right',
  apiEndpoint = '/api/chat',
  agentName = 'Musio Bot'
}) => {
  const { openCreateCoinModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `Hi! I'm your ${agentName}. How can I help you today?`,
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
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

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
      const response = await fetch(apiEndpoint, {
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
        window.location.reload();
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
  if (!isOpen) {
    return (
      <div className={getPositionClasses(position)}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-105"
          size="icon"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>
    );
  }
  return (
    <div className={getPositionClasses(position)}>
      <Card className={`w-[500px] ${isMinimized ? 'h-[90px]' : 'h-[600px]'} bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 shadow-2xl transition-all duration-300 ${isMinimized ? 'overflow-hidden' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">{agentName}</h3>
              <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                Online
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400"
            >
              {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[450px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isUser ? 'bg-blue-100 dark:bg-blue-800' : 'bg-blue-600 dark:bg-blue-500'}`}>
                      {msg.isUser ? (
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-200" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-4 ${msg.isUser ? 'bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'bg-blue-600 dark:bg-blue-500 text-white'}`}>
                      <div className="text-sm max-w-none">
                        {renderMessageContent(msg.text, msg.isUser)}
                      </div>
                      <p className={`text-xs mt-2 ${msg.isUser ? 'text-blue-500 dark:text-blue-400' : 'text-blue-100 dark:text-blue-200'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-blue-600 dark:bg-blue-500 text-white rounded-lg p-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm mr-2">Typing</span>
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-2 h-2 bg-blue-200 dark:bg-blue-300 rounded-full animate-bounce"
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

            <div className="border-t border-blue-200 dark:border-blue-800 p-4">
              <div className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-100 placeholder-blue-400 dark:placeholder-blue-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-5 h-11 transition-all duration-200 hover:scale-105"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIAgent;