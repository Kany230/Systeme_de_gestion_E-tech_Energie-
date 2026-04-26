import React from 'react';

const Avatar = ({
  src,
  alt = 'User avatar',
  size = 'md',
  className = '',
  fallback,
  ...props
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const baseStyles = 'rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover shadow-lg ${className}`}
        {...props}
      />
    );
  }

  return (
    <div className={`${baseStyles} ${sizes[size]} ${className}`} {...props}>
      {fallback || alt.charAt(0).toUpperCase()}
    </div>
  );
};

export default Avatar;
