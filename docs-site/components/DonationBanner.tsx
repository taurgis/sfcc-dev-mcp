import React, { useState } from 'react';

const DonationBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if user has previously dismissed the banner and if it's been a week
    const dismissedData = localStorage.getItem('donation-banner-dismissed');
    if (!dismissedData) return true;
    
    try {
      const dismissedTimestamp = parseInt(dismissedData, 10);
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
      const now = Date.now();
      
      // Show banner again if more than a week has passed
      return (now - dismissedTimestamp) > oneWeekInMs;
    } catch {
      // If there's an error parsing, show the banner
      return true;
    }
  });

  const handleDismiss = () => {
    setIsVisible(false);
    // Store current timestamp when dismissed
    localStorage.setItem('donation-banner-dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 relative">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">💖</span>
            <div>
              <span className="font-medium">
                If you enjoy what I do, consider supporting me on Ko-fi! Every little bit means the world!
              </span>
              <a
                href="https://ko-fi.com/taurgis"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm font-semibold transition-colors duration-200"
              >
                Support on Ko-fi
                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-1"
            aria-label="Dismiss donation banner"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Mobile and Medium Screen Layout */}
        <div className="lg:hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💖</span>
              <span className="font-medium text-sm">
                If you enjoy what I do, consider supporting me on Ko-fi! Every little bit means the world!
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="ml-2 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-1 flex-shrink-0"
              aria-label="Dismiss donation banner"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center">
            <a
              href="https://ko-fi.com/taurgis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm font-semibold transition-colors duration-200"
            >
              Support on Ko-fi
              <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationBanner;