// src/components/PopupAd.tsx
import React, { useState, useEffect, useRef } from "react";

interface PopupAdProps {
  position?: "bottomRight" | "topRight";
  initialDelay?: number;
  reopenDelay?: number;
}

const PopupAd: React.FC<PopupAdProps> = ({
  position = "bottomRight",
  initialDelay = 10000,
  reopenDelay = 30000,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => {
    setIsOpen(false);
    scheduleReopen();
  };
  const scheduleReopen = () => {
    timerRef.current = setTimeout(openPopup, reopenDelay);
  };

  useEffect(() => {
    timerRef.current = setTimeout(openPopup, initialDelay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [initialDelay, reopenDelay]);

  if (!isOpen) return null;

  const positionClasses =
    position === "topRight" ? "top-0 right-0" : "bottom-0 right-0";

  return (
    <div className={`fixed ${positionClasses} m-4 z-50 hidden md:block`}>
      <div className="bg-white p-4 rounded-md shadow-lg relative w-64">
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close Popup Ad"
        >
          ✖
        </button>
        {/* Ad content */}
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2">Popup Ad</h2>
          <p className="text-gray-600">This is a sample popup ad.</p>
        </div>
      </div>
    </div>
  );
};

export default PopupAd;
