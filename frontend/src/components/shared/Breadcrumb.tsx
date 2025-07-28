import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  title: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: string;
}

export default function Breadcrumb({ items, className = '', separator = '/' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-3 text-sm ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          {index > 0 && (
            <span className="text-gray-500 font-light text-lg">{separator}</span>
          )}
          
          {item.href && !item.isActive ? (
            <Link
              to={item.href}
              className="text-gray-400 hover:text-patriot-neon-blue transition-colors duration-200 font-medium hover:underline decoration-patriot-neon-blue/50"
            >
              {item.title}
            </Link>
          ) : (
            <span 
              className={`font-semibold ${
                item.isActive 
                  ? 'text-white' 
                  : 'text-gray-500'
              }`}
            >
              {item.title}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}