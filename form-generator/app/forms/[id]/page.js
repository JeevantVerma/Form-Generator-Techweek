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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchForm = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const docRef = doc(db, "forms", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
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

  const calculateProgress = () => {
    const totalQuestions = form.questions.length;
    const answeredQuestions = Object.keys(responses).length;
    const newProgress = Math.round((answeredQuestions / totalQuestions) * 100);
    setProgress(newProgress);
  };

  const handleResponseChange = (questionIndex, value) => {
    setResponses(prev => {
      const newResponses = {...prev, [questionIndex]: value};
      setTimeout(calculateProgress, 0);
      return newResponses;
    });
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

  const renderQuestionText = (text) => {
    const regex = /@question-(\d+)/g;
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const questionNumber = parseInt(part);
        return (
          <a 
            key={i} 
            href={`#question-${questionNumber}`} 
            className="text-blue-500 hover:underline"
          >
            Question {questionNumber}
          </a>
        );
      }
      return part;
    });
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>;
  if (!form) return <div className="text-center text-2xl mt-10">Form not found</div>;

  const formStyle = {
    backgroundColor: form.backgroundColor || '#212121',
    fontFamily: form.fontFamily || 'Arial, sans-serif',
  };

  return (
    <div className="min-h-screen py-10" style={formStyle}>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{color: form.titleColor || '#333'}}>{form.title}</h1>
        <form onSubmit={handleSubmit}>
          {form.questions.map((question, index) => (
            <div key={index} id={`question-${index + 1}`} className="mb-6 p-4 rounded-lg" style={{borderColor: question.borderColor || '#e2e8f0', borderWidth: '2px'}}>
              <label className="block mb-2 text-lg font-semibold" style={{color: question.questionColor || '#4a5568'}}>
                {index + 1}. {renderQuestionText(question.question)}
              </label>
              {question.type === 'text' ? (
                <input
                  type="text"
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  style={{borderColor: question.inputBorderColor || '#cbd5e0'}}
                />
              ) : question.type === 'multiplechoice' ? (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="radio"
                        id={`${index}-${optionIndex}`}
                        name={`question-${index}`}
                        value={option}
                        onChange={(e) => handleResponseChange(index, e.target.value)}
                        className="mr-2 text-black"
                      />
                      <label htmlFor={`${index}-${optionIndex}`} className="text-gray-700">{option}</label>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <div className="text-center">
            <button 
              type="submit" 
              className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full">
        {progress}% Complete
      </div>
    </div>
  );
}
