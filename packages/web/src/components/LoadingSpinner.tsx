'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-live="polite">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-chinese-red-200 border-t-chinese-red-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 font-medium">
          {text}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Skeleton loader for content
export function LoadingSkeleton({ className = '', lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded ${
            index === lines - 1 ? 'h-4 w-3/4' : 'h-4 w-full'
          } ${index > 0 ? 'mt-2' : ''}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// Page loading component
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" role="status" aria-live="polite">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">Loading...</h2>
        <p className="mt-2 text-sm text-gray-600">Please wait while we load the content</p>
      </div>
    </div>
  );
}