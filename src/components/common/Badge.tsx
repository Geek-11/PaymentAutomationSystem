import React from 'react';

type BadgeColor = 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'gray',
  size = 'md',
  className = '',
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  // Color classes
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };
  
  return (
    <span
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;