"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useAuthState(auth);
  const [userForms, setUserForms] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserForms = async () => {
      const formsRef = collection(db, 'forms');
      const q = query(formsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const forms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserForms(forms);
    };

    fetchUserForms();
  }, [user, router]);

  const handleClick = () => {
    router.push('/formcreation');
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div>
      <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        New form
      </button>
      <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Sign out
      </button>

      <div>
        <h2 className="text-xl font-bold mt-4">Your Forms</h2>
        <ul>
          {userForms.map(form => (
            <li key={form.id}>
              <a href={`/forms/${form.id}`} className="text-blue-500 underline">
                {form.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
