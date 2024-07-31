"use client";
import React from 'react'
import { useRouter } from 'next/navigation'

const dashboard = () => {
  const router = useRouter();

  const handleClick =()=>
  {
    router.push('/formcreation');
  }
  return (
    <div>
      <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        New form
      </button>
    </div>
  )
}

export default dashboard