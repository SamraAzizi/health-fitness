import React from 'react';
import { Trophy } from 'lucide-react';

export default function AchievementBadge({ achievement, isUnlocked = false }) {
  return (
    <div
      className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all ${
        isUnlocked
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg'
          : 'bg-gray-100 border-gray-300 opacity-50'
      }`}
    >
      <div
        className={`text-4xl mb-3 ${isUnlocked ? 'scale-110' : ''}`}
      >
        {achievement.icon || '🏆'}
      </div>
      <h4 className="font-bold text-gray-900 text-center">{achievement.title}</h4>
      <p className="text-xs text-gray-600 text-center mt-2">{achievement.description}</p>
      {isUnlocked && achievement.unlock_date && (
        <p className="text-xs text-gray-500 mt-2">
          Unlocked {new Date(achievement.unlock_date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}