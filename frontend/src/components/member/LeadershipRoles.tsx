import InfoCard from '../shared/InfoCard';
import type { Member } from '../../types/memberApi';

interface LeadershipRolesProps {
  member: Member;
}

export default function LeadershipRoles({ member }: LeadershipRolesProps) {
  if (!member.leadership || member.leadership.length === 0) {
    return (
      <InfoCard title="Leadership Roles" variant="dark" padding="lg" minHeight="300px">
        <div className="text-gray-400 text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📋</div>
          <p className="text-lg font-medium">No leadership roles on record</p>
          <p className="text-sm mt-2">This member has not held formal leadership positions in Congress</p>
        </div>
      </InfoCard>
    );
  }

  const sortedLeadership = [...member.leadership].sort((a, b) => b.congress - a.congress);

  return (
    <InfoCard title="Leadership Roles" variant="dark" padding="lg" minHeight="300px">
      <div className="space-y-3">
        {sortedLeadership.map((role, index) => (
          <div key={index} className="p-4 glass-patriot rounded-lg border border-patriot-neon-red/30 hover:border-patriot-neon-red/50 transition-all duration-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-patriot-neon-red rounded-full shadow-lg"></div>
                <h4 className="font-bold text-white text-lg">{role.type}</h4>
              </div>
              <div className="bg-gray-800/50 rounded-lg px-3 py-1">
                <div className="text-sm text-patriot-neon-red font-bold">
                  {role.congress}th Congress
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}