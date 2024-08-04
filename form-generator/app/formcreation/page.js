"use client";
import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

const FormCreation = () => {
  const [formTitle, setFormTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user] = useAuthState(auth);

  const addQuestion = () => {
    setQuestions([...questions, { type: 'text', question: '', options: [] }]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push('');
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!user) {
      console.error("No user is signed in");
      setIsSubmitting(false);
      return;
    }
  
    const formData = {
      title: formTitle,
      questions: questions,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
  
    try {
      const docRef = await addDoc(collection(db, "forms"), formData);
      const formId = docRef.id;
      const formUrl = `${window.location.origin}/forms/${formId}`;
      console.log("Form created with URL: ", formUrl);
      // frontend mei daal denge yeh baad mei
      setFormTitle('');
      setQuestions([]);
    } catch (error) {
      console.error("Error creating form: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Form Title"
          className="w-full p-2 mb-4 border rounded text-black"
        />
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-4 p-4 border rounded text-black">
            <select
              value={question.type}
              onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
              className="p-2 mb-2 border rounded text-black"
            >
              <option value="text">Text</option>
              <option value="multiplechoice">Multiple Choice</option>
            </select>
            <input
              type="text"
              value={question.question}
              onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
              placeholder="Question"
              className="w-full p-2 mb-2 border rounded text-black"
            />
            {question.type === 'multiplechoice' && (
              <div>
                {question.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    className="w-full p-2 mb-2 border rounded text-black"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Add Option
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-green-500 text-white p-2 rounded mr-2"
        >
          Add Question
        </button>
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Form...' : 'Create Form'}
        </button>
      </form>
    </div>
  );
};

export default FormCreation;