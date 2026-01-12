"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Zap, Weight, Droplet, Utensils, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import ActivityFeed from "@/components/ActivityFeed";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const generateWeeklyData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, idx) => ({
    day,
    calories: 2000 + Math.random() * 600,
    progress: 65 + Math.random() * 20,
  }));
};

const quickActions = [
  { label: "Start Workout", icon: Dumbbell, color: "#2E86AB", path: "/workouts" },
  { label: "Log Meal", icon: Zap, color: "#4CAF50", path: "/nutrition" },
  { label: "Update Weight", icon: Weight, color: "#FF9800", path: "/progress" },
  { label: "Drink Water", icon: Droplet, color: "#64B5F6", path: "/nutrition" },
];

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    workouts: 0,
    calories: 0,
    weight: 0,
    water: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [weeklyData] = useState(generateWeeklyData());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const loadData = async () => {
      try {
        // Load user stats from localStorage
        const userStats = localStorage.getItem(`healthTracker_stats_${user?.email}`);
        if (userStats) {
          setStats(JSON.parse(userStats));
        } else {
          // Set default stats
          setStats({
            workouts: 3,
            calories: 1850,
            weight: user?.currentWeight || 75,
            water: 6,
          });
        }

        // Load activities from localStorage
        const userActivities = localStorage.getItem(`healthTracker_activities_${user?.email}`);
        if (userActivities) {
          setActivities(JSON.parse(userActivities));
        } else {
          // Set sample activities
          setActivities([
            {
              type: "workout",
              title: "Completed Full Body Workout",
              description: "45 minutes • Strength Training",
              timestamp: new Date().toISOString(),
            },
            {
              type: "nutrition",
              title: "Logged Breakfast",
              description: "450 calories • Oatmeal with fruits",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              type: "water",
              title: "Added Water Intake",
              description: "2 cups • Total: 6 cups today",
              timestamp: new Date(Date.now() - 7200000).toISOString(),
            },
            {
              type: "progress",
              title: "Weight Updated",
              description: "75 kg • Maintained from last week",
              timestamp: new Date(Date.now() - 86400000).toISOString(),
            },
          ]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user, router]);

  // Function to update stats when quick actions are used
  const updateStat = (statType: string, value: number) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        [statType]: value
      };
      // Save to localStorage
      if (user?.email) {
        localStorage.setItem(`healthTracker_stats_${user.email}`, JSON.stringify(newStats));
      }
      return newStats;
    });
  };

  // Function to add new activity
  const addActivity = (newActivity: any) => {
    setActivities(prev => {
      const updatedActivities = [newActivity, ...prev].slice(0, 10); // Keep only 10 most recent
      if (user?.email) {
        localStorage.setItem(`healthTracker_activities_${user.email}`, JSON.stringify(updatedActivities));
      }
      return updatedActivities;
    });
  };

  const handleQuickAction = (action: string) => {
    const now = new Date().toISOString();
    
    switch(action) {
      case "Start Workout":
        updateStat("workouts", stats.workouts + 1);
        addActivity({
          type: "workout",
          title: "Started New Workout",
          description: "Session in progress...",
          timestamp: now,
        });
        break;
        
      case "Log Meal":
        const newCalories = stats.calories + 300;
        updateStat("calories", newCalories);
        addActivity({
          type: "nutrition",
          title: "Logged Meal",
          description: "300 calories added",
          timestamp: now,
        });
        break;
        
      case "Update Weight":
        const newWeight = stats.weight + 0.5;
        updateStat("weight", newWeight);
        addActivity({
          type: "progress",
          title: "Weight Updated",
          description: `New weight: ${newWeight} kg`,
          timestamp: now,
        });
        break;
        
      case "Drink Water":
        const newWater = stats.water + 1;
        updateStat("water", newWater);
        addActivity({
          type: "water",
          title: "Drank Water",
          description: `Total: ${newWater} cups today`,
          timestamp: now,
        });
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell size={48} className="mx-auto mb-4 text-[#2E86AB] animate-bounce" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#2E86AB]">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ""}!
          </h1>
          <p className="text-gray-600">
            Here is your fitness journey overview for today
          </p>
        </div>

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
                  onClick={() => handleQuickAction(action.label)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-center block w-full"
                >
                  <Icon size={28} style={{ color: action.color }} className="mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">{action.label}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <Link 
              href="/dashboard" 
              className="text-sm text-[#2E86AB] hover:text-[#1C5D7A] font-medium"
            >
              View all features →
            </Link>
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
                  dot={{ fill: "#FF9800", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <ActivityFeed activities={activities} />
        </div>
      </div>
    </>
  );
}