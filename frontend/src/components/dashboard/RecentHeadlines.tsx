interface Headline {
  id: string;
  title: string;
  source: string;
  time: string;
  category: 'senate' | 'house' | 'congress' | 'politics';
  url?: string;
}

const dummyHeadlines: Headline[] = [
  {
    id: '1',
    title: 'Senate Advances Bipartisan Infrastructure Package in 68-32 Vote',
    source: 'Congressional Quarterly',
    time: '2 hours ago',
    category: 'senate',
    url: '#'
  },
  {
    id: '2',
    title: 'Committee Hearing on Budget Reconciliation Scheduled for Thursday',
    source: 'Roll Call',
    time: '4 hours ago',
    category: 'congress',
    url: '#'
  },
  {
    id: '3',
    title: 'Judiciary Committee Confirms Three Federal Judge Nominees',
    source: 'The Hill',
    time: '6 hours ago',
    category: 'senate',
    url: '#'
  },
  {
    id: '4',
    title: 'House Speaker Announces New Legislative Priorities for Session',
    source: 'Politico',
    time: '8 hours ago',
    category: 'house',
    url: '#'
  },
  {
    id: '5',
    title: 'Bipartisan Group Introduces Climate Change Legislation',
    source: 'Associated Press',
    time: '12 hours ago',
    category: 'congress',
    url: '#'
  }
];

export default function RecentHeadlines() {
  const getCategoryColor = (category: Headline['category']) => {
    switch (category) {
      case 'senate': return 'bg-blue-600/20 text-blue-400';
      case 'house': return 'bg-red-600/20 text-red-400';
      case 'congress': return 'bg-purple-600/20 text-purple-400';
      case 'politics': return 'bg-gray-600/20 text-gray-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="glass-patriot rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center">
        <span className="neon-blue mr-2">📰</span>
        Recent Headlines
      </h3>
      
      <div className="space-y-2 flex-1 overflow-y-auto pr-2">
        {dummyHeadlines.map((headline) => (
          <div key={headline.id} className="glass-dark rounded-lg p-2 border border-gray-600/30 hover:border-gray-500/50 transition-colors">
            <div className="mb-1">
              <h4 className="text-[11px] font-medium text-white leading-tight hover:text-gray-200 cursor-pointer break-words">
                {headline.title.length > 90 ? `${headline.title.substring(0, 90)}...` : headline.title}
              </h4>
            </div>
            
            <div className="flex flex-col gap-1 text-[10px]">
              <div className="flex items-center justify-between">
                <span className={`px-1 py-0.5 rounded-full uppercase font-medium text-[9px] max-w-[80px] truncate ${getCategoryColor(headline.category)}`}>
                  {headline.category}
                </span>
                <span className="text-gray-500 text-[9px] flex-shrink-0">{headline.time}</span>
              </div>
              <span className="text-gray-400 text-[9px] truncate">{headline.source}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-600">
        <button className="w-full text-xs text-gray-400 hover:text-white transition-colors">
          View All Headlines →
        </button>
      </div>
    </div>
  );
}