interface StatBarProps {
  name: string;
  value: number;
  max?: number;
}

const statLabels: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
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
        <span className="text-gray-300 capitalize">{label}</span>
        <span className="text-gray-400 font-mono">{value}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
