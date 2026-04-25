import React from 'react';

const Input = ({
  label,
  error,
  icon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const baseStyles = 'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  const normalStyles = 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  const errorStyles = 'border-red-300 focus:border-red-500 focus:ring-red-500';

  return (
    <div className={`containerClassName ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`${baseStyles} ${error ? errorStyles : normalStyles} ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
