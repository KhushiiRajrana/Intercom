import React, { useEffect } from 'react';

const SplitLanding = () => {
  useEffect(() => {
    // Add animation class after component mounts
    const timer = setTimeout(() => {
      document.querySelector('.split-container').classList.add('animate');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Split container */}
      <div className="split-container relative h-full w-full">
        {/* Left section - slides from left */}
        <div className="absolute left-0 top-0 w-1/2 h-full bg-black transform -translate-x-full transition-all duration-1000 ease-in-out">
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="inline-block px-4 py-1 mb-4 rounded-full border border-white/30 text-sm">
              For Agents
            </div>
            <h1 className="text-5xl font-bold">AI Copilot</h1>
          </div>
        </div>

        {/* Right section - slides from bottom */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-white transform translate-y-full transition-all duration-1000 ease-in-out">
          <div className="flex items-center justify-center h-full p-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-800 font-medium">AI Copilot</span>
                <span className="text-gray-600">Details</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4 font-medium">
                  FIN
                </div>
                <p className="text-gray-800 font-medium mb-2">Hi, I'm Fin AI Copilot</p>
                <p className="text-gray-600 text-sm">Ask me anything about this conversation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitLanding; 