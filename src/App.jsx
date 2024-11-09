import React, { useState } from 'react';
import Header from './components/Header';
import Features from './components/Features';
import LearningUniverse from './components/LearningUniverse';
import Recommendations from './components/Recommendations';
import ProblemPage from './components/ProblemPage';

const App = () => {
  const [page, setPage] = useState('home');
  const [speaking, setSpeaking] = useState(false);

  const HomePage = () => (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        <Features />
        <LearningUniverse />
        <Recommendations onSelectProblem={() => setPage('problem')} />
      </div>
    </div>
  );

  return (
    <div>
      {page === 'home' ? (
        <HomePage />
      ) : (
        <ProblemPage 
          onBack={() => setPage('home')}
          speaking={speaking}
          setSpeaking={setSpeaking}
        />
      )}
    </div>
  );
};

export default App;
