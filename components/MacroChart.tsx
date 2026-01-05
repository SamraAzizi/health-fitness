import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

export default function MacroChart({ carbs = 50, protein = 30, fat = 20 }) {
  const data = [
    { name: 'Carbs', value: carbs },
    { name: 'Protein', value: protein },
    { name: 'Fat', value: fat },
  ];

  const COLORS = ['#FF9800', '#4CAF50', '#2E86AB'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Macronutrients</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.map((item, idx) => (
          <div key={item.name} className="text-center p-3 bg-gray-50 rounded-lg">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-2"
              style={{ backgroundColor: COLORS[idx] }}
            />
            <p className="text-sm text-gray-600">{item.name}</p>
            <p className="text-xl font-bold text-gray-900">{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}