interface LoadingDotsProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'red' | 'blue' | 'purple' | 'white' | 'custom';
  dotColor?: string;
  glowColor?: string;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export default function LoadingDots({ 
  size = 'medium', 
  variant = 'purple',
  dotColor,
  glowColor,
  className = '',
  speed = 'normal'
}: LoadingDotsProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          dotSize: 8,
          spacing: 4
        };
      case 'large':
        return {
          dotSize: 24,
          spacing: 12
        };
      default: // medium
        return {
          dotSize: 16,
          spacing: 8
        };
    }
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'red':
        return { 
          color: 'var(--color-patriot-neon-red)', 
          glow: 'var(--color-patriot-neon-red-glow)' 
        };
      case 'blue':
        return { 
          color: 'var(--color-patriot-neon-blue)', 
          glow: 'var(--color-patriot-neon-blue-glow)' 
        };
      case 'purple':
        return { 
          color: 'var(--color-patriot-neon-purple)', 
          glow: 'var(--color-patriot-neon-purple-glow)' 
        };
      case 'white':
        return { 
          color: '#ffffff', 
          glow: 'rgba(255,255,255,0.3)' 
        };
      case 'custom':
        return { 
          color: dotColor || 'var(--color-patriot-neon-purple)', 
          glow: glowColor || 'var(--color-patriot-neon-purple-glow)' 
        };
      default:
        return { 
          color: 'var(--color-patriot-neon-purple)', 
          glow: 'var(--color-patriot-neon-purple-glow)' 
        };
    }
  };

  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow':
        return '2s';
      case 'fast':
        return '0.8s';
      default: // normal
        return '1.4s';
    }
  };

  const { dotSize, spacing } = getSizeStyles();
  const { color, glow } = getVariantColors();
  const animationDuration = getAnimationDuration();

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${spacing}px`,
  };

  const dotStyle = {
    width: `${dotSize}px`,
    height: `${dotSize}px`,
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: `0 0 15px ${glow}`,
    animation: `loadingDot ${animationDuration} ease-in-out infinite`,
  };

  const keyframes = `
    @keyframes loadingDot {
      0%, 80%, 100% {
        transform: scale(0.7);
        opacity: 0.5;
      }
      40% {
        transform: scale(1.2);
        opacity: 1;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle} className={className}>
        <div 
          style={{ 
            ...dotStyle, 
            animationDelay: '0ms' 
          }}
        />
        <div 
          style={{ 
            ...dotStyle, 
            animationDelay: '200ms' 
          }}
        />
        <div 
          style={{ 
            ...dotStyle, 
            animationDelay: '400ms' 
          }}
        />
      </div>
    </>
  );
}