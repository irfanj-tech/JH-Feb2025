// src/components/Signup.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import config from "config";
import { PATH } from "consts";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    // Implement signup logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <img
          src={config.logo.src}
          alt={config.logo.alt}
          className="w-28 h-14 mx-auto"
        />
        <h1 className="text-2xl font-bold mt-4 text-center">
          Create your {config.siteName} account
        </h1>
        <p className="mt-2 text-center">
          Already have an account?{" "}
          <Link to={PATH.LOGIN} className="text-blue-600 hover:underline">
            Sign in
          </Link>
          .
        </p>
        <form className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={signup}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
