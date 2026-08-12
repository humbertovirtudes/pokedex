'use client';

import { TYPE_COLORS_BG, TYPE_COLORS_TEXT, TYPE_COLORS_BORDER } from '@/lib/types-colors';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const bgClass = TYPE_COLORS_BG[type] || 'bg-gray-500';
  const textClass = TYPE_COLORS_TEXT[type] || 'text-gray-500';
  const borderClass = TYPE_COLORS_BORDER[type] || 'border-gray-500/30';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${bgClass} ${textClass} ${borderClass} ${sizeClasses[size]} bg-opacity-10`}
      style={{
        backgroundColor: `${TYPE_COLORS_BG[type]?.replace('bg-[', '').replace(']', '') || '#666'}1A`,
      }}
    >
      {capitalizedType}
    </span>
  );
}
