interface Fact {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: string;
}

const senateFacts: Fact[] = [
  {
    id: '1',
    title: 'Longest Filibuster',
    content: 'The longest filibuster in Senate history was delivered by Strom Thurmond in 1957, lasting 24 hours and 18 minutes opposing the Civil Rights Act.',
    category: 'History',
    icon: '⏰'
  },
  {
    id: '2',
    title: 'Senate Bean Soup',
    content: 'Senate bean soup has been served in the Senate dining room every day for over 100 years, regardless of the weather or season.',
    category: 'Tradition',
    icon: '🍲'
  },
  {
    id: '3',
    title: 'Youngest Senator',
    content: 'The youngest person ever elected to the Senate was 29 years old - the minimum age required by the Constitution.',
    category: 'Demographics',
    icon: '👨‍💼'
  },
  {
    id: '4',
    title: 'The Senate Gavel',
    content: 'The Senate uses an hourglass-shaped ivory gavel that has no head, making it unique among legislative gavels worldwide.',
    category: 'Tradition',
    icon: '⚖️'
  }
];

const houseFacts: Fact[] = [
  {
    id: '1',
    title: 'House Mace',
    content: 'The House Mace, a symbol of legislative authority, sits to the right of the Speaker and can be used to restore order during debates.',
    category: 'Tradition',
    icon: '🏛️'
  },
  {
    id: '2',
    title: 'Two-Minute Rule',
    content: 'House members have just 2 minutes to cast their vote when the electronic voting system is used for roll call votes.',
    category: 'Procedure',
    icon: '⏱️'
  },
  {
    id: '3',
    title: 'House Pages',
    content: 'High school students serve as House Pages, running messages and assisting members during sessions - a tradition dating back to 1827.',
    category: 'History',
    icon: '📬'
  },
  {
    id: '4',
    title: 'Electronic Voting',
    content: 'The House was the first legislative body in the world to install an electronic voting system, implemented in 1973.',
    category: 'Innovation',
    icon: '🗳️'
  }
];

interface TodaysFactProps {
  chamber: 'senate' | 'house';
}

export default function TodaysFact({ chamber }: TodaysFactProps) {
  const facts = chamber === 'senate' ? senateFacts : houseFacts;
  const todaysFact = facts[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % facts.length];

  return (
    <div className="glass-patriot rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center">
        <span className="neon-red mr-2">💡</span>
        Today's Fact
      </h3>
      
      <div className="flex-1 flex flex-col space-y-3">
        <div className="text-center">
          <div className="text-3xl mb-2">{todaysFact.icon}</div>
          <div className="inline-block bg-gradient-to-r from-patriot-neon-red/20 to-patriot-neon-blue/20 rounded-full px-2 py-1 text-[10px] font-medium text-gray-300 mb-2">
            {todaysFact.category}
          </div>
        </div>
        
        <div className="text-center space-y-2 flex-1">
          <h4 className="text-sm font-bold text-white leading-tight">
            {todaysFact.title}
          </h4>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            {todaysFact.content}
          </p>
        </div>
        
        <div className="pt-2 border-t border-gray-600 text-center">
          <button className="text-[10px] text-gray-400 hover:text-white transition-colors">
            Share this fact
          </button>
        </div>
      </div>
    </div>
  );
}