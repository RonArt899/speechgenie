import React from 'react';

const Header = () => {
  return (
    <div className="w-full space-y-8">
      <div className="flex justify-center py-4">
        <img 
          src="https://www.verble.app/assets/files/logo-rgb-1.1920x0x0x100.png" 
          alt="Verble Logo" 
          className="h-[30px] w-auto"
          style={{
            imageRendering: '-webkit-optimize-contrast',
          }}
        />
      </div>
      <div className="w-full h-[300px] relative overflow-hidden rounded-lg">
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
    </div>
  );
};

export default Header;