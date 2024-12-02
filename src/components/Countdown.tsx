import React from 'react';

interface CountdownProps {
  count: number;
}

const Countdown = ({ count }: CountdownProps) => {
  if (count <= 0) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="text-9xl font-bold text-white animate-bounce">
        {count}
      </div>
    </div>
  );
};

export default Countdown;