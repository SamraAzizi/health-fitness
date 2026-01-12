"use client";

import React, { useState, useEffect } from "react";
import { User, Download, LogOut, Camera, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserType {
  email: string;
  full_name: string;
}

interface FormDataType {
  full_name: string;
  age: string;
  height: string;
  current_weight: string;
  target_weight: string;
  daily_calorie_goal: string;
  daily_water_goal: string;
  fitness_level: string;
  profile_picture_url?: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    full_name: "Demo User",
    age: "25",
    height: "175",
    current_weight: "70",
    target_weight: "65",
    daily_calorie_goal: "2500",
    daily_water_goal: "8",
    fitness_level: "beginner",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("userProfile");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          setPreview(parsedData.profile_picture_url || null);
          
          setUser({
            email: "demo@example.com",
            full_name: parsedData.full_name || "Demo User",
          });
          return;
        } catch (error) {
          console.error("Error parsing saved profile data:", error);
        }
      }
    }
    
    setUser({
      email: "demo@example.com",
      full_name: formData.full_name,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          profile_picture_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("userProfile", JSON.stringify(formData));
        // Also save to a global state or context if you have one
        localStorage.setItem("profileUpdated", "true");
      }
      
      setEditing(false);
      setSaving(false);
      
      // Show success message and redirect after a short delay
      alert("Profile saved successfully! Redirecting to dashboard...");
      
      // Redirect to dashboard/home after 1.5 seconds
      setTimeout(() => {
        router.push("/dashboard"); // or router.push("/") for home
      }, 1500);
    }, 1000);
  };

  const handleExport = () => {
    const dataToExport = {
      user: {
        name: formData.full_name,
        email: user?.email || "demo@example.com",
        age: formData.age,
        height: formData.height,
        currentWeight: formData.current_weight,
        targetWeight: formData.target_weight,
        fitnessLevel: formData.fitness_level,
      },
      goals: {
        dailyCalories: formData.daily_calorie_goal,
        dailyWater: formData.daily_water_goal,
      },
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fitness-profile-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userProfile");
      localStorage.removeItem("profileUpdated");
    }
    router.push("/");
  };

  const goBackToDashboard = () => {
    router.push("/dashboard"); // or router.push("/")
  };

  if (!user) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={goBackToDashboard}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-[#2E86AB] overflow-hidden bg-gray-200 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-400" />
              )}
            </div>
            {editing && (
              <label className="absolute bottom-0 right-0 bg-[#2E86AB] text-white p-2 rounded-full cursor-pointer hover:bg-[#1f5f8a] transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Camera size={20} />
              </label>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{formData.full_name || "User"}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {!editing ? (
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 bg-[#2E86AB] text-white font-semibold py-3 rounded-lg hover:bg-[#1f5f8a] transition-all"
            >
              Edit Profile
            </button>
            <button
              onClick={goBackToDashboard}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-3">Editing mode enabled</p>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel Editing
            </button>
          </div>
        )}
      </div>

      {/* Personal Info & Goals */}
      {editing ? (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Weight (kg)</label>
                <input
                  type="number"
                  name="current_weight"
                  value={formData.current_weight}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Target Weight (kg)</label>
                <input
                  type="number"
                  name="target_weight"
                  value={formData.target_weight}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Fitness Level</label>
              <select
                name="fitness_level"
                value={formData.fitness_level}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-6 pt-6 border-t">Daily Goals</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Daily Calorie Goal
                </label>
                <input
                  type="number"
                  name="daily_calorie_goal"
                  value={formData.daily_calorie_goal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Daily Water Goal (cups)
                </label>
                <input
                  type="number"
                  name="daily_water_goal"
                  value={formData.daily_water_goal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  loadUser();
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-3 bg-[#2E86AB] text-white rounded-lg font-semibold hover:bg-[#1f5f8a] disabled:opacity-50 transition-all"
              >
                {saving ? "Saving..." : "Save & Go to Dashboard"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-lg font-semibold text-gray-900">{formData.age || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Height</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formData.height ? `${formData.height} cm` : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Weight</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formData.current_weight ? `${formData.current_weight} kg` : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Target Weight</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formData.target_weight ? `${formData.target_weight} kg` : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fitness Level</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {formData.fitness_level}
                </p>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Goals</h3>
            <div className="space-y-3">
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Calorie Goal</p>
                <p className="text-2xl font-bold text-[#FF9800]">{formData.daily_calorie_goal}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Water Goal</p>
                <p className="text-2xl font-bold text-[#2E86AB]">{formData.daily_water_goal} cups</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Download size={20} /> Export Profile Data
          </button>
          <button
            onClick={goBackToDashboard}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-[#2E86AB] rounded-lg font-semibold text-[#2E86AB] hover:bg-blue-50 transition-all"
          >
            <ArrowLeft size={20} /> Return to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-red-300 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          Saving profile...
        </div>
      )}
    </div>
  );
}