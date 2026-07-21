import type { StageProgress } from '../data/mockData';
import { cn } from '../lib/utils';

interface Props {
  stages: StageProgress[];
  showLabels?: boolean;
  compact?: boolean;
}

export default function StageBar({ stages, showLabels = false, compact = false }: Props) {
  return (
    <div className="w-full">
      <div className={cn('stage-track', compact ? 'h-1.5' : 'h-2.5')}>
        {stages.map((s) => (
          <div
            key={s.key}
            className={cn(
              'stage-seg',
              s.status === 'done' && 'done',
              s.status === 'current' && 'current',
              s.status === 'pending' && 'pending',
              s.status === 'late' && 'late'
            )}
            title={s.label}
          />
        ))}
      </div>
      {showLabels && (
        <div className="mt-2 grid grid-cols-6 gap-0.5">
          {stages.map((s) => (
            <div
              key={s.key}
              className={cn(
                'text-center font-mono text-[9px] leading-tight sm:text-[10px]',
                s.status === 'done' && 'text-success',
                s.status === 'current' && 'font-bold text-safety-bright',
                s.status === 'late' && 'font-bold text-danger',
                s.status === 'pending' && 'text-steel-500'
              )}
            >
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
