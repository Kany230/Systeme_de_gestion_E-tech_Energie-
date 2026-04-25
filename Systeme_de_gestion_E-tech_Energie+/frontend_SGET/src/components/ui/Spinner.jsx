import React from 'react';

const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizes = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  const colors = {
    primary: 'border-primary-200 border-t-primary-600',
    energy: 'border-energy-200 border-t-energy-600',
    tech: 'border-tech-200 border-t-tech-600',
    white: 'border-gray-200 border-t-white',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizes[size]} ${colors[color]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
