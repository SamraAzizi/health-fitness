import React, { useState } from 'react';
import { X, Clock, Repeat2, Weight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

export default function WorkoutModal({ exercise, onClose, onSave }) {
  const [formData, setFormData] = useState({
    sets: 3,
    reps: 10,
    weight: 0,
    duration_minutes: 15,
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'notes' ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Calculate estimated calories based on exercise and duration
      const caloriesBurned = formData.duration_minutes * 5 + formData.weight * 0.5;

      await base44.entities.Workout.create({
        date: format(new Date(), 'yyyy-MM-dd'),
        exercise_id: exercise.id,
        sets: formData.sets,
        reps: formData.reps,
        weight: formData.weight,
        duration_minutes: formData.duration_minutes,
        calories_burned: Math.round(caloriesBurned),
        notes: formData.notes,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Log Workout</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="font-semibold text-gray-900 mb-2">{exercise.name}</p>
            <p className="text-sm text-gray-600">{exercise.category}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Repeat2 size={16} /> Sets
            </label>
            <input
              type="number"
              name="sets"
              value={formData.sets}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Repeat2 size={16} /> Reps
            </label>
            <input
              type="number"
              name="reps"
              value={formData.reps}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Weight size={16} /> Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0"
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock size={16} /> Duration (minutes)
            </label>
            <input
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="How did it feel?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#2E86AB] text-white rounded-lg font-semibold hover:bg-[#1f5f8a]"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}