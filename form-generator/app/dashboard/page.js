"use client";
import React from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect } from 'react';

const dashboard = () => {
  const router = useRouter();
  const [user, setUser]= useAuthState(auth);
  const handleClick =()=>
  {
    router.push('/formcreation');
  }
  const handleSignOut =()=>
  {
    auth.signOut();
  }

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div>
      <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        New form
      </button>
      <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Sign out
      </button>
    </div>
  )
}

export default dashboard