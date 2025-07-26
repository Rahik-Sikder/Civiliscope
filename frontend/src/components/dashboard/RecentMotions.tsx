interface Motion {
  id: string;
  title: string;
  type: string;
  sponsor: string;
  date: string;
  status: 'passed' | 'failed' | 'pending';
}

const dummyMotions: Motion[] = [
  {
    id: '1',
    title: 'Motion to proceed on Infrastructure Investment Act',
    type: 'Cloture Motion',
    sponsor: 'Sen. Smith (D-NY)',
    date: '2024-01-15',
    status: 'passed'
  },
  {
    id: '2',
    title: 'Amendment to Defense Authorization Bill Section 412',
    type: 'Amendment',
    sponsor: 'Sen. Johnson (R-TX)',
    date: '2024-01-14',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Confirmation of Federal Judge Nominee',
    type: 'Nomination',
    sponsor: 'Judiciary Committee',
    date: '2024-01-13',
    status: 'passed'
  },
  {
    id: '4',
    title: 'Motion to table Healthcare Reform Amendment',
    type: 'Procedural Motion',
    sponsor: 'Sen. Davis (D-CA)',
    date: '2024-01-12',
    status: 'failed'
  }
];

export default function RecentMotions() {
  const getStatusColor = (status: Motion['status']) => {
    switch (status) {
      case 'passed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Motion['status']) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  return (
    <div className="glass-patriot rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center">
        <span className="neon-red mr-2">📋</span>
        Recent Motions
      </h3>
      
      <div className="space-y-2 flex-1 overflow-y-auto pr-2">
        {dummyMotions.map((motion) => (
          <div key={motion.id} className="glass-dark rounded-lg p-2 border border-gray-600/30">
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-[11px] font-medium text-white leading-tight pr-1 flex-1 break-words">
                {motion.title.length > 80 ? `${motion.title.substring(0, 80)}...` : motion.title}
              </h4>
              <div className={`flex items-center space-x-1 flex-shrink-0 ml-1 ${getStatusColor(motion.status)}`}>
                <span className="text-[10px]">{getStatusIcon(motion.status)}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1 text-[10px] text-gray-400">
              <div className="flex items-center justify-between">
                <span className="bg-gray-700 px-1 py-0.5 rounded text-[9px] max-w-[120px] truncate">
                  {motion.type}
                </span>
                <span className="text-[9px] flex-shrink-0">{new Date(motion.date).toLocaleDateString()}</span>
              </div>
              <span className="text-[9px] truncate">{motion.sponsor}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-600">
        <button className="w-full text-xs text-gray-400 hover:text-white transition-colors">
          View All Motions →
        </button>
      </div>
    </div>
  );
}