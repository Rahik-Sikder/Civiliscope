import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "glass" | "outline";
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  value = "",
  onChange,
  size = "md",
  variant = "default",
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 text-sm px-3";
      case "lg":
        return "h-12 text-lg px-4";
      default:
        return "h-10 text-sm px-3";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "glass":
        return "glass-dark border border-white/20 text-white placeholder-gray-400 focus:border-patriot-neon-blue/50";
      case "outline":
        return "bg-transparent border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-patriot-neon-blue";
      default:
        return "bg-patriot-dark/50 border border-gray-600 text-white placeholder-gray-400 focus:border-patriot-neon-blue";
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon - Outside backdrop filter */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
        <svg
          className="w-4 h-4 transition-colors duration-200"
          style={{
            color: isFocused ? "#ffffff" : "#e5e7eb",
            stroke: isFocused ? "#ffffff" : "#e5e7eb"
          }}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <div className="relative">

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-patriot-neon-blue/30
            ${getSizeClasses()}
            ${getVariantClasses()}
            ${isFocused ? "shadow-lg" : ""}
          `}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                     text-gray-400 hover:text-white transition-colors duration-200
                     p-1 rounded-full hover:bg-white/10"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Focus Ring Effect */}
      {isFocused && (
        <div className="absolute inset-0 rounded-lg border border-patriot-neon-blue/50 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
}