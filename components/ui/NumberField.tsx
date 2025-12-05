import React from 'react'

interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  helperText?: string
  errorText?: string
  prefix?: string
}

export default function NumberField({
  label,
  helperText,
  errorText,
  prefix,
  className = '',
  ...props
}: NumberFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type="number"
          step="any"
          className={`
            w-full px-3 py-2 border rounded-lg
            ${prefix ? 'pl-8' : ''}
            ${errorText ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${className}
          `}
          {...props}
        />
      </div>
      {errorText && (
        <p className="mt-1 text-sm text-red-500">{errorText}</p>
      )}
      {helperText && !errorText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

