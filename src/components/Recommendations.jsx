import React from 'react';
import { Sparkles } from 'lucide-react';
import RecommendationCard from './RecommendationCard';

const Recommendations = ({ onSelectProblem }) => {
  const recommendations = [
    {
      title: "Quadratic Equations",
      difficulty: "Medium",
      topic: "Algebra",
      description: "Practice solving quadratic equations using various methods",
      completionRate: "75%",
      color: "bg-primary"
    },
    {
      title: "Integration by Parts",
      difficulty: "Hard",
      topic: "Calculus",
      description: "Master the technique of integration by parts",
      completionRate: "45%",
      color: "bg-secondary"
    },
    {
      title: "Pythagoras Theorem",
      difficulty: "Easy",
      topic: "Geometry",
      description: "Understanding right triangles and their properties",
      completionRate: "90%",
      color: "bg-accent"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-display mb-8 flex items-center">
        <Sparkles className="mr-2 text-primary" /> Recommended for You
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
        {recommendations.map((rec, index) => (
          <RecommendationCard 
            key={index}
            recommendation={rec}
            onClick={onSelectProblem}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
