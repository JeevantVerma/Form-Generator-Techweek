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
  const [backgroundColor, setBackgroundColor] = useState('#f0f4f8');
  const [titleColor, setTitleColor] = useState('#333');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');

  const addQuestion = () => {
    setQuestions([...questions, { 
      type: 'text', 
      question: '', 
      options: [],
      borderColor: '#e2e8f0',
      questionColor: '#4a5568',
      inputBorderColor: '#cbd5e0'
    }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    if (field === 'type' && value === 'text') {
      updatedQuestions[index].options = [];
    }
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push('');
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
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
      createdAt: new Date().toISOString(),
      backgroundColor,
      titleColor,
      fontFamily
    };
  
    try {
      const docRef = await addDoc(collection(db, "forms"), formData);
      const formId = docRef.id;
      const formUrl = `${window.location.origin}/forms/${formId}`;
      console.log("Form created with URL: ", formUrl);
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
        <div className="mb-4">
          <label className="block mb-2">Form Title</label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Form Title"
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Background Color</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="p-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Title Color</label>
          <input
            type="color"
            value={titleColor}
            onChange={(e) => setTitleColor(e.target.value)}
            className="p-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full p-2 border rounded text-black"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
          </select>
        </div>
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-4 p-4 border rounded text-black">
            <div className="flex justify-between mb-2">
              <select
                value={question.type}
                onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                className="p-2 border rounded text-black"
              >
                <option value="text">Text</option>
                <option value="multiplechoice">Multiple Choice</option>
                <option value="file">File Upload</option>
              </select>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove Question
              </button>
            </div>
            <input
              type="text"
              value={question.question}
              onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
              placeholder="Question"
              className="w-full p-2 mb-2 border rounded text-black"
            />
            <div className="mb-2">
              <label className="block mb-1 text-white">Border Color</label>
              <input
                type="color"
                value={question.borderColor}
                onChange={(e) => updateQuestion(qIndex, 'borderColor', e.target.value)}
                className="p-1 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-white">Question Color</label>
              <input
                type="color"
                value={question.questionColor}
                onChange={(e) => updateQuestion(qIndex, 'questionColor', e.target.value)}
                className="p-1 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-white">Input Border Color</label>
              <input
                type="color"
                value={question.inputBorderColor}
                onChange={(e) => updateQuestion(qIndex, 'inputBorderColor', e.target.value)}
                className="p-1 border rounded"
              />
            </div>
            {question.type === 'multiplechoice' && (
              <div>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateQuestion(qIndex, 'options', question.options.map((opt, i) => i === oIndex ? e.target.value : opt))}
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-grow p-2 border rounded text-black mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Remove
                    </button>
                  </div>
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
            {question.type === 'file' && (
              <div>
                <label className='text-white'>Max file size (in MB):</label>
                <input
                  type="number"
                  value={question.maxSize || 5}
                  onChange={(e) => handleQuestionChange(qIndex, 'maxSize', parseInt(e.target.value))}
                  className="w-full p-2 mb-2 border rounded text-black"
                />
                <label className='text-white'>Allowed file types (comma-separated):</label>
                <input
                  type="text"
                  value={question.allowedTypes || '.pdf,.doc,.docx'}
                  onChange={(e) => handleQuestionChange(qIndex, 'allowedTypes', e.target.value)}
                  className="w-full p-2 mb-2 border rounded text-black"
                />
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