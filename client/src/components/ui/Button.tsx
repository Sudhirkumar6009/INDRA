import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-green-600 text-white hover:bg-green-600/90 shadow-sm hover:shadow-md',
        destructive: 'bg-green-700 text-white hover:bg-green-800',
        outline: 'border-2 border-green-300 dark:border-green-700 bg-white dark:bg-green-900 hover:bg-green-50 dark:hover:bg-green-800 text-green-900 dark:text-green-50',
        secondary: 'bg-green-700 text-white hover:bg-green-700/90 shadow-sm hover:shadow-md',
        ghost: 'hover:bg-green-50 dark:hover:bg-green-800 text-green-700 dark:text-green-300',
        link: 'text-green-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-6 text-base',
        icon: 'h-10 w-10',
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
