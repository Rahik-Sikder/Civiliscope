import { useLegislatorStore } from '../../store/legislatorStore';
import type { Representative } from '../../types/representative';

export default function LegislatorPreview() {
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
                alt={selectedLegislator.full_name}
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
              {selectedLegislator.full_name}
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

        {/* Basic Information */}
        <div className="space-y-3 text-sm">
          <div className="glass-dark rounded-lg p-3 border border-gray-600/30">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-lg">🗳️</span>
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium mb-1">Position</p>
                <p className="text-white">
                  {'district' in selectedLegislator ? 'Representative' : 'Senator'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-600">
          <button className="w-full glass-dark rounded-lg p-3 text-sm text-white hover:bg-gray-700/50 transition-colors border border-gray-600/30">
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}