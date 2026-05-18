import React from 'react';

const variants = {
  primary: 'bg-[#E9A84C] text-[#1C1C1E] hover:bg-[#d4943a] font-semibold shadow-md hover:shadow-lg',
  secondary: 'bg-[#2D6A4F] text-white hover:bg-[#245a41] font-semibold shadow-md hover:shadow-lg',
  outline: 'border-2 border-white text-white hover:bg-white hover:text-[#2D6A4F] font-semibold',
  outlineGreen: 'border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white font-semibold',
  ghost: 'text-[#2D6A4F] hover:bg-[#EFF7F2] font-medium',
  danger: 'bg-red-500 text-white hover:bg-red-600 font-semibold',
};

const sizes = {
  sm: 'px-5 md:px-8 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
