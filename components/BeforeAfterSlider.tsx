import React, { useState } from 'react';

export default function BeforeAfterSlider({ beforeImage, afterImage }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  if (!beforeImage || !afterImage) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Before & After</h3>
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No comparison photos yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Before & After</h3>
      
      <div className="relative w-full overflow-hidden rounded-lg">
        <img src={afterImage} alt="After" className="w-full h-auto block" />
        
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
        </div>

        {/* Slider Handle */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-10"
        />

        {/* Visual Slider Line */}
        <div
          className="absolute inset-y-0 w-1 bg-white shadow-lg pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
            <div className="flex gap-1">
              <div className="w-0.5 h-4 bg-gray-400" />
              <div className="w-0.5 h-4 bg-gray-400" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
          After
        </div>
      </div>
    </div>
  );
}