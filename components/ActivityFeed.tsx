import React from 'react';
import { Dumbbell, Apple, Zap, Droplet } from 'lucide-react';
import { format } from 'date-fns';

const ACTIVITY_ICONS = {
  workout: Dumbbell,
  nutrition: Apple,
  calorie: Zap,
  water: Droplet,
};

const ACTIVITY_COLORS = {
  workout: '#2E86AB',
  nutrition: '#4CAF50',
  calorie: '#FF9800',
  water: '#64B5F6',
};

export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, idx) => {
            const Icon = ACTIVITY_ICONS[activity.type];
            const color = ACTIVITY_COLORS[activity.type];
            return (
              <div key={idx} className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-6">No recent activity</p>
        )}
      </div>
    </div>
  );
}