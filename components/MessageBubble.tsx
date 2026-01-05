import React from 'react';

export default function MessageBubble({ message, isUser }) {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2E86AB] to-[#A23B72] flex items-center justify-center text-white text-xs font-bold">
          AI
        </div>
      )}
      
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-[#2E86AB] text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {message.metadata?.tips && (
          <ul className="mt-3 space-y-1 text-sm list-disc list-inside">
            {message.metadata.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}