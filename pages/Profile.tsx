import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User, Download, LogOut } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    height: '',
    current_weight: '',
    target_weight: '',
    daily_calorie_goal: '',
    daily_water_goal: '',
    fitness_level: 'beginner',
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || '',
        age: currentUser.age || '',
        height: currentUser.height || '',
        current_weight: currentUser.current_weight || '',
        target_weight: currentUser.target_weight || '',
        daily_calorie_goal: currentUser.daily_calorie_goal || 2500,
        daily_water_goal: currentUser.daily_water_goal || 8,
        fitness_level: currentUser.fitness_level || 'beginner',
      });
      if (currentUser.profile_picture_url) {
        setPreview(currentUser.profile_picture_url);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setPreview(reader.result);

        // Upload the file
        try {
          const uploaded = await base44.integrations.Core.UploadFile({ file });
          setFormData((prev) => ({
            ...prev,
            profile_picture_url: uploaded.file_url,
          }));
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await base44.auth.updateMe({
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        current_weight: formData.current_weight ? parseFloat(formData.current_weight) : null,
        target_weight: formData.target_weight ? parseFloat(formData.target_weight) : null,
        daily_calorie_goal: parseInt(formData.daily_calorie_goal),
        daily_water_goal: parseInt(formData.daily_water_goal),
        fitness_level: formData.fitness_level,
        profile_picture_url: preview,
      });

      setEditing(false);
      loadUser();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const dataToExport = {
      user: {
        name: formData.full_name,
        email: user?.email,
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
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-profile-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  if (!user) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

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
              <label className="absolute bottom-0 right-0 bg-[#2E86AB] text-white p-2 rounded-full cursor-pointer hover:bg-[#1f5f8a]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                📷
              </label>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{formData.full_name || 'User'}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-[#2E86AB] text-white font-semibold py-2 rounded-lg hover:bg-[#1f5f8a] transition-all"
          >
            Edit Profile
          </button>
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-[#2E86AB] text-white rounded-lg font-semibold hover:bg-[#1f5f8a] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
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
                <p className="text-lg font-semibold text-gray-900">{formData.age || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Height</p>
                <p className="text-lg font-semibold text-gray-900">{formData.height ? `${formData.height} cm` : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Weight</p>
                <p className="text-lg font-semibold text-gray-900">{formData.current_weight ? `${formData.current_weight} kg` : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Target Weight</p>
                <p className="text-lg font-semibold text-gray-900">{formData.target_weight ? `${formData.target_weight} kg` : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fitness Level</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{formData.fitness_level}</p>
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
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account</h3>
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Download size={20} /> Export Data
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 border-2 border-red-300 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}