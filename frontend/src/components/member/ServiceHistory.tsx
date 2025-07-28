import InfoCard from '../shared/InfoCard';
import type { Member } from '../../types/memberApi';

interface ServiceHistoryProps {
  member: Member;
}

export default function ServiceHistory({ member }: ServiceHistoryProps) {
  const sortedTerms = [...member.terms].sort((a, b) => b.startYear - a.startYear);

  return (
    <InfoCard title="Service History" variant="dark" padding="lg" minHeight="400px">
      <div className="space-y-3">
        {sortedTerms.map((term, index) => (
          <div key={index} className="p-4 glass-patriot rounded-lg border border-gray-600/30 hover:border-patriot-neon-blue/40 transition-all duration-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-1">
                  {term.memberType} - {term.chamber}
                </h4>
                <p className="text-gray-300 font-medium">
                  {term.stateName} {term.district ? `(District ${term.district})` : ''}
                </p>
              </div>
              <div className="text-right bg-gray-800/50 rounded-lg px-3 py-2 ml-4">
                <div className="text-white font-bold">
                  {term.startYear} - {term.endYear}
                </div>
                <div className="text-xs text-patriot-neon-blue font-medium">
                  {term.congress}th Congress
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}