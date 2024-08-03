"use client";
import React from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router= useRouter();
  const [user, setUser]= useAuthState(auth);
  const googleAuth= new GoogleAuthProvider();
  const handleLogin = async() => {
    const result = await signInWithPopup(auth, googleAuth);
  };
  useEffect(()=>{
    console.log(user)
  },[user])

  {user? router.push('/dashboard'): console.log("login required")}
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6 text-white">Sign in with Google</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;