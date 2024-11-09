import React, { useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

const LearningUniverse = () => {
  const graphRef = useRef();
  
  const graphData = {
    nodes: [
      // Core Subjects
      { id: 'Algebra', group: 'core', color: '#2563eb' },
      { id: 'Calculus', group: 'core', color: '#2563eb' },
      { id: 'Geometry', group: 'core', color: '#2563eb' },
      { id: 'Trigonometry', group: 'core', color: '#2563eb' },
      { id: 'Statistics', group: 'core', color: '#2563eb' },
      { id: 'Number Theory', group: 'core', color: '#2563eb' },
      { id: 'Linear Algebra', group: 'core', color: '#2563eb' },
      
      // Sub-topics
      { id: 'Linear Equations', group: 'sub', color: '#22c55e' },
      { id: 'Quadratic Equations', group: 'sub', color: '#22c55e' },
      { id: 'Polynomials', group: 'sub', color: '#22c55e' },
      { id: 'Derivatives', group: 'sub', color: '#22c55e' },
      { id: 'Integration', group: 'sub', color: '#22c55e' },
      { id: 'Limits', group: 'sub', color: '#22c55e' },
      { id: 'Series', group: 'sub', color: '#22c55e' },
      { id: 'Vectors', group: 'sub', color: '#22c55e' },
      { id: 'Matrices', group: 'sub', color: '#22c55e' },
      { id: 'Pythagoras', group: 'sub', color: '#22c55e' },
      { id: 'Probability', group: 'sub', color: '#22c55e' },
      { id: 'Combinatorics', group: 'sub', color: '#22c55e' },
      { id: 'Complex Numbers', group: 'sub', color: '#22c55e' },
      
      // Applications
      { id: 'Physics', group: 'application', color: '#a855f7' },
      { id: 'Engineering', group: 'application', color: '#a855f7' },
      { id: 'Data Science', group: 'application', color: '#a855f7' },
      { id: 'Machine Learning', group: 'application', color: '#a855f7' },
      { id: 'Computer Graphics', group: 'application', color: '#a855f7' },
      { id: 'Cryptography', group: 'application', color: '#a855f7' },
      
      // Prerequisites
      { id: 'Basic Arithmetic', group: 'prereq', color: '#f97316' },
      { id: 'Fractions', group: 'prereq', color: '#f97316' },
      { id: 'Exponents', group: 'prereq', color: '#f97316' },
      { id: 'Functions', group: 'prereq', color: '#f97316' },
      { id: 'Logic', group: 'prereq', color: '#f97316' }
    ],
    links: [
      // Algebra connections
      { source: 'Basic Arithmetic', target: 'Algebra' },
      { source: 'Algebra', target: 'Linear Equations' },
      { source: 'Algebra', target: 'Quadratic Equations' },
      { source: 'Algebra', target: 'Polynomials' },
      { source: 'Algebra', target: 'Functions' },
      { source: 'Algebra', target: 'Linear Algebra' },
      
      // Calculus connections
      { source: 'Functions', target: 'Calculus' },
      { source: 'Calculus', target: 'Derivatives' },
      { source: 'Calculus', target: 'Integration' },
      { source: 'Calculus', target: 'Limits' },
      { source: 'Calculus', target: 'Series' },
      { source: 'Calculus', target: 'Physics' },
      { source: 'Calculus', target: 'Engineering' },
      
      // Geometry connections
      { source: 'Geometry', target: 'Pythagoras' },
      { source: 'Geometry', target: 'Trigonometry' },
      { source: 'Geometry', target: 'Vectors' },
      { source: 'Geometry', target: 'Computer Graphics' },
      
      // Linear Algebra connections
      { source: 'Linear Algebra', target: 'Matrices' },
      { source: 'Linear Algebra', target: 'Vectors' },
      { source: 'Linear Algebra', target: 'Machine Learning' },
      { source: 'Linear Algebra', target: 'Computer Graphics' },
      
      // Statistics connections
      { source: 'Statistics', target: 'Probability' },
      { source: 'Statistics', target: 'Data Science' },
      { source: 'Statistics', target: 'Machine Learning' },
      
      // Number Theory connections
      { source: 'Number Theory', target: 'Cryptography' },
      { source: 'Number Theory', target: 'Complex Numbers' },
      
      // Cross-subject connections
      { source: 'Trigonometry', target: 'Calculus' },
      { source: 'Linear Algebra', target: 'Calculus' },
      { source: 'Algebra', target: 'Trigonometry' },
      { source: 'Complex Numbers', target: 'Calculus' },
      { source: 'Logic', target: 'Number Theory' },
      { source: 'Combinatorics', target: 'Probability' },
      { source: 'Exponents', target: 'Algebra' },
      { source: 'Fractions', target: 'Algebra' }
    ]
  };

  return (
    <Card className="mb-12 bg-zinc-900 border-zinc-800 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-display">
          Your Learning Universe
        </CardTitle>
        <CardDescription className="ml-10 text-lg text-zinc-400">
          Explore connections between mathematical concepts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] bg-zinc-950 rounded-xl overflow-hidden">
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeRelSize={12}
            nodeVal={node => 
              node.group === 'core' ? 35 :
              node.group === 'application' ? 30 :
              node.group === 'prereq' ? 25 : 20
            }
            nodeColor={node => node.color}
            linkColor={() => '#3f3f46'}
            nodeLabel={node => node.id}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id;
              const fontSize = 16/globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = 'white';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, node.x, node.y);
            }}
            cooldownTicks={100}
            linkWidth={2}
            backgroundColor="#09090b"
            d3Force={{
              charge: {
                strength: -5000,
                distanceMax: 2000
              },
              link: {
                distance: 300
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningUniverse;
