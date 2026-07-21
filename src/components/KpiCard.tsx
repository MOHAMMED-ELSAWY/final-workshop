import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  label: string;
  value: number | string;
  delta: number;
  up: boolean;
  icon: LucideIcon;
  accent?: 'safety' | 'success' | 'danger' | 'warning' | 'info';
  invertDelta?: boolean;
}

const accentMap = {
  safety: {
    ring: 'border-safety/30',
    iconBg: 'bg-safety/15 text-safety-bright',
    bar: 'bg-safety',
  },
  success: {
    ring: 'border-success/30',
    iconBg: 'bg-success/15 text-success',
    bar: 'bg-success',
  },
  danger: {
    ring: 'border-danger/30',
    iconBg: 'bg-danger/15 text-danger',
    bar: 'bg-danger',
  },
  warning: {
    ring: 'border-warning/30',
    iconBg: 'bg-warning/15 text-warning',
    bar: 'bg-warning',
  },
  info: {
    ring: 'border-info/30',
    iconBg: 'bg-info/15 text-info',
    bar: 'bg-info',
  },
};

export default function KpiCard({
  label,
  value,
  delta,
  up,
  icon: Icon,
  accent = 'safety',
  invertDelta = false,
}: Props) {
  const a = accentMap[accent];
  const good = invertDelta ? !up : up;

  return (
    <div className={cn('card-industrial p-4 sm:p-5', a.ring)}>
      <div className={cn('absolute bottom-0 left-0 top-0 w-1 rounded-r', a.bar)} />
      <div className="flex items-start justify-between gap-2">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', a.iconBg)}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div
          className={cn(
            'flex items-center gap-0.5 rounded-lg px-2 py-1 font-mono text-xs font-bold',
            good ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
          )}
        >
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {delta.toFixed(1)}%
        </div>
      </div>
      <div className="mt-4">
        <div className="kpi-value text-white">{value}</div>
        <div className="mt-1.5 text-sm font-semibold text-steel-400">{label}</div>
        <div className="mt-1 font-mono text-[10px] text-steel-500">مقارنة بالأسبوع الماضي</div>
      </div>
    </div>
  );
}
