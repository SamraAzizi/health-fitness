import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2 } from 'lucide-react';
import CalorieCounter from '../components/CalorieCounter';
import MacroChart from '../components/MacroChart';
import WaterTracker from '../components/WaterTracker';
import { format } from 'date-fns';

const MEAL_TIMES = ['breakfast', 'lunch', 'dinner', 'snacks'];

const COMMON_FOODS = [
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
  { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50 },
  { name: 'Egg', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
];

export default function Nutrition() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [water, setWater] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    meal_type: 'breakfast',
    food_name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    quantity: '1 portion',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const today = format(new Date(), 'yyyy-MM-dd');

      const nutrition = await base44.entities.NutritionEntry.filter(
        { date: today, created_by: currentUser.email },
        '-created_date',
        100
      );

      const waterIntake = await base44.entities.WaterIntake.filter(
        { date: today, created_by: currentUser.email },
        'timestamp',
        100
      );

      setEntries(nutrition);
      setWater(waterIntake);
    } catch (error) {
      console.error('Error loading nutrition data:', error);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    try {
      await base44.entities.NutritionEntry.create({
        date: format(new Date(), 'yyyy-MM-dd'),
        meal_type: formData.meal_type,
        food_name: formData.food_name,
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fat: formData.fat,
        quantity: formData.quantity,
      });

      setFormData({
        meal_type: 'breakfast',
        food_name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        quantity: '1 portion',
      });
      setShowAddForm(false);
      loadData();
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const handleSelectFood = (food) => {
    setFormData({
      ...formData,
      food_name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    });
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await base44.entities.NutritionEntry.delete(entryId);
      loadData();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleAddWater = async (cups) => {
    try {
      const totalWater = water.reduce((sum, w) => sum + w.cups, 0);
      if (totalWater < (user?.daily_water_goal || 8)) {
        await base44.entities.WaterIntake.create({
          date: format(new Date(), 'yyyy-MM-dd'),
          cups: cups - (totalWater || 0),
          timestamp: new Date().toISOString(),
        });
        loadData();
      }
    } catch (error) {
      console.error('Error adding water:', error);
    }
  };

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
  const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0);
  const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0);
  const totalFat = entries.reduce((sum, e) => sum + e.fat, 0);
  const totalWater = water.reduce((sum, w) => sum + w.cups, 0);

  const carbsPercent = Math.round((totalCarbs * 4) / (totalCalories || 1) * 100);
  const proteinPercent = Math.round((totalProtein * 4) / (totalCalories || 1) * 100);
  const fatPercent = Math.round((totalFat * 9) / (totalCalories || 1) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Nutrition</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg hover:bg-[#1f5f8a] transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add Food
        </button>
      </div>

      {/* Add Food Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleAddFood} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Meal Time</label>
                <select
                  value={formData.meal_type}
                  onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {MEAL_TIMES.map((time) => (
                    <option key={time} value={time}>
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Food Name</label>
                <input
                  type="text"
                  value={formData.food_name}
                  onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
                  placeholder="Enter food name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Calories</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Quantity</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Protein (g)</label>
                <input
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Carbs (g)</label>
                <input
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Fat (g)</label>
                <input
                  type="number"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Quick Add Foods:</p>
              <div className="flex gap-2 flex-wrap">
                {COMMON_FOODS.map((food) => (
                  <button
                    key={food.name}
                    type="button"
                    onClick={() => handleSelectFood(food)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-all"
                  >
                    {food.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#2E86AB] text-white font-semibold py-2 rounded-lg hover:bg-[#1f5f8a]"
              >
                Save Food
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Calorie Counter & Macros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalorieCounter consumed={totalCalories} goal={user?.daily_calorie_goal || 2500} />
        <MacroChart carbs={carbsPercent} protein={proteinPercent} fat={fatPercent} />
      </div>

      {/* Water Tracker */}
      <WaterTracker cups={totalWater} goal={user?.daily_water_goal || 8} onAddCup={handleAddWater} />

      {/* Food Diary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Food Diary</h3>

        {MEAL_TIMES.map((mealType) => {
          const mealEntries = entries.filter((e) => e.meal_type === mealType);
          const mealCalories = mealEntries.reduce((sum, e) => sum + e.calories, 0);

          return (
            <div key={mealType} className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg capitalize">{mealType}</h4>
              {mealEntries.length > 0 ? (
                <div className="space-y-2">
                  {mealEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{entry.food_name}</p>
                        <p className="text-xs text-gray-600">{entry.quantity}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-semibold text-gray-900">{Math.round(entry.calories)} cal</p>
                        <p className="text-xs text-gray-600">P: {entry.protein}g C: {entry.carbs}g F: {entry.fat}g</p>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-800 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <div className="text-right pt-2 border-t border-gray-300">
                    <p className="font-semibold text-gray-900">{Math.round(mealCalories)} calories</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No entries for {mealType}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}