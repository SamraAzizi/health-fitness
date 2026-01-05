import React from 'react';
import { Edit2, Plus } from 'lucide-react';

const MEASUREMENTS = [
  { label: 'Chest', key: 'chest', unit: 'cm' },
  { label: 'Waist', key: 'waist', unit: 'cm' },
  { label: 'Arms', key: 'arms', unit: 'cm' },
];

export default function MeasurementsTable({ measurements = {}, onEdit }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Body Measurements</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-[#2E86AB] text-white px-3 py-1 rounded-lg hover:bg-[#1f5f8a] transition-all text-sm"
        >
          <Edit2 size={16} /> Edit
        </button>
      </div>

      <div className="space-y-3">
        {MEASUREMENTS.map((m) => (
          <div key={m.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-900">{m.label}</p>
            <p className="text-2xl font-bold text-[#2E86AB]">
              {measurements[m.key] || '-'}
              <span className="text-sm text-gray-600 ml-1">{m.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}