import { Calendar, User, Weight, ChevronLeft } from 'lucide-react';
import type { Order } from '../data/mockData';
import { formatDate, formatEGP, formatNum, statusLabel, statusPillClass } from '../data/mockData';
import StageBar from './StageBar';
import { cn } from '../lib/utils';

interface Props {
  order: Order;
  onClick?: () => void;
}

export default function OrderCard({ order, onClick }: Props) {
  const totalWeight = order.materials.reduce((s, m) => s + m.weightKg, 0);

  return (
    <article
      onClick={onClick}
      className={cn(
        'card-industrial cursor-pointer p-4 transition hover:border-steel-500 sm:p-5',
        order.status === 'late' && 'alert-pulse border-danger/40'
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="stamp-badge text-safety">{order.code}</span>
            <span className={statusPillClass(order.status)}>{statusLabel(order.status)}</span>
            {order.urgent && order.status !== 'urgent' && (
              <span className="pill pill-urgent">عاجل</span>
            )}
          </div>
          <h3 className="font-display text-base font-bold text-white sm:text-lg">{order.jobName}</h3>
          <p className="mt-0.5 text-sm text-steel-400">{order.clientName}</p>
        </div>
        <div className="text-left">
          <div className="font-mono text-sm font-bold text-safety-bright">{formatEGP(order.sellPrice)}</div>
          <div className="font-mono text-[11px] text-success">ربح {formatEGP(order.profit)}</div>
        </div>
      </div>

      <div className="mt-4">
        <StageBar stages={order.stages} showLabels />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-steel-700 pt-3 text-xs text-steel-400">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-steel-500" />
          {order.execEngineer}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-steel-500" />
          <span className="font-mono">{formatDate(order.deliveryDate)}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Weight className="h-3.5 w-3.5 text-steel-500" />
          <span className="font-mono">{formatNum(totalWeight)} كجم</span>
        </span>
        <span className="mr-auto flex items-center gap-1 text-steel-500">
          التفاصيل
          <ChevronLeft className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );
}
