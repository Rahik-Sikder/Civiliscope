import type { Member } from '../../types/memberApi';

interface MemberHeaderProps {
  member: Member;
}

export default function MemberHeader({ member }: MemberHeaderProps) {
  const currentTerm = member.terms[0]; // Most recent term
  const currentParty = member.partyHistory[0]; // Most recent party
  
  const getPartyColor = (party: string) => {
    if (party === 'R' || party === 'Republican') return 'text-patriot-neon-red';
    if (party === 'D' || party === 'Democrat') return 'text-patriot-neon-blue';
    return 'text-white';
  };

  return (
    <div className="glass-patriot rounded-2xl p-8 border border-patriot-neon-blue/20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-patriot-neon-blue/5 to-patriot-neon-red/5 pointer-events-none"></div>
      
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden bg-gray-700 border-4 border-gray-600 shadow-2xl relative">
            {member.depiction?.imageUrl ? (
              <img 
                src={member.depiction.imageUrl} 
                alt={member.directOrderName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                👤
              </div>
            )}
            {/* Subtle border glow */}
            <div className="absolute inset-0 rounded-xl border-2 border-white/20 pointer-events-none"></div>
          </div>
        </div>

        {/* Member Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                {member.directOrderName}
              </span>
            </h1>
            <p className="text-xl text-gray-300 font-medium">
              {member.honorificName} {member.lastName}
            </p>
          </div>

          {/* Title and Party */}
          <div className="flex flex-wrap gap-3">
            <div className="badge badge-primary badge-lg px-4 py-3 font-semibold shadow-lg">
              {currentTerm?.memberType || 'Member of Congress'}
            </div>
            <div className={`badge badge-lg px-4 py-3 font-semibold shadow-lg ${getPartyColor(currentParty?.partyAbbreviation)} bg-gray-800/50 border-current`}>
              {currentParty?.partyName} ({currentParty?.partyAbbreviation})
            </div>
            <div className="badge badge-accent badge-lg px-4 py-3 font-semibold shadow-lg">
              {member.state}
            </div>
          </div>

          {/* Basic Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="text-center p-3 glass-dark rounded-lg border border-gray-600/30">
              <div className="text-3xl font-bold text-white mb-1">
                {new Date().getFullYear() - parseInt(member.birthYear)}
              </div>
              <div className="text-sm text-gray-400 font-medium">Years Old</div>
            </div>
            <div className="text-center p-3 glass-dark rounded-lg border border-gray-600/30">
              <div className="text-3xl font-bold text-white mb-1">
                {member.terms.length}
              </div>
              <div className="text-sm text-gray-400 font-medium">Terms Served</div>
            </div>
            <div className="text-center p-3 glass-dark rounded-lg border border-patriot-neon-blue/30">
              <div className="text-3xl font-bold neon-blue mb-1">
                {member.sponsoredLegislation.count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 font-medium">Bills Sponsored</div>
            </div>
            <div className="text-center p-3 glass-dark rounded-lg border border-patriot-neon-red/30">
              <div className="text-3xl font-bold neon-red mb-1">
                {member.cosponsoredLegislation.count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 font-medium">Bills Cosponsored</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}