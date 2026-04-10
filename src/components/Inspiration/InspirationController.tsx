import React from 'react';
import { InspirationForest } from './InspirationForest';

interface InspirationControllerProps {
  inspirations: any[];
}

export const InspirationController: React.FC<InspirationControllerProps> = ({ inspirations }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <InspirationForest inspirations={inspirations} />
    </div>
  );
};
