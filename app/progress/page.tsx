'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weightData = [
  { date: 'Week 1', weight: 78 },
  { date: 'Week 2', weight: 77.5 },
  { date: 'Week 3', weight: 77 },
  { date: 'Week 4', weight: 76.5 },
  { date: 'Week 5', weight: 76 },
  { date: 'Week 6', weight: 75.5 },
];

export default function Progress() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#A23B72]">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Progress Tracking</h1>
            <p className="text-gray-600">Monitor your fitness journey</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={24} className="text-[#A23B72]" />
                <h3 className="text-lg font-semibold">Weight Loss</h3>
              </div>
              <p className="text-3xl font-bold text-[#A23B72]">-2.5 kg</p>
              <p className="text-sm text-gray-500 mt-1">in 6 weeks</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar size={24} className="text-[#2E86AB]" />
                <h3 className="text-lg font-semibold">Workout Streak</h3>
              </div>
              <p className="text-3xl font-bold text-[#2E86AB]">14 days</p>
              <p className="text-sm text-gray-500 mt-1">Keep it up!</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award size={24} className="text-[#FF9800]" />
                <h3 className="text-lg font-semibold">Total Workouts</h3>
              </div>
              <p className="text-3xl font-bold text-[#FF9800]">42</p>
              <p className="text-sm text-gray-500 mt-1">this month</p>
            </div>
          </div>

          {/* Weight Progress Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Weight Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[74, 79]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#A23B72"
                  strokeWidth={3}
                  dot={{ fill: '#A23B72', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Award size={32} className="text-[#FF9800]" />
                <div>
                  <h3 className="font-semibold">First Week Complete!</h3>
                  <p className="text-sm text-gray-500">Completed 7 workouts</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Award size={32} className="text-[#2E86AB]" />
                <div>
                  <h3 className="font-semibold">Weight Loss Champion</h3>
                  <p className="text-sm text-gray-500">Lost 2.5kg in 6 weeks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
