import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subtext?: string;
  badge?: string;
  badgeType?: 'default' | 'warning' | 'danger' | 'success';
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
  };
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  subtext,
  badge,
  badgeType = 'default',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative overflow-hidden rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-sm transition-all',
        onClick && 'cursor-pointer hover:border-teal hover:shadow-md'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-navy">
          <Icon className="h-5 w-5 text-teal" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary tabular-nums">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-text-secondary">
        {subtext && <span>{subtext}</span>}
        {badge && (
          <span
            className={clsx(
              'rounded-full px-2 py-0.5 text-[10px] font-bold',
              badgeType === 'danger' && 'bg-status-danger-bg text-status-danger',
              badgeType === 'warning' && 'bg-status-warning-bg text-status-warning',
              badgeType === 'success' && 'bg-status-success-bg text-status-success',
              badgeType === 'default' && 'bg-slate-100 text-slate-600'
            )}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
