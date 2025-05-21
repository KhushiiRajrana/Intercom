import React, { useEffect, useState, useRef } from 'react';

const SplitLanding = () => {
  const [expand, setExpand] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showPointer, setShowPointer] = useState(false);
  const [expandedDetail, setExpandedDetail] = useState(null);
  const buttonRef = useRef(null);

  const refundOptions = [
    'Getting a refund',
    'Within 30 days of purchase',
    'Refund for an order placed by mistake',
    'Refund for an unwanted gift'
  ];

  const detailedResponses = {
    1: {
      title: "Refund Process Details",
      content: "Our standard refund process takes 3-5 business days. You'll receive an email confirmation once the refund is initiated. The amount will be credited back to your original payment method."
    },
    2: {
      title: "Return Shipping Information",
      content: "For returns, you can use our prepaid shipping label. Pack the item securely in its original packaging if possible. Drop it off at any authorized shipping location."
    }
  };

  useEffect(() => {
    // Initial expansion
    const timer = setTimeout(() => {
      setExpand(true);
    }, 1000);

    // Show cursor
    const cursorTimer = setTimeout(() => {
      setShowCursor(true);
    }, 2000);

    // Show pointer on question
    const pointerTimer = setTimeout(() => {
      setShowPointer(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(cursorTimer);
      clearTimeout(pointerTimer);
    };
  }, []);

  useEffect(() => {
    if (showResponse) {
      let currentText = '';
      let currentIndex = 0;
      let currentCharIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex >= refundOptions.length) {
          clearInterval(typeInterval);
          return;
        }

        if (currentCharIndex < refundOptions[currentIndex].length) {
          currentText += refundOptions[currentIndex][currentCharIndex];
          setTypingText(prev => ({
            ...prev,
            [currentIndex]: currentText
          }));
          currentCharIndex++;
        } else {
          currentIndex++;
          currentText = '';
          currentCharIndex = 0;
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }
  }, [showResponse]);

  const handleQuestionClick = () => {
    setShowPointer(false);
    setSelectedQuestion("How do I get a refund?");
    setTimeout(() => {
      setShowResponse(true);
    }, 500);
  };

  const handleDetailClick = (number) => {
    setExpandedDetail(expandedDetail === number ? null : number);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f9f9f9]">
      <div className={`flex h-full transition-all duration-1000 ease-in-out ${expand ? 'gap-0' : 'gap-4'}`}>
        {/* Left section */}
        <div 
          className={`bg-black flex items-center justify-center transition-all duration-1000 ease-in-out ${
            expand ? 'w-0' : 'w-1/2 rounded-r-3xl'
          }`}
        >
          <div className={`text-white text-center transition-all duration-700 ${expand ? 'opacity-0' : 'opacity-100'}`}>
            <div className="inline-block px-4 py-1 mb-4 rounded-full border border-white/30 text-sm">
              For Agents
            </div>
            <h1 className="text-5xl font-bold">AI Copilot</h1>
          </div>
        </div>

        {/* Right section */}
        <div 
          className={`bg-white flex items-center justify-center transition-all duration-1000 ease-in-out ${
            expand ? 'w-full p-8' : 'w-1/2 rounded-l-3xl'
          }`}
        >
          <div className={`w-full max-w-md transition-all duration-700 ${expand ? 'opacity-0' : 'opacity-100'} h-[70vh] my-auto bg-white rounded-3xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">AI Copilot</span>
              </div>
              <button className="text-sm text-gray-600">Details</button>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4 font-medium">
                FIN
              </div>
              <p className="text-gray-800 font-medium mb-2">Hi, I'm Fin AI Copilot</p>
              <p className="text-gray-600 text-sm">Ask me anything about this conversation.</p>
            </div>
          </div>

          {/* Inbox UI that appears after expansion */}
          <div className={`absolute inset-0 transition-all duration-700 ${expand ? 'opacity-100 delay-500' : 'opacity-0'}`}>
            <div className="max-w-6xl mx-auto h-[85%] mt-12 bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-4">
                  <h2 className="text-base font-semibold">Your Inbox</h2>
                  <span className="text-gray-500 text-sm">Luis Easton</span>
                </div>
                <div className="flex items-center gap-6">
                  <button className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded-full">Chat</button>
                  <button className="text-gray-600 text-sm">AI Copilot</button>
                  <button className="text-gray-600 text-sm">Teams</button>
                </div>
              </div>

              <div className="flex h-[calc(100%-4rem)]">
                {/* Left sidebar */}
                <div className="w-80 border-r border-gray-100 bg-white">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button className="text-sm text-gray-600 font-medium">Open</button>
                      <button className="text-sm text-gray-600 flex items-center gap-1">
                        Waiting longest
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Luis Williams</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">I bought a product from your store...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main chat area */}
                <div className="flex-1 flex flex-col bg-white">
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0"></div>
                        <div className="bg-gray-50 rounded-2xl p-4 max-w-xl">
                          <p className="text-sm text-gray-800">I bought a product from your store in November as a Christmas gift for a member of my family. However, I learn not they have something very similar already. I was hoping you'd be able to take me through if a return is possible.</p>
                        </div>
                      </div>
                      <div className="flex items-start justify-end gap-3">
                        <div className="bg-black text-white rounded-2xl p-4 max-w-xl">
                          <p className="text-sm">Let me help you out with this first, Luis.</p>
                        </div>
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                          FIN
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 p-4">
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        placeholder="Use the Tab key for suggestions..." 
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                      />
                    </div>
                  </div>
                </div>

                {/* Right sidebar */}
                <div className="w-80 border-l border-gray-100 bg-white p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">AI Copilot</span>
                      </div>
                      <button className="text-sm text-gray-600">Details</button>
                    </div>

                    {!selectedQuestion ? (
                      <>
                        <div className="flex flex-col items-center text-center mb-auto">
                          <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4 font-medium">
                            FIN
                          </div>
                          <p className="text-gray-800 font-medium mb-2">Hi, I'm Fin AI Copilot</p>
                          <p className="text-gray-600 text-sm">Ask me anything about this conversation.</p>
                        </div>
                        <div className="mt-auto">
                          <h3 className="text-sm text-gray-500 mb-2">Suggested</h3>
                          <div className="relative">
                            <button 
                              ref={buttonRef}
                              onClick={handleQuestionClick}
                              className="w-full text-left bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="p-3">
                                <p className="text-sm font-medium mb-2">How do I get a refund?</p>
                                <ul className="space-y-1.5">
                                  {refundOptions.slice(1).map((option, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                      <span>{option}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </button>
                            {showPointer && (
                              <div 
                                className="absolute pointer-events-none"
                                style={{
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: '24px',
                                  height: '24px'
                                }}
                              >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 animate-bounce">
                                  <path 
                                    fill="black" 
                                    d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-[calc(100vh-32rem)] overflow-y-auto">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0"></div>
                            <div>
                              <p className="font-medium text-sm mb-1">You</p>
                              <p className="text-sm text-gray-800">{selectedQuestion}</p>
                            </div>
                          </div>
                          
                          {showResponse && (
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs">
                                  FIN
                                </div>
                                <div className="space-y-4 flex-1 relative">
                                  {/* Detailed information panel - Positioned absolutely */}
                                  {expandedDetail && (
                                    <div className="absolute left-0 transform -translate-x-[calc(100%+1rem)] top-0 w-64 bg-white rounded-lg p-4 shadow-lg border border-gray-100 z-10">
                                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-white border-t border-r border-gray-100"></div>
                                      <p className="text-sm font-medium mb-2">{detailedResponses[expandedDetail].title}</p>
                                      <p className="text-sm text-gray-600">{detailedResponses[expandedDetail].content}</p>
                                    </div>
                                  )}

                                  {/* Purple container with responses */}
                                  <div className="bg-purple-50 rounded-xl p-4 space-y-3">
                                    <div className="relative">
                                      <p className="text-sm text-gray-800">
                                        First, let me check your order details and eligibility for a refund. This will help us process your request faster
                                        <button 
                                          onClick={() => handleDetailClick(1)}
                                          className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                          1
                                        </button>
                                      </p>
                                    </div>

                                    <div className="relative">
                                      <p className="text-sm text-gray-800">
                                        I can see you purchased this item within our return window. I'll guide you through the return process
                                        <button 
                                          onClick={() => handleDetailClick(2)}
                                          className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                          2
                                        </button>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Original bullet points */}
                                  <div>
                                    <p className="font-medium text-sm mb-2">{typingText[0]}</p>
                                    <ul className="space-y-2 text-sm text-gray-800">
                                      {[1, 2, 3].map((index) => (
                                        typingText[index] && (
                                          <li key={index} className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                            <span>{typingText[index]}</span>
                                          </li>
                                        )
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Ask a question..."
                          className={`w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 ${
                            showCursor ? 'animate-pulse-cursor' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitLanding; 