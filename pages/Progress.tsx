import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Upload } from 'lucide-react';
import WeightChart from '../components/WeightChart';
import MeasurementsTable from '../components/MeasurementsTable';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AchievementBadge from '../components/AchievementBadge';
import { subDays, format } from 'date-fns';

export default function Progress() {
  const [measurements, setMeasurements] = useState({});
  const [weightData, setWeightData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [formData, setFormData] = useState({
    chest: '',
    waist: '',
    arms: '',
  });
  const [photoData, setPhotoData] = useState({
    type: 'before',
    file: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await base44.auth.me();

      // Load measurements
      const meas = await base44.entities.ProgressMeasurement.filter(
        { created_by: user.email },
        '-created_date',
        1
      );

      if (meas.length > 0) {
        setMeasurements(meas[0]);
        setFormData({
          chest: meas[0].chest || '',
          waist: meas[0].waist || '',
          arms: meas[0].arms || '',
        });
      } else {
        setMeasurements({});
      }

      // Load weight data for last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30);
      const allMeasurements = await base44.entities.ProgressMeasurement.filter(
        { created_by: user.email },
        '-created_date',
        100
      );

      const weightChartData = allMeasurements
        .filter((m) => new Date(m.date) >= thirtyDaysAgo)
        .map((m) => ({
          date: format(new Date(m.date), 'MMM dd'),
          weight: m.weight,
        }))
        .reverse();

      setWeightData(weightChartData);

      // Load achievements
      const userAchievements = await base44.entities.Achievement.filter(
        { created_by: user.email },
        '-unlock_date',
        100
      );

      setAchievements(userAchievements);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const handleSaveMeasurements = async (e) => {
    e.preventDefault();

    try {
      if (measurements && measurements.id) {
        // Update existing
        await base44.entities.ProgressMeasurement.update(measurements.id, {
          chest: parseFloat(formData.chest) || null,
          waist: parseFloat(formData.waist) || null,
          arms: parseFloat(formData.arms) || null,
        });
      } else {
        // Create new
        await base44.entities.ProgressMeasurement.create({
          date: format(new Date(), 'yyyy-MM-dd'),
          chest: parseFloat(formData.chest) || null,
          waist: parseFloat(formData.waist) || null,
          arms: parseFloat(formData.arms) || null,
        });
      }

      setShowMeasurementForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving measurements:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();

    if (!photoData.file) return;

    try {
      const uploadedFile = await base44.integrations.Core.UploadFile({
        file: photoData.file,
      });

      if (measurements && measurements.id) {
        const updateData = {};
        updateData[`${photoData.type}_photo_url`] = uploadedFile.file_url;
        await base44.entities.ProgressMeasurement.update(measurements.id, updateData);
      } else {
        const newData = {
          date: format(new Date(), 'yyyy-MM-dd'),
        };
        newData[`${photoData.type}_photo_url`] = uploadedFile.file_url;
        await base44.entities.ProgressMeasurement.create(newData);
      }

      setShowPhotoUpload(false);
      setPhotoData({ type: 'before', file: null });
      loadData();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Progress</h1>

      {/* Weight Chart */}
      <WeightChart data={weightData} />

      {/* Before/After */}
      <BeforeAfterSlider
        beforeImage={measurements?.before_photo_url}
        afterImage={measurements?.after_photo_url}
      />

      {/* Measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeasurementsTable measurements={measurements} onEdit={() => setShowMeasurementForm(true)} />

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowMeasurementForm(true)}
              className="w-full flex items-center gap-2 bg-[#2E86AB] text-white px-4 py-3 rounded-lg hover:bg-[#1f5f8a] transition-all font-semibold"
            >
              <Plus size={20} /> Update Measurements
            </button>
            <button
              onClick={() => setShowPhotoUpload(true)}
              className="w-full flex items-center gap-2 bg-[#A23B72] text-white px-4 py-3 rounded-lg hover:bg-[#8b2f60] transition-all font-semibold"
            >
              <Upload size={20} /> Upload Progress Photo
            </button>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} isUnlocked={true} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Keep working! Your achievements will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Measurement Form Modal */}
      {showMeasurementForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Measurements</h3>
            <form onSubmit={handleSaveMeasurements} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Chest (cm)</label>
                <input
                  type="number"
                  value={formData.chest}
                  onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Waist (cm)</label>
                <input
                  type="number"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Arms (cm)</label>
                <input
                  type="number"
                  value={formData.arms}
                  onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                  step="0.1"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMeasurementForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#2E86AB] text-white rounded-lg font-semibold hover:bg-[#1f5f8a]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Progress Photo</h3>
            <form onSubmit={handlePhotoUpload} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Photo Type</label>
                <select
                  value={photoData.type}
                  onChange={(e) => setPhotoData({ ...photoData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="before">Before</option>
                  <option value="after">After</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoData({ ...photoData, file: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPhotoUpload(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#A23B72] text-white rounded-lg font-semibold hover:bg-[#8b2f60]"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}