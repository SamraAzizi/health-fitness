import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, Loader } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';

const QUICK_QUESTIONS = [
  { label: 'Suggest a workout', value: 'Can you suggest a good workout for chest and arms?' },
  { label: 'Nutrition tips', value: 'What are the best foods for muscle gain?' },
  { label: 'Recovery tips', value: 'How can I improve my recovery?' },
  { label: 'Goal setting', value: 'How should I set my fitness goals?' },
];

const FITNESS_RESPONSES = {
  'workout': {
    content: 'Here\'s a great workout routine for you:\n\n1. Warm-up (5 min)\n2. Main exercises (30 min)\n3. Cool-down (5 min)\n\nRemember to focus on form over weight!',
    tips: ['Rest 60-90 seconds between sets', 'Stay hydrated', 'Track your progress']
  },
  'nutrition': {
    content: 'Here are key foods for muscle gain:\n\n• Lean proteins: Chicken, fish, eggs\n• Complex carbs: Brown rice, oats, sweet potatoes\n• Healthy fats: Almonds, avocados, olive oil',
    tips: ['Eat in a caloric surplus', 'Get 1g protein per lb bodyweight', 'Time meals around workouts']
  },
  'recovery': {
    content: 'Recovery is crucial for muscle growth. Here\'s how to optimize it:\n\n• Sleep 7-9 hours per night\n• Stretch for 10-15 minutes post-workout\n• Stay hydrated and maintain nutrition',
    tips: ['Use foam rolling for 2 minutes per muscle', 'Take rest days seriously', 'Manage stress through meditation']
  },
  'goal': {
    content: 'Smart fitness goal setting:\n\nUse the SMART framework:\n• Specific: "Lose 10kg"\n• Measurable: Track weekly\n• Achievable: Be realistic\n• Relevant: Aligns with lifestyle\n• Time-bound: Set a deadline',
    tips: ['Break goals into smaller milestones', 'Review progress monthly', 'Adjust as needed']
  }
};

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! 👋 I\'m your AI fitness coach. Ask me anything about workouts, nutrition, recovery, or goal setting!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Check keywords
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
      return FITNESS_RESPONSES['workout'];
    } else if (lowerMessage.includes('nutrition') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return FITNESS_RESPONSES['nutrition'];
    } else if (lowerMessage.includes('recovery') || lowerMessage.includes('rest') || lowerMessage.includes('sleep')) {
      return FITNESS_RESPONSES['recovery'];
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      return FITNESS_RESPONSES['goal'];
    } else {
      return {
        content: 'That\'s a great question! To give you the best advice, could you tell me more about your fitness goals? Are you looking to build muscle, lose weight, increase endurance, or something else?',
        tips: []
      };
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get response
    const response = getResponse(input);
    const assistantMessage = {
      id: messages.length + 2,
      role: 'assistant',
      content: response.content,
      metadata: { tips: response.tips },
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="space-y-4 h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900">AI Fitness Coach</h1>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2E86AB] to-[#A23B72] flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Quick questions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q.value)}
                className="p-3 text-left text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="bg-white rounded-xl shadow-lg p-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about fitness..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[#2E86AB] text-white px-6 py-2 rounded-lg hover:bg-[#1f5f8a] transition-all disabled:opacity-50 flex items-center gap-2 font-semibold"
        >
          {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}