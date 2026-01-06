import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Search, Filter } from 'lucide-react';
import ExerciseCard from '../components/ExerciseCard';
import WorkoutModal from '../components/WorkoutModal';

const SAMPLE_EXERCISES = [
  {
    id: '1',
    name: 'Push Ups',
    category: 'Chest',
    muscle_group: 'Chest',
    equipment: 'Bodyweight',
    image_url: 'https://via.placeholder.com/300x200?text=Push+Ups',
  },
  {
    id: '2',
    name: 'Squats',
    category: 'Legs',
    muscle_group: 'Quadriceps',
    equipment: 'Bodyweight',
    image_url: 'https://via.placeholder.com/300x200?text=Squats',
  },
  {
    id: '3',
    name: 'Bench Press',
    category: 'Chest',
    muscle_group: 'Chest',
    equipment: 'Barbell',
    image_url: 'https://via.placeholder.com/300x200?text=Bench+Press',
  },
  {
    id: '4',
    name: 'Deadlifts',
    category: 'Back',
    muscle_group: 'Back',
    equipment: 'Barbell',
    image_url: 'https://via.placeholder.com/300x200?text=Deadlifts',
  },
  {
    id: '5',
    name: 'Dumbbell Curls',
    category: 'Arms',
    muscle_group: 'Biceps',
    equipment: 'Dumbbells',
    image_url: 'https://via.placeholder.com/300x200?text=Dumbbell+Curls',
  },
  {
    id: '6',
    name: 'Pull Ups',
    category: 'Back',
    muscle_group: 'Back',
    equipment: 'Pull Up Bar',
    image_url: 'https://via.placeholder.com/300x200?text=Pull+Ups',
  },
  {
    id: '7',
    name: 'Shoulder Press',
    category: 'Shoulders',
    muscle_group: 'Shoulders',
    equipment: 'Dumbbells',
    image_url: 'https://via.placeholder.com/300x200?text=Shoulder+Press',
  },
  {
    id: '8',
    name: 'Running',
    category: 'Cardio',
    muscle_group: 'Full Body',
    equipment: 'None',
    image_url: 'https://via.placeholder.com/300x200?text=Running',
  },
];

export default function Workouts() {
  const [exercises, setExercises] = useState(SAMPLE_EXERCISES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const user = await base44.auth.me();
      const userWorkouts = await base44.entities.Workout.filter(
        { created_by: user.email },
        '-created_date',
        100
      );
      setWorkouts(userWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const categories = ['All', ...new Set(SAMPLE_EXERCISES.map((e) => e.category))];

  const filteredExercises = exercises.filter((ex) => {
    const matchCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };

  const handleSaveWorkout = () => {
    loadWorkouts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2E86AB] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onSelect={handleSelectExercise}
          />
        ))}
      </div>

      {/* Recent Workouts */}
      {workouts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Workouts</h3>
          <div className="space-y-3">
            {workouts.slice(0, 5).map((workout, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">Workout</p>
                  <p className="text-sm text-gray-600">{workout.duration_minutes} minutes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#2E86AB]">{Math.round(workout.calories_burned)} cal</p>
                  <p className="text-sm text-gray-600">{new Date(workout.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout Modal */}
      {showModal && selectedExercise && (
        <WorkoutModal
          exercise={selectedExercise}
          onClose={() => setShowModal(false)}
          onSave={handleSaveWorkout}
        />
      )}
    </div>
  );
}