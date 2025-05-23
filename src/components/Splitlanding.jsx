import React, { useEffect, useState, useRef } from 'react';

const SplitLanding = () => {
  const [expand, setExpand] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showPointer, setShowPointer] = useState(false);
  const [expandedDetail, setExpandedDetail] = useState(null);
  const [detailPosition, setDetailPosition] = useState({ top: 0 });
  const [showComposerText, setShowComposerText] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [formatMenuPosition, setFormatMenuPosition] = useState({ top: 0, left: 0 });
  const [messages, setMessages] = useState([]);
  const textContainerRef = useRef(null);
  const formatMenuRef = useRef(null);
  const chatContainerRef = useRef(null);
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

  const handleDetailClick = (number, event) => {
    const buttonRect = event.target.getBoundingClientRect();
    setDetailPosition({ top: buttonRect.top });
    setExpandedDetail(expandedDetail === number ? null : number);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Position the menu above the selection
      setFormatMenuPosition({
        top: rect.top - 45, // Position above the text with some spacing
        left: rect.left
      });
      setShowFormatMenu(true);
    } else {
      setShowFormatMenu(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formatMenuRef.current && !formatMenuRef.current.contains(event.target)) {
        setShowFormatMenu(false);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFormatAction = (action) => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      
      switch(action) {
        case 'bold':
          span.style.fontWeight = 'bold';
          break;
        case 'italic':
          span.style.fontStyle = 'italic';
          break;
        case 'link':
          // Add link handling
          const url = prompt('Enter URL:');
          if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.textContent = selection.toString();
            range.deleteContents();
            range.insertNode(link);
          }
          break;
        case 'chat':
          // Add chat bubble handling
          console.log('Chat action clicked');
          break;
        case 'more':
          // Add more options handling
          console.log('More options clicked');
          break;
      }
      
      if (action !== 'link' && action !== 'chat' && action !== 'more') {
        range.surroundContents(span);
      }
      setShowFormatMenu(false);
    }
  };

  const handleSendMessage = () => {
    const newMessage = {
      type: 'agent',
      content: `We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund.

To assist you with your refund request, could you please provide your order ID and proof of purchase.

Please note:
We can only refund orders placed within the last 60 days, and your item must meet our requirements for condition to be returned. Please check when you placed your order before proceeding.

Once I've checked these details, if everything looks OK, I will send a return QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.

Thanks for your cooperation!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Add user's follow-up message after a short delay
    setTimeout(() => {
      const userMessage = {
        type: 'user',
        content: "I placed the order over 60 days ago... Could you make an exception, please?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
    }, 1000);
    
    setShowComposerText(false);
    setShowResponse(false);
  };

  // Scroll to bottom when new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Messages */}
                    <div className="max-w-3xl mx-auto space-y-4">
                      {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-2 ${message.type === 'user' ? '' : 'justify-end'}`}>
                          {message.type === 'user' && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 mt-1"></div>
                          )}
                          <div className={`${
                            message.type === 'user' 
                              ? 'bg-white border border-gray-200' 
                              : 'bg-[#f5f5f5]'
                          } rounded-lg px-4 py-3 max-w-[65%]`}>
                            <div className="text-sm text-gray-800" style={{ lineHeight: '1.5' }}>
                              {message.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Composer */}
                  {showComposerText && (
                    <div className="flex flex-col p-4">
                      <div className="flex items-end gap-2 justify-end">
                        <div className="bg-white rounded-lg p-4 max-w-[65%] shadow-sm w-full">
                          <div 
                            ref={textContainerRef}
                            className="text-sm text-gray-600 mb-4 cursor-text select-text outline-none min-h-[120px]" 
                            contentEditable
                            suppressContentEditableWarning
                            placeholder="Type your message..."
                          >
                            <p className="mb-2">
                              We can only refund orders placed within the last 60 days, and your item must meet our requirements for condition to be returned. Please check when you placed your order before proceeding.
                            </p>
                            <p>
                              Once I've checked these details, if everything looks OK, I will send a return QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <button className="text-gray-500 hover:text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            </div>
                            <button 
                              onClick={handleSendMessage}
                              className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fixed bottom input */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200">
                    <div className="max-w-3xl mx-auto p-4">
                      <div className="flex justify-end">
                        <input 
                          type="text" 
                          placeholder="Ask a question..." 
                          className="w-[300px] px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-200 p-3">
                      <div className="max-w-3xl mx-auto flex items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Chat</span>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          </div>
                        </div>
                      </div>
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
                        <div className="mt-4">
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="Ask a question..."
                              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
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
                                  {/* Detailed information panel */}
                                  {expandedDetail && (
                                    <div 
                                      className="absolute bg-white rounded-lg shadow-lg border border-gray-100 w-[280px]"
                                      style={{
                                        left: '-12px',
                                        transform: 'translateX(-100%)',
                                        top: detailPosition.top - 10,
                                        zIndex: 50
                                      }}
                                    >
                                      <div className="p-4">
                                        <h3 className="text-base font-medium mb-2">Getting a refund</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                          {expandedDetail === 1 ? 
                                            "We understand that sometimes a purchase may not meet your needs. Here's what you need to request a refund. This guide outlines the refund process and shares a valuable resource for your concern." :
                                            "All refund details have been shared. Let me know if you need any clarification before proceeding further."}
                                        </p>
                                        <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
                                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm-.997-5.886l2.121-2.121a.5.5 0 1 1 .707.707L7.71 8.822a.5.5 0 0 1-.707 0L4.882 6.7a.5.5 0 1 1 .707-.707l2.121 2.121z"/>
                                          </svg>
                                          Add to composer
                                        </button>
                                      </div>
                                      <div className="absolute right-0 top-4 transform translate-x-[6px] rotate-45 w-3 h-3 bg-white border-t border-r border-gray-100"></div>
                                    </div>
                                  )}

                                  {/* Purple container with responses */}
                                  <div className="bg-purple-50 rounded-xl p-4 space-y-3">
                                    <div className="relative">
                                      <p className="text-sm text-gray-800">
                                        First, let me check your order details and eligibility for a refund. This will help us process your request faster
                                        <button 
                                          onClick={(e) => handleDetailClick(1, e)}
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
                                          onClick={(e) => handleDetailClick(2, e)}
                                          className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                          2
                                        </button>
                                      </p>
                                    </div>

                                    {/* Composer popup */}
                                    {showComposerText && (
                                      <div 
                                        className="fixed bg-white rounded-lg shadow-lg border border-gray-100 w-[280px]"
                                        style={{
                                          left: '50%',
                                          top: '50%',
                                          transform: 'translate(-50%, -50%)',
                                          zIndex: 1000
                                        }}
                                      >
                                        <div className="p-4">
                                          <div 
                                            ref={textContainerRef}
                                            className="text-sm text-gray-600 mb-4 cursor-text select-text" 
                                            contentEditable
                                            suppressContentEditableWarning
                                          >
                                            <p className="mb-2">
                                              We can only refund orders placed within the last 60 days, and your item must meet our requirements for condition to be returned. Please check when you placed your order before proceeding.
                                            </p>
                                            <p>
                                              Once I've checked these details, if everything looks OK, I will send a return QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.
                                            </p>
                                          </div>
                                          <button 
                                            onClick={() => setShowComposerText(false)}
                                            className="w-full flex items-center justify-center gap-2 text-sm text-white bg-black rounded-lg px-3 py-2 hover:bg-gray-900"
                                          >
                                            Send
                                          </button>
                                        </div>
                                      </div>
                                    )}

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

                                  {/* Add to composer button */}
                                  <div className="relative mt-4">
                                    <button 
                                      onClick={() => setShowComposerText(true)}
                                      className="w-full flex items-center justify-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
                                    >
                                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm-.997-5.886l2.121-2.121a.5.5 0 1 1 .707.707L7.71 8.822a.5.5 0 0 1-.707 0L4.882 6.7a.5.5 0 1 1 .707-.707l2.121 2.121z"/>
                                      </svg>
                                      Add to composer
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp toolbar */}
      <div className="bg-[#f0f2f5] border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm1.61-9.96c-2.06-.3-3.88.97-4.43 2.79-.18.58.26 1.17.87 1.17h.2c.41 0 .74-.29.88-.67.32-.89 1.27-1.5 2.3-1.28.95.2 1.65 1.13 1.57 2.1-.1 1.34-1.62 1.63-2.45 2.88 0 .01-.01.01-.01.02-.01.02-.02.03-.03.05-.09.15-.18.32-.25.5-.01.03-.03.05-.04.08-.01.02-.01.04-.02.07-.12.34-.2.75-.2 1.25h2c0-.42.11-.77.28-1.07.02-.03.03-.06.05-.09.08-.14.18-.27.28-.39.01-.01.02-.03.03-.04.1-.12.21-.23.33-.34.96-.91 2.26-1.65 1.99-3.56-.24-1.74-1.61-3.21-3.35-3.47z"/>
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Format Menu */}
      {showFormatMenu && (
        <div 
          ref={formatMenuRef}
          className="fixed bg-white rounded-lg shadow-lg border border-gray-100 py-2 px-3 flex items-center gap-3"
          style={{
            top: `${formatMenuPosition.top}px`,
            left: `${formatMenuPosition.left}px`,
            zIndex: 1100
          }}
        >
          <button 
            className="text-gray-600 hover:text-gray-800"
            onClick={() => handleFormatAction('chat')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </button>
          <div className="w-px h-4 bg-gray-200"></div>
          <button 
            className="text-gray-600 hover:text-gray-800"
            onClick={() => handleFormatAction('bold')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
            </svg>
          </button>
          <button 
            className="text-gray-600 hover:text-gray-800"
            onClick={() => handleFormatAction('italic')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/>
            </svg>
          </button>
          <button 
            className="text-gray-600 hover:text-gray-800"
            onClick={() => handleFormatAction('link')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            </svg>
          </button>
          <div className="w-px h-4 bg-gray-200"></div>
          <button 
            className="text-gray-600 hover:text-gray-800"
            onClick={() => handleFormatAction('more')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SplitLanding; 