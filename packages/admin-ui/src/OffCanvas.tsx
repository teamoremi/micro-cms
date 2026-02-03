import React, { useEffect, useState } from 'react';

interface OffCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const OffCanvas: React.FC<OffCanvasProps> = ({ isOpen, onClose, title, children }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on body when open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Reset maximized state when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setIsMaximized(false), 300); // Wait for transition
    }
  }, [isOpen]);

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Panel Container - Handles centering when maximized */}
      <div className={`fixed inset-0 z-50 pointer-events-none flex justify-end transition-all duration-300 ${isMaximized ? 'items-center justify-center p-4 md:p-8' : ''}`}>
        
        {/* Panel */}
        <div 
          className={`pointer-events-auto bg-white shadow-2xl transform transition-all duration-300 ease-in-out border-l flex flex-col
            ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            ${isMaximized 
              ? 'h-full md:h-[90vh] w-full max-w-6xl rounded-2xl border-none translate-x-0' 
              : 'h-full w-full max-w-md'
            }
          `}
        >
          <header className="flex justify-between items-center px-6 py-4 border-b bg-white rounded-t-2xl">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900 truncate">{title}</h2>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Maximize/Minimize Button */}
              <button 
                onClick={toggleMaximize}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hidden md:block"
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5-5M4 4v5M15 15l5 5m0 0l-5 5m5-5v-5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h7v7m9-11h-7V4" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto bg-gray-50/50">
            <div className={`mx-auto transition-all duration-300 ${isMaximized ? 'max-w-4xl p-8 md:p-12' : 'p-6'}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};