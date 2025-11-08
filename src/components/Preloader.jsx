import React from 'react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#50020B]">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
        <div
          className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.3s]"
        ></div>
        <div
          className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.5s]"
        ></div>
      </div>
    </div>
  );
};

export default Preloader;
