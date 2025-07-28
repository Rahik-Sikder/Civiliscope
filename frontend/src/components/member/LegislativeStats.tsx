import InfoCard from '../shared/InfoCard';
import StatItem from '../shared/StatItem';
import type { Member } from '../../types/memberApi';

interface LegislativeStatsProps {
  member: Member;
}

export default function LegislativeStats({ member }: LegislativeStatsProps) {
  // Calculate years more accurately - use actual years from terms
  const yearsInCongress = member.terms.reduce((total, term) => {
    // Each term is typically 2 years, but calculate actual difference
    const termYears = term.endYear - term.startYear;
    return total + (termYears > 0 ? termYears : 2); // Default to 2 if same year
  }, 0);

  const avgSponsored = yearsInCongress > 0 ? Math.round(member.sponsoredLegislation.count / yearsInCongress) : 0;
  const avgCosponsored = yearsInCongress > 0 ? Math.round(member.cosponsoredLegislation.count / yearsInCongress) : 0;

  return (
    <InfoCard title="Legislative Activity" variant="dark" padding="lg" minHeight="500px">
      <div className="space-y-3">
        <StatItem 
          label="Bills Sponsored" 
          value={member.sponsoredLegislation.count}
          icon="📝"
          color="blue"
        />
        <StatItem 
          label="Bills Cosponsored" 
          value={member.cosponsoredLegislation.count}
          icon="🤝"
          color="red"
        />
        <StatItem 
          label="Years in Congress" 
          value={yearsInCongress}
          icon="📅"
          color="white"
        />
        <StatItem 
          label="Avg. Sponsored/Year" 
          value={avgSponsored}
          icon="📈"
          color="blue"
        />
        <StatItem 
          label="Avg. Cosponsored/Year" 
          value={avgCosponsored}
          icon="📈"
          color="red"
        />
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-600/30">
        <div className="flex gap-3">
          <a 
            href={member.sponsoredLegislation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-dark rounded-lg p-2 text-sm font-medium text-patriot-neon-blue transition-all duration-300 border border-patriot-neon-blue/30 hover:scale-105 hover:border-patriot-neon-blue/50 hover:bg-patriot-neon-blue/10 hover:shadow-[0_0_15px_rgba(0,180,255,0.3)] flex-1 flex items-center justify-center text-center font-bold"
          >
            View Sponsored
          </a>
          <a 
            href={member.cosponsoredLegislation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-dark rounded-lg p-2 text-sm font-medium text-patriot-neon-red transition-all duration-300 border border-patriot-neon-red/30 hover:scale-105 hover:border-patriot-neon-red/50 hover:bg-patriot-neon-red/10 hover:shadow-[0_0_15px_rgba(255,23,68,0.3)] flex-1 flex items-center justify-center text-center font-bold" 
          >
            View Cosponsored
          </a>
        </div>
      </div>
    </InfoCard>
  );
}