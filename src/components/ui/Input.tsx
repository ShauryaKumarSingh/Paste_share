import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'input-base',
            error && 'border-red-500/50 focus:border-red-500 focus:shadow-none',
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-rose-400 mt-1">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
