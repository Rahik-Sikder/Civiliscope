import { useNavigate } from 'react-router-dom';
import { useLegislatorStore } from '../../store/legislatorStore';
import type { Representative } from '../../types/representative';

export default function LegislatorPreview() {
  const navigate = useNavigate();
  const selectedLegislator = useLegislatorStore((state) => state.selectedLegislator);
  if (!selectedLegislator) {
    return (
      <div className="glass-patriot rounded-xl p-6 h-full">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="neon-blue mr-2">👤</span>
          Legislator Preview
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">🏛️</div>
            <p>Click on a seat to view legislator details</p>
          </div>
        </div>
      </div>
    );
  }

  const partyColor = selectedLegislator.party === 'Republican' ? 'neon-red' : 
                     selectedLegislator.party === 'Democrat' ? 'neon-blue' : 'text-white';

  // Get party-specific hover styles for the button
  const getPartyHoverStyles = () => {
    if (selectedLegislator.party === 'Republican') {
      return 'hover:border-patriot-neon-red/50 hover:bg-patriot-neon-red/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]';
    } else if (selectedLegislator.party === 'Democrat') {
      return 'hover:border-patriot-neon-blue/50 hover:bg-patriot-neon-blue/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]';
    } else {
      return 'hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]';
    }
  };

  return (
    <div className="glass-patriot rounded-xl p-6 h-full">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="neon-blue mr-2">👤</span>
        Legislator Preview
      </h3>
      
      <div className="space-y-4">
        {/* Profile Header */}
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0 border-2 border-gray-600">
            {selectedLegislator.photo_url ? (
              <img 
                src={selectedLegislator.photo_url} 
                alt={selectedLegislator.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center text-gray-400 text-3xl ${selectedLegislator.photo_url ? 'hidden' : ''}`}>
              👤
            </div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            <h4 className="text-lg font-bold text-white leading-tight">
              {selectedLegislator.name}
            </h4>
            <div className="space-y-1">
              <p className={`font-medium text-sm ${partyColor}`}>
                {selectedLegislator.party}
              </p>
              <p className="text-sm text-gray-300">
                {'district' in selectedLegislator 
                  ? `${selectedLegislator.state}-${(selectedLegislator as Representative).district}`
                  : selectedLegislator.state
                }
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-600">
          <button 
            onClick={() => navigate(`/legislator/${selectedLegislator.bioguide_id}`)}
            className={`w-full glass-dark rounded-lg p-3 text-sm text-white transition-all duration-300 border border-gray-600/30 hover:scale-105 group ${getPartyHoverStyles()}`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>View Full Profile</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}