// src/components/AdBanner.tsx
import React, { useState } from "react";

interface AdBannerProps {
  position: "left" | "right";
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ position, className }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`${className} hidden lg:block`}>
      <div className="relative w-full h-full bg-gray-100 rounded shadow-lg">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={`Close ${position} Ad`}
        >
          ✖
        </button>
        {/* Ad Content */}
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600 text-center">Ad Banner ({position})</p>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
