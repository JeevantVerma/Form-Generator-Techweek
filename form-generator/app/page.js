"use client";
import Head from 'next/head'
import { useRouter } from 'next/navigation';

export default function Home() {

  const router= useRouter();
  const handleClick=()=>{
     router.push('/login');
  }

  return (
    <div className="min-h-screen bg-slate-800">
      <Head>
        <title>FormAid: Smart Forms Made Simple</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Formify: Smart Forms Made Simple
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-black">About</h2>
          <p className="text-gray-700 mb-4">
            Welcome to Formify, your intelligent form creation and management solution. We understand that creating effective forms can be challenging, which is why we've developed a user-friendly platform with built-in smarts to help both form creators and respondents.
          </p>
          <p className="text-gray-700 mb-4">
            Formify features an intuitive drag-and-drop interface for easy form creation, coupled with our unique Contextual Help System. This system provides real-time explanations for each field, guiding users as they complete your forms. Our AI-Assisted Autofill suggests relevant answers, speeding up the process and improving accuracy.
          </p>
          <p className="text-gray-700 mb-4">
            Track form completion progress with our visual indicator, encouraging users to finish what they've started. For form creators, our simple analytics dashboard offers valuable insights into form performance and user behavior.
          </p>
          <p className="text-gray-700 mb-4">
            Whether you're collecting customer feedback, organizing events, or conducting surveys, Formify streamlines the process from start to finish. Experience the future of form creation - where simplicity meets intelligence.
          </p>
          <div className="mt-6">
            <button onClick={handleClick}className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
