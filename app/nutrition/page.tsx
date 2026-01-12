'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Utensils, Plus, Search } from 'lucide-react';

export default function Nutrition() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [meals, setMeals] = useState<any[]>([]);

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
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF9800]">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Nutrition Tracker</h1>
                <p className="text-gray-600">Track your meals and calories</p>
              </div>
              <button className="bg-[#FF9800] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#F57C00] transition-all">
                <Plus size={20} />
                Add Meal
              </button>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm text-gray-600 mb-1">Calories</h3>
              <p className="text-3xl font-bold text-[#FF9800]">1,850</p>
              <p className="text-xs text-gray-500 mt-1">of 2,500 goal</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm text-gray-600 mb-1">Protein</h3>
              <p className="text-3xl font-bold text-[#2E86AB]">120g</p>
              <p className="text-xs text-gray-500 mt-1">of 150g goal</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm text-gray-600 mb-1">Carbs</h3>
              <p className="text-3xl font-bold text-[#A23B72]">180g</p>
              <p className="text-xs text-gray-500 mt-1">of 250g goal</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm text-gray-600 mb-1">Fats</h3>
              <p className="text-3xl font-bold text-[#64B5F6]">50g</p>
              <p className="text-xs text-gray-500 mt-1">of 70g goal</p>
            </div>
          </div>

          {/* Meals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Meals</h2>
            <div className="space-y-4">
              {meals.length === 0 ? (
                <div className="text-center py-12">
                  <Utensils size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No meals logged yet</p>
                  <button className="mt-4 bg-[#FF9800] text-white px-6 py-2 rounded-lg hover:bg-[#F57C00] transition-all">
                    Log Your First Meal
                  </button>
                </div>
              ) : (
                meals.map((meal, idx) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-lg p-4">
                    <p className="font-semibold">{meal.name}</p>
                    <p className="text-sm text-gray-500">{meal.calories} calories</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
