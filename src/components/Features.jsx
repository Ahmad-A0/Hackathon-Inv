import React from 'react';
import { Zap, Target, Compass } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Learning",
      description: "Personalized problem recommendations",
      color: "primary"
    },
    {
      icon: Target,
      title: "Focused Practice",
      description: "Master concepts through targeted exercises",
      color: "secondary"
    },
    {
      icon: Compass,
      title: "Learning Path",
      description: "Guided journey through mathematics",
      color: "accent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {features.map((feature, index) => (
        <Card key={index} className={`bg-zinc-900 border-zinc-800 group hover:border-${feature.color} transition-colors rounded-2xl`}>
          <CardHeader className="p-6">
            <CardTitle className="flex items-center font-display">
              <feature.icon className={`mr-2 text-${feature.color} group-hover:animate-pulse`} />
              {feature.title}
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-2 px-2">
              {feature.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default Features;
