import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dumbbell, Zap, Weight, Droplet } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, idx) => ({
    day,
    calories: 2000 + Math.random() * 600,
    progress: 65 + Math.random() * 20,
  }));
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    workouts: 0,
    calories: 0,
    weight: 0,
    water: 0,
  });
  const [activities, setActivities] = useState([]);
  const [weeklyData] = useState(generateWeeklyData());

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Load workouts for this week
        const today = new Date();
        const weekAgo = subDays(today, 7);
        const workouts = await base44.entities.Workout.filter(
          {
            created_by: currentUser.email,
          },
          '-created_date',
          100
        );

        // Load nutrition entries for today
        const todayStr = format(today, 'yyyy-MM-dd');
        const nutrition = await base44.entities.NutritionEntry.filter(
          {
            date: todayStr,
            created_by: currentUser.email,
          },
          '-created_date',
          100
        );

        // Load water intake for today
        const water = await base44.entities.WaterIntake.filter(
          {
            date: todayStr,
            created_by: currentUser.email,
          },
          'timestamp',
          100
        );

        // Calculate stats
        const totalCalories = nutrition.reduce((sum, entry) => sum + entry.calories, 0);
        const totalWater = water.reduce((sum, entry) => sum + entry.cups, 0);
        const workoutCount = workouts.filter(
          (w) => new Date(w.date) >= weekAgo
        ).length;

        setStats({
          workouts: workoutCount,
          calories: Math.round(totalCalories),
          weight: currentUser.current_weight || 0,
          water: totalWater,
        });

        // Generate activities
        const recentActivities = [
          ...workouts.slice(0, 3).map((w) => ({
            type: 'workout',
            title: `Completed Workout`,
            description: `${w.duration_minutes} minutes`,
            timestamp: w.created_date,
          })),
          ...nutrition.slice(0, 2).map((n) => ({
            type: 'nutrition',
            title: `Logged ${n.food_name}`,
            description: `${n.calories} calories`,
            timestamp: n.created_date,
          })),
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setActivities(recentActivities);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    };

    loadData();
  }, []);

  const quickActions = [
    { label: 'Start Workout', icon: Dumbbell, color: '#2E86AB' },
    { label: 'Log Meal', icon: Zap, color: '#4CAF50' },
    { label: 'Update Weight', icon: Weight, color: '#FF9800' },
    { label: 'Drink Water', icon: Droplet, color: '#64B5F6' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Dumbbell}
          title="This Week Workouts"
          value={stats.workouts}
          color="#2E86AB"
        />
        <StatCard
          icon={Zap}
          title="Today's Calories"
          value={stats.calories}
          unit="cal"
          color="#FF9800"
        />
        <StatCard
          icon={Weight}
          title="Current Weight"
          value={stats.weight}
          unit="kg"
          color="#A23B72"
        />
        <StatCard
          icon={Droplet}
          title="Water Intake"
          value={stats.water}
          unit="cups"
          color="#64B5F6"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-center"
              >
                <Icon size={28} style={{ color: action.color }} className="mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">{action.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Progress Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#FF9800"
                strokeWidth={2}
                dot={{ fill: '#FF9800', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}