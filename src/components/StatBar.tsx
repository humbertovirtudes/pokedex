interface StatBarProps {
  name: string;
  value: number;
  max?: number;
}

const statLabels: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SPA',
  'special-defense': 'SPD',
  speed: 'SPD',
};

export function StatBar({ name, value, max = 255 }: StatBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const label = statLabels[name] || name.charAt(0).toUpperCase() + name.slice(1);
  
  let barColor = 'bg-gray-400';
  if (percentage >= 80) barColor = 'bg-green-500';
  else if (percentage >= 60) barColor = 'bg-emerald-500';
  else if (percentage >= 40) barColor = 'bg-yellow-500';
  else if (percentage >= 20) barColor = 'bg-orange-500';
  else barColor = 'bg-red-500';
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300 font-mono text-xs uppercase">{label}</span>
        <span className="text-gray-400 font-mono text-xs">{value}</span>
      </div>
      <div className="h-3 bg-[#1A2B3C] border-2 border-black overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
