'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Definir las variantes para los botones usando class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] focus-visible:ring-[var(--primary-light)]',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        outline: 'border border-[var(--neutral-300)] bg-transparent hover:bg-[var(--neutral-100)] text-[var(--neutral-800)] dark:border-[var(--neutral-700)] dark:text-[var(--neutral-100)] dark:hover:bg-[var(--neutral-800)]',
        secondary: 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-dark)] focus-visible:ring-[var(--secondary-light)]',
        accent: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] focus-visible:ring-[var(--accent-light)]',
        ghost: 'bg-transparent hover:bg-[var(--neutral-100)] text-[var(--neutral-800)] dark:text-[var(--neutral-100)] dark:hover:bg-[var(--neutral-800)]',
        link: 'bg-transparent underline-offset-4 hover:underline text-[var(--primary)] hover:bg-transparent dark:text-[var(--primary-light)]',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg
            className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
