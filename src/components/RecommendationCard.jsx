import React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

const RecommendationCard = ({ recommendation, onClick }) => {
  const { title, difficulty, topic, description, completionRate, color } = recommendation;

  return (
    <Card 
      className="min-w-[300px] bg-zinc-900 border-zinc-800 group hover:border-primary transition-all cursor-pointer snap-start rounded-2xl"
      onClick={onClick}
    >
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-display">
          {title}
        </CardTitle>
        <CardDescription className="text-zinc-400 mt-2 px-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-zinc-800 text-zinc-200">
            {topic} • {difficulty}
          </span>
          <ChevronRight className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
        </div>
        <div className="mt-4 bg-zinc-800 rounded-full h-2">
          <div 
            className={`${color} h-2 rounded-full transition-all duration-500`}
            style={{width: completionRate}}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
