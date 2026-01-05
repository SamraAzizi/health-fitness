import React from 'react';

export default function StatCard({ icon: Icon, title, value, unit, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={32} style={{ color }} />
        </div>
      </div>
    </div>
  );
}