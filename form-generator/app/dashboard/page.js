"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useAuthState(auth);
  const [userForms, setUserForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserForms = async () => {
      try {
        const formsRef = collection(db, 'forms');
        const q = query(formsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const forms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserForms(forms);
        setFilteredForms(forms);
      } catch (err) {
        setError('Failed to fetch forms.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserForms();
  }, [user, router]);

  useEffect(() => {
    const results = userForms.filter(form =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForms(results);
  }, [searchTerm, userForms]);

  const handleClick = () => {
    router.push('/formcreation');
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  const handleDelete = async (formId) => {
    try {
      await deleteDoc(doc(db, 'forms', formId));
      setUserForms(userForms.filter(form => form.id !== formId));
    } catch (err) {
      setError('Failed to delete form.');
    }
  };

  const handleEdit = (formId) => {
    router.push(`/formedit/${formId}`);
  };

  const handleAnalytics = (formId) => {
    router.push(`/formanalytics/${formId}`);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 p-4 border rounded">
        <div className="flex items-center mb-4">
          <img 
            src={user?.photoURL || '/default-profile.png'} 
            alt="User Profile" 
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">{user?.displayName || 'User'}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleClick} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
        >
          New Form
        </button>
        <button 
          onClick={handleSignOut} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search Forms..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded text-black"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Your Forms</h2>
        <ul className="list-disc pl-5">
          {filteredForms.length === 0 ? (
            <li>No forms found.</li>
          ) : (
            filteredForms.map(form => (
              <li key={form.id} className="mb-2">
                <div className="flex justify-between items-center p-2 border rounded">
                  <a 
                    href={`/forms/${form.id}`} 
                    className="text-blue-500 hover:underline"
                  >
                    {form.title}
                  </a>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(form.id)} 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(form.id)} 
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => handleAnalytics(form.id)} 
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                    >
                      Analytics
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
