// src/components/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";
import { PATH } from "consts";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-xl mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to={PATH.INDEX}>
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
          Return to Home Page
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
