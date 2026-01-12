'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { MessageCircle, Send } from 'lucide-react';

export default function Chat() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I\'m your fitness coach. How can I help you today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: 'Thanks for your message! This is a demo chat. In a full version, I would provide personalized fitness advice and answer your questions.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#2E86AB]">
            <div className="flex items-center gap-3">
              <MessageCircle size={32} className="text-[#2E86AB]" />
              <div>
                <h1 className="text-3xl font-bold mb-1 text-gray-900">Fitness Coach Chat</h1>
                <p className="text-gray-600">Get personalized advice and support</p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-xl shadow-lg flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.sender === 'user'
                        ? 'bg-[#2E86AB] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                />
                <button
                  type="submit"
                  className="bg-[#2E86AB] text-white px-6 py-3 rounded-lg hover:bg-[#1f5f8a] transition-all flex items-center gap-2"
                >
                  <Send size={20} />
                  <span className="hidden md:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
