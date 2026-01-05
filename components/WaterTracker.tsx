import React from 'react';
import { Droplet, Plus } from 'lucide-react';

export default function WaterTracker({ cups = 0, goal = 8, onAddCup }) {
  const cups_array = Array.from({ length: goal }, (_, i) => i < cups);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Water Intake</h3>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {cups_array.map((filled, idx) => (
          <button
            key={idx}
            onClick={() => onAddCup && onAddCup(idx + 1)}
            className={`w-16 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              filled
                ? 'bg-gradient-to-br from-[#64B5F6] to-[#2E86AB] text-white shadow-lg'
                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
            }`}
          >
            <Droplet size={28} fill={filled ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold text-gray-900">{cups}/{goal}</p>
        <p className="text-gray-600 text-sm mt-1">cups today</p>
      </div>

      <button
        onClick={() => onAddCup && onAddCup(cups + 1)}
        disabled={cups >= goal}
        className="w-full mt-4 bg-[#64B5F6] text-white font-semibold py-2 rounded-lg hover:bg-[#42a5f5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Add Cup
      </button>
    </div>
  );
}