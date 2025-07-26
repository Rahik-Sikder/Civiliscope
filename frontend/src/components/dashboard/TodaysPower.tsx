interface Power {
  id: string;
  title: string;
  description: string;
  example: string;
  category: string;
  icon: string;
}

const senatePowers: Power[] = [
  {
    id: '1',
    title: 'Advice and Consent',
    description: 'The Senate has exclusive power to confirm presidential nominations for federal judges, cabinet members, and ambassadors.',
    example: 'Supreme Court justices require Senate confirmation with a simple majority vote.',
    category: 'Constitutional Power',
    icon: '⚖️'
  },
  {
    id: '2',
    title: 'Treaty Ratification',
    description: 'Only the Senate can ratify treaties negotiated by the President, requiring a two-thirds majority.',
    example: 'The Senate ratified NATO expansion treaties in 1998, 2004, and 2020.',
    category: 'Foreign Policy',
    icon: '🌍'
  },
  {
    id: '3',
    title: 'Impeachment Trials',
    description: 'The Senate serves as the court for impeachment trials of federal officials, including the President.',
    example: 'The Senate tried President Trump twice, in 2020 and 2021.',
    category: 'Judicial Power',
    icon: '🏛️'
  },
  {
    id: '4',
    title: 'Filibuster Power',
    description: 'Senators can extend debate indefinitely to delay or block legislation, requiring 60 votes to end.',
    example: 'The filibuster allows minority party to influence major legislation.',
    category: 'Procedural Power',
    icon: '🗣️'
  }
];

const housePowers: Power[] = [
  {
    id: '1',
    title: 'Power of the Purse',
    description: 'All revenue bills must originate in the House, giving it primary control over federal spending and taxation.',
    example: 'Annual appropriations bills and tax legislation start in the House.',
    category: 'Financial Power',
    icon: '💰'
  },
  {
    id: '2',
    title: 'Impeachment Power',
    description: 'Only the House can impeach federal officials, including the President, with a simple majority vote.',
    example: 'The House impeached Presidents Clinton and Trump (twice).',
    category: 'Constitutional Power',
    icon: '⚖️'
  },
  {
    id: '3',
    title: 'Electoral College Contingency',
    description: 'If no presidential candidate receives an Electoral College majority, the House decides the election.',
    example: 'The House chose Thomas Jefferson in 1801 and John Quincy Adams in 1825.',
    category: 'Electoral Power',
    icon: '🗳️'
  },
  {
    id: '4',
    title: 'Rules and Procedures',
    description: 'The House sets its own rules and procedures, allowing the majority party significant control over the legislative agenda.',
    example: 'The Speaker controls which bills reach the floor for a vote.',
    category: 'Procedural Power',
    icon: '📋'
  }
];

interface TodaysPowerProps {
  chamber: 'senate' | 'house';
}

export default function TodaysPower({ chamber }: TodaysPowerProps) {
  const powers = chamber === 'senate' ? senatePowers : housePowers;
  const todaysPower = powers[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % powers.length];

  return (
    <div className="glass-patriot rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center">
        <span className="neon-blue mr-2">💪</span>
        Today's Power
      </h3>
      
      <div className="flex-1 flex flex-col space-y-3">
        <div className="text-center">
          <div className="text-3xl mb-2">{todaysPower.icon}</div>
          <div className="inline-block bg-gradient-to-r from-patriot-neon-blue/20 to-patriot-neon-red/20 rounded-full px-2 py-1 text-[10px] font-medium text-gray-300 mb-2">
            {todaysPower.category}
          </div>
        </div>
        
        <div className="space-y-2 flex-1">
          <h4 className="text-sm font-bold text-white text-center leading-tight">
            {todaysPower.title}
          </h4>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            {todaysPower.description}
          </p>
          
          <div className="glass-dark rounded-lg p-2 border border-gray-600/30">
            <div className="text-[9px] font-medium text-gray-400 mb-1">Example:</div>
            <p className="text-[9px] text-gray-300 leading-relaxed">
              {todaysPower.example}
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-600 text-center">
          <button className="text-[10px] text-gray-400 hover:text-white transition-colors">
            Learn more about this power
          </button>
        </div>
      </div>
    </div>
  );
}