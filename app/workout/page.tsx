'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Dumbbell, Plus, Clock, Flame } from 'lucide-react';

const SAMPLE_EXERCISES = [
  { id: 1, name: 'Push Ups', category: 'Chest', sets: 3, reps: 15, duration: 5 },
  { id: 2, name: 'Squats', category: 'Legs', sets: 4, reps: 12, duration: 8 },
  { id: 3, name: 'Bench Press', category: 'Chest', sets: 4, reps: 10, duration: 10 },
  { id: 4, name: 'Deadlifts', category: 'Back', sets: 4, reps: 8, duration: 12 },
  { id: 5, name: 'Dumbbell Curls', category: 'Arms', sets: 3, reps: 12, duration: 6 },
  { id: 6, name: 'Pull Ups', category: 'Back', sets: 3, reps: 10, duration: 7 },
];

export default function Workout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<any[]>([]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#2E86AB]">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Workout Tracker</h1>
                <p className="text-gray-600">Log your exercises and track your progress</p>
              </div>
              <button className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#1f5f8a] transition-all">
                <Plus size={20} />
                New Workout
              </button>
            </div>
          </div>

          {/* Exercise Library */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exercise Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_EXERCISES.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#2E86AB] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{exercise.name}</h3>
                      <p className="text-sm text-gray-500">{exercise.category}</p>
                    </div>
                    <Dumbbell size={24} className="text-[#2E86AB]" />
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{exercise.duration} min</span>
                    </div>
                    <div>
                      <span>{exercise.sets} sets × {exercise.reps} reps</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-[#2E86AB] text-white py-2 rounded-lg hover:bg-[#1f5f8a] transition-all">
                    Add to Workout
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
