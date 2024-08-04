'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function FormAnalytics() {
  const params = useParams();
  const { id } = params;
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormAndResponses = async () => {
      if (id) {
        try {
          const formRef = doc(db, "forms", id);
          const formSnap = await getDoc(formRef);
          
          if (formSnap.exists()) {
            setForm(formSnap.data());
            
            const responsesRef = collection(db, "responses");
            const q = query(responsesRef, where("formId", "==", id));
            const querySnapshot = await getDocs(q);
            
            const responseData = querySnapshot.docs.map(doc => doc.data());
            setResponses(responseData);
          } else {
            setError("Form not found");
          }
        } catch (err) {
          setError("Failed to fetch data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFormAndResponses();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>;
  if (error) return <div className="text-center text-red-500 text-2xl mt-10">Error: {error}</div>;
  if (!form) return <div className="text-center text-2xl mt-10">No form data</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-700 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">{form.title} - Analytics</h1>
      <div className="bg-slate-900 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-lg">Total Responses: <span className="font-bold text-blue-500">{responses.length}</span></p>
      </div>
      {form.questions.map((question, index) => (
        <div key={index} className="bg-slate-900 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{question.question}</h2>
          {question.type === 'multiplechoice' ? (
            <div>
              <ul className="mt-4">
                {question.options.map((option, optionIndex) => {
                  const count = responses.filter(r => r.responses[index] === option).length;
                  const percentage = Math.round((count / responses.length) * 100) || 0;
                  return (
                    <li key={optionIndex} className="flex justify-between items-center py-2 border-b">
                      <span>{option}</span>
                      <span className="font-semibold">{count} ({percentage}%)</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : question.type === 'file' ? (
            <div>
              <p className="text-lg mb-2">File uploads: {responses.filter(r => r.responses[index]).length}</p>
              <ul className="list-disc pl-5">
                {responses.filter(r => r.responses[index]).map((response, responseIndex) => (
                  <li key={responseIndex}>
                    <a href={response.responses[index]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      File {responseIndex + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-2">Text responses: {responses.filter(r => r.responses[index]).length}</p>
              <ul className="list-disc pl-5">
                {responses.filter(r => r.responses[index]).map((response, responseIndex) => (
                  <li key={responseIndex}>{response.responses[index]}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}