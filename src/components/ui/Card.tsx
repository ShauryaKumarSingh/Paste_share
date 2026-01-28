import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        hover ? 'card-hover' : 'card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
