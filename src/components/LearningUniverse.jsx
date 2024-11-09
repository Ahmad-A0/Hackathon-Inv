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
      { id: 'Algebra', group: 'core', color: '#2563eb' },
      { id: 'Linear Equations', group: 'sub', color: '#22c55e' },
      { id: 'Quadratic Equations', group: 'sub', color: '#22c55e' },
      { id: 'Calculus', group: 'core', color: '#2563eb' },
      { id: 'Derivatives', group: 'sub', color: '#22c55e' },
      { id: 'Integration', group: 'sub', color: '#22c55e' },
      { id: 'Geometry', group: 'core', color: '#2563eb' },
      { id: 'Trigonometry', group: 'core', color: '#2563eb' },
      { id: 'Pythagoras', group: 'sub', color: '#22c55e' }
    ],
    links: [
      { source: 'Algebra', target: 'Linear Equations' },
      { source: 'Algebra', target: 'Quadratic Equations' },
      { source: 'Calculus', target: 'Derivatives' },
      { source: 'Calculus', target: 'Integration' },
      { source: 'Geometry', target: 'Pythagoras' },
      { source: 'Geometry', target: 'Trigonometry' },
      { source: 'Trigonometry', target: 'Calculus' },
      { source: 'Algebra', target: 'Trigonometry' }
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
        <div className="h-[500px] bg-zinc-950 rounded-xl overflow-hidden">
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeRelSize={12}
            nodeVal={node => node.group === 'core' ? 30 : 15}
            nodeColor={node => node.color}
            linkColor={() => '#3f3f46'}
            nodeLabel={node => node.id}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id;
              const fontSize = 14/globalScale;
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
                strength: -2000,
                distanceMax: 500
              },
              link: {
                distance: 200
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningUniverse;
