// src/components/TopAd.tsx
import React, { useState } from "react";

const TopAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gray-200 text-center py-4">
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close Top Ad"
      >
        ✖
      </button>
      {/* Ad Content */}
      <p className="text-gray-600">Top Ad Banner</p>
    </div>
  );
};

export default TopAd;
