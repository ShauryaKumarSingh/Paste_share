import { forwardRef } from 'react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'input-base appearance-none bg-no-repeat',
            'bg-[right_0.5rem_center] pr-8',
            error && 'border-red-500/50 focus:border-red-500',
            className,
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b5cf6' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            background: 'var(--input-bg)',
            color: 'var(--text)',
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} style={{ background: '#0f172a', color: '#e6eef8', fontWeight: 500 }}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-rose-400 mt-1">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
