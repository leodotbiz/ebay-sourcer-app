import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-light',
    secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-gray-100',
  }

  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

