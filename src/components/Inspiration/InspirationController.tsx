import React from 'react';
import { InspirationBoard } from './InspirationBoard';

interface InspirationControllerProps {
  inspirations: any[];
}

export const InspirationController: React.FC<InspirationControllerProps> = ({ inspirations }) => {
  return (
    <div className="relative w-full min-h-screen">
      <InspirationBoard inspirations={inspirations} />
    </div>
  );
};
