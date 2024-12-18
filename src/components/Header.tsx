import React from 'react';

const Header = () => {
  return (
    <div className="w-full h-[300px] relative overflow-hidden rounded-lg mb-8">
      <img 
        src="/lovable-uploads/4d352a17-c70d-4474-bd1e-282705449c59.png" 
        alt="Public speaker addressing an audience" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">Speech Practice</h1>
          <p className="text-xl text-white">
            Record your speech and get AI-powered feedback
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;