interface StatItemProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: 'red' | 'blue' | 'white' | 'gray';
}

export default function StatItem({ label, value, icon, color = 'white' }: StatItemProps) {
  const getColorClass = () => {
    switch (color) {
      case 'red':
        return 'text-patriot-neon-red';
      case 'blue':
        return 'text-patriot-neon-blue';
      case 'gray':
        return 'text-gray-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 glass-dark rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 hover:transform hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl opacity-80">{icon}</span>}
        <span className="text-gray-300 text-sm font-medium">{label}</span>
      </div>
      <span className={`font-bold text-lg ${getColorClass()}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  );
}