import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="center">Loading...</div>
    </div>
  );
};

export default function Loading() {
  return <LoadingSkeleton />;
}
