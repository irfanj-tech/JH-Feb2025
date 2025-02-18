// src/components/Login.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import config from "config";
import { PATH } from "consts";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    // try{
    //     await signInWithEmailAndPassword(auth, email, password)
    //     auth.currentUser?.emailVerified ? toast.success("LoggedIn successfully") : toast.error("Please verify email")
    //     setTimeout(()=>{
    //         auth.currentUser?.emailVerified && navigate("/")
    //     },1000)
    // }
    // catch(err:any){
    //     console.error(err);
    //     let errorMessage = "An error occurred. Please try again.";
    //     if (err.code === "auth/invalid-credential") {
    //         errorMessage = "Invalid email or password.";
    //     } else if (err.code === "auth/wrong-password") {
    //         errorMessage = "Invalid email or password.";
    //     } else if (err.code === "auth/too-many-requests") {
    //         errorMessage = "Too many unsuccessful login attempts. Please try again later.";
    //     }
    //     toast.error(errorMessage);
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <img
          src={config.logo.src}
          alt={config.logo.alt}
          className="w-28 h-14 mx-auto"
        />
        <h2 className="text-2xl font-bold mt-4 text-center">
          Log in to {config.siteName}
        </h2>
        <p className="mt-2 text-center">
          Don't have an account?{" "}
          <Link to={PATH.SIGNUP} className="text-blue-600 hover:underline">
            Sign up
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
            onClick={login}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
