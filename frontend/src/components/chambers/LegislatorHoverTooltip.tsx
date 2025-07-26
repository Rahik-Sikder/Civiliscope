import { useLegislatorStore } from '../../store/legislatorStore';
import type { Representative } from '../../types/representative';

interface ChamberSkew {
  offsetX: number;
  offsetY: number;
}

interface LegislatorHoverTooltipProps {
  position: { x: number; y: number };
  skew?: ChamberSkew;
}

export default function LegislatorHoverTooltip({ position, skew }: LegislatorHoverTooltipProps) {
  const hoveredLegislator = useLegislatorStore((state) => state.hoveredLegislator);

  if (!hoveredLegislator) {
    return null;
  }

  const partyColor = hoveredLegislator.party === 'Republican' ? 'neon-red' : 
                     hoveredLegislator.party === 'Democrat' ? 'neon-blue' : 'text-white';

  // Adjust position based on chamber skew if provided
  const adjustedPosition = skew ? {
    x: position.x + skew.offsetX,
    y: position.y + skew.offsetY
  } : position;
  

  return (
    <div 
      className="pointer-events-none"
      style={{
        position: 'fixed',
        left: adjustedPosition.x + 15,
        top: adjustedPosition.y + 25,
        zIndex: 9999,
        transform: 'none'
      }}
    >
        <div className="glass-patriot rounded-lg p-4 border border-gray-600/30 max-w-xs shadow-lg shadow-black/50">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0 border border-gray-600">
            {hoveredLegislator.photo_url ? (
              <img 
                src={hoveredLegislator.photo_url} 
                alt={hoveredLegislator.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center text-gray-400 text-lg ${hoveredLegislator.photo_url ? 'hidden' : ''}`}>
              👤
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white leading-tight mb-1">
              {hoveredLegislator.name}
            </h4>
            <p className={`text-xs font-medium ${partyColor} mb-1`}>
              {hoveredLegislator.party}
            </p>
            <p className="text-xs text-gray-300">
              {'district' in hoveredLegislator 
                ? `${hoveredLegislator.state}-${(hoveredLegislator as Representative).district}`
                : hoveredLegislator.state
              }
            </p>
            
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-600/50">
          <p className="text-xs text-gray-400 text-center">
            Click to view full details
          </p>
        </div>
      </div>
    </div>
  );
}