'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, description, id, required, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={inputId}
            className='block text-sm font-medium text-[var(--neutral-700)] dark:text-[var(--neutral-300)] mb-2'
          >
            {label} {required && <span className='text-red-500'>*</span>}
          </label>
        )}
        
        <input
          type={type}
          className={cn(
            'flex w-full rounded-md border px-3 py-2 text-sm',
            'border-[var(--neutral-300)] dark:border-[var(--neutral-600)]',
            'bg-white dark:bg-[var(--neutral-800)]',
            'text-[var(--neutral-900)] dark:text-[var(--neutral-100)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          id={inputId}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : description ? `${inputId}-description` : undefined}
          {...props}
        />
        
        {error && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400' id={`${inputId}-error`}>
            {error}
          </p>
        )}
        
        {description && !error && (
          <p className='mt-1 text-sm text-[var(--neutral-500)] dark:text-[var(--neutral-400)]' id={`${inputId}-description`}>
            {description}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
