import React from 'react';

const Card = ({
  children,
  className = '',
  glass = false,
  hover = false,
  ...props
}) => {
  const baseStyles = 'rounded-xl border transition-all duration-200';

  const glassStyles = glass
    ? 'bg-white/80 backdrop-blur-lg border-white/20 shadow-xl'
    : 'bg-white border-gray-200 shadow-md';

  const hoverStyles = hover
    ? 'hover:shadow-2xl hover:scale-[1.02] hover:border-primary-200'
    : '';

  return (
    <div
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', gradient = false }) => {
  const gradientStyles = gradient
    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
    : 'border-b border-gray-200 bg-gray-50/50';

  return (
    <div className={`px-6 py-4 rounded-t-xl ${gradientStyles} ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-xl ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
