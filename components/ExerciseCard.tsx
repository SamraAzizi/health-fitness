import React from 'react';
import { Zap, Package } from 'lucide-react';

export default function ExerciseCard({ exercise, onSelect }) {
  return (
    <div
      onClick={() => onSelect(exercise)}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
    >
      <img
        src={exercise.image_url || 'https://via.placeholder.com/300x200?text=Exercise'}
        alt={exercise.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h4 className="font-bold text-gray-900 text-lg">{exercise.name}</h4>
        <p className="text-sm text-gray-600 mb-3">{exercise.category}</p>
        <div className="flex gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            <Zap size={12} /> {exercise.muscle_group}
          </span>
          <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
            <Package size={12} /> {exercise.equipment || 'Bodyweight'}
          </span>
        </div>
      </div>
    </div>
  );
}