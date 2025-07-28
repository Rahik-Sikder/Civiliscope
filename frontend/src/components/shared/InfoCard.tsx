import type { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  children: ReactNode;
  variant?: 'default' | 'patriot' | 'dark';
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  minHeight?: string;
  maxHeight?: string;
  width?: string;
  maxWidth?: string;
}

export default function InfoCard({ 
  title, 
  children, 
  variant = 'default',
  className = '',
  padding = 'md',
  minHeight,
  maxHeight,
  width,
  maxWidth
}: InfoCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'patriot':
        return 'glass-patriot border-patriot-neon-blue/20';
      case 'dark':
        return 'glass-dark border-white/10';
      default:
        return 'bg-base-100 border-base-300';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm':
        return 'p-4';
      case 'md':
        return 'p-6';
      case 'lg':
        return 'p-8';
      case 'xl':
        return 'p-10';
      default:
        return 'p-6';
    }
  };

  const getSizeStyles = () => {
    const styles = [];
    if (minHeight) styles.push(`min-h-[${minHeight}]`);
    if (maxHeight) styles.push(`max-h-[${maxHeight}]`);
    if (width) styles.push(`w-[${width}]`);
    if (maxWidth) styles.push(`max-w-[${maxWidth}]`);
    return styles.join(' ');
  };

  return (
    <div className={`card shadow-xl border ${getVariantStyles()} ${getSizeStyles()} ${className}`}>
      <div className={`card-body ${getPaddingStyles()}`}>
        <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-600/30">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}