'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function FormPage() {
  const params = useParams();
  const { id } = params;
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      console.log("Fetching form with ID:", id);
      if (id) {
        setIsLoading(true);
        try {
          const docRef = doc(db, "forms", id);
          console.log("Document reference:", docRef);
          const docSnap = await getDoc(docRef);
          console.log("Document snapshot:", docSnap);
          if (docSnap.exists()) {
            console.log("Form data:", docSnap.data());
            setForm(docSnap.data());
          } else {
            console.log("No such form!");
          }
        } catch (error) {
          console.error("Error fetching form:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchForm();
  }, [id]);

  const handleResponseChange = (questionIndex, value) => {
    setResponses(prev => ({...prev, [questionIndex]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "responses"), {
        formId: id,
        responses: responses,
        submittedAt: new Date().toISOString()
      });
      console.log("Response submitted successfully");
    } catch (error) {
      console.error("Error submitting response: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!form) return <div>Form not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <form onSubmit={handleSubmit}>
        {form.questions.map((question, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2">{question.question}</label>
            {question.type === 'text' ? (
              <input
                type="text"
                onChange={(e) => handleResponseChange(index, e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
            ) : question.type === 'multiplechoice' ? (
              question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="radio"
                    id={`${index}-${optionIndex}`}
                    name={`question-${index}`}
                    value={option}
                    onChange={(e) => handleResponseChange(index, e.target.value)}
                  />
                  <label htmlFor={`${index}-${optionIndex}`}>{option}</label>
                </div>
              ))
            ) : null}
          </div>
        ))}
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}