import React from 'react';
import { Zap } from 'lucide-react';

export default function CalorieCounter({ consumed = 0, goal = 2500 }) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Daily Calories</h3>
      
      <div className="flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#2E86AB"
              strokeWidth="12"
              strokeDasharray={`${(percentage / 100) * 552.92} 552.92`}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">{consumed}</p>
              <p className="text-sm text-gray-600">/ {goal} cal</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Zap size={24} className="text-[#2E86AB] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{remaining}</p>
            <p className="text-xs text-gray-600">Remaining</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Zap size={24} className="text-[#FF9800] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</p>
            <p className="text-xs text-gray-600">Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}