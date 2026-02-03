import React, { SVGProps, useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { injectStyles } from './index';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OffCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function MinimizeSquareMinimalisticLinear(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 13.5h-3m3 0v3m0-3L7 17m6.5-6.5h3m-3 0v-3m0 3L17 7"
        ></path>
      </g>
    </svg>
  )
}


export function WindowMaximize(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M18 20.75h-6a.75.75 0 0 1 0-1.5h6A1.25 1.25 0 0 0 19.25 18V6A1.25 1.25 0 0 0 18 4.75H6A1.25 1.25 0 0 0 4.75 6v6a.75.75 0 0 1-1.5 0V6A2.75 2.75 0 0 1 6 3.25h12A2.75 2.75 0 0 1 20.75 6v12A2.75 2.75 0 0 1 18 20.75"
      ></path>
      <path
        fill="currentColor"
        d="M16 12.75a.76.76 0 0 1-.75-.75V8.75H12a.75.75 0 0 1 0-1.5h4a.76.76 0 0 1 .75.75v4a.76.76 0 0 1-.75.75"
      ></path>
      <path
        fill="currentColor"
        d="M11.5 13.25A.74.74 0 0 1 11 13a.75.75 0 0 1 0-1l4.5-4.5a.75.75 0 0 1 1.06 1.06L12 13a.74.74 0 0 1-.5.25M8 20.75H5A1.76 1.76 0 0 1 3.25 19v-3A1.76 1.76 0 0 1 5 14.25h3A1.76 1.76 0 0 1 9.75 16v3A1.76 1.76 0 0 1 8 20.75m-3-5a.25.25 0 0 0-.25.25v3a.25.25 0 0 0 .25.25h3a.25.25 0 0 0 .25-.25v-3a.25.25 0 0 0-.25-.25Z"
      ></path>
    </svg>
  )
}

export const OffCanvas: React.FC<OffCanvasProps> = ({ isOpen, onClose, title, children }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    injectStyles();
  }, []);

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
      setTimeout(() => setIsMaximized(false), 300);
    }
  }, [isOpen]);

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "mcms-fixed mcms-inset-0 mcms-bg-black/40 mcms-backdrop-blur-sm mcms-transition-opacity mcms-z-[9998]",
          isOpen ? "mcms-opacity-100" : "mcms-opacity-0 mcms-pointer-events-none"
        )}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "mcms-fixed mcms-z-[9999] mcms-bg-white mcms-shadow-2xl mcms-transform mcms-transition-all mcms-duration-300 mcms-ease-in-out mcms-flex mcms-flex-col",
          isOpen ? "mcms-translate-x-0 mcms-opacity-100" : "mcms-translate-x-full mcms-opacity-0",
          isMaximized 
            ? "mcms-inset-4 md:mcms-inset-8 mcms-rounded-2xl" 
            : "mcms-top-0 mcms-right-0 mcms-h-full mcms-w-full mcms-max-w-md mcms-border-l"
        )}
      >
        <header className="mcms-flex mcms-justify-between mcms-items-center mcms-px-6 mcms-py-4 mcms-border-b mcms-bg-white mcms-rounded-t-2xl">
          <div className="mcms-flex mcms-items-center mcms-gap-4">
            <h2 className="mcms-text-xl mcms-font-bold mcms-text-gray-900 mcms-truncate">{title}</h2>
          </div>
          
          <div className="mcms-flex mcms-items-center mcms-gap-1">
            <button 
              onClick={toggleMaximize}
              type="button"
              className="mcms-p-2 hover:mcms-bg-gray-100 mcms-rounded-lg mcms-transition-colors mcms-text-gray-500 mcms-hidden md:mcms-block"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? <WindowMaximize /> : <MinimizeSquareMinimalisticLinear />}
            </button>

            <button 
              onClick={onClose}
              type="button"
              className="mcms-p-2 hover:mcms-bg-gray-100 mcms-rounded-lg mcms-transition-colors mcms-text-gray-500"
              aria-label="Close"
            >
              <svg className="mcms-w-6 mcms-h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>
        
        <div className="mcms-flex-1 mcms-overflow-y-auto mcms-bg-gray-50/50">
          <div className={cn(
            "mcms-mx-auto mcms-transition-all mcms-duration-300",
            isMaximized ? "mcms-max-w-4xl mcms-p-8 md:mcms-p-12" : "mcms-p-6"
          )}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
