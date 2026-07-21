import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import OrderCard from '../components/OrderCard';
import { orders, type OrderStatus } from '../data/mockData';
import { cn } from '../lib/utils';

type FilterKey = 'all' | OrderStatus;

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'late', label: 'متأخرة' },
  { key: 'urgent', label: 'عاجلة' },
  { key: 'in_progress', label: 'جاري التنفيذ' },
  { key: 'new', label: 'جديدة' },
  { key: 'delivered', label: 'تم التسليم' },
];

export default function Orders() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      c[o.status] = (c[o.status] || 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter =
        filter === 'all'
          ? true
          : filter === 'urgent'
            ? o.urgent || o.status === 'urgent'
            : o.status === filter;
      const qq = q.trim();
      const matchQ =
        !qq ||
        o.code.includes(qq) ||
        o.jobName.includes(qq) ||
        o.clientName.includes(qq) ||
        o.execEngineer.includes(qq);
      return matchFilter && matchQ;
    });
  }, [filter, q]);

  const selectedOrder = orders.find((o) => o.id === selected);

  return (
    <div className="space-y-5">
      <div className="page-header flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="lg:hidden">الأوردرات</h1>
          <p className="hidden sm:block">متابعة مراحل التصنيع من الاستلام حتى التسليم</p>
        </div>
        <div className="font-mono text-sm text-steel-500">
          <span className="text-safety-bright">{filtered.length}</span> / {orders.length} أوردر
        </div>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-500" />
          <input
            className="input pr-11"
            placeholder="بحث بالكود، الشغلانة، العميل، المهندس..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="hidden h-4 w-4 shrink-0 text-steel-500 sm:block" />
          <div className="scroll-x-hide flex gap-2 pb-1">
            {filters.map((f) => (
              <button
                key={f.key}
                className={cn('chip', filter === f.key && 'active')}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="chip-count">{counts[f.key] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-steel-700 bg-steel-900/60 px-4 py-2.5 text-[11px] text-steel-400">
        <span className="font-semibold text-steel-300">مراحل التصنيع:</span>
        {['استلام', 'تجهيز', 'قص', 'لحام', 'دهان', 'تسليم'].map((s, i) => (
          <span key={s} className="flex items-center gap-1.5 font-mono">
            <span
              className={cn(
                'inline-block h-2 w-4 rounded-sm',
                i < 3 ? 'bg-success' : i === 3 ? 'bg-safety' : 'bg-steel-700'
              )}
            />
            {s}
          </span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card-industrial">
          <div className="font-display text-lg text-steel-300">لا توجد أوردرات مطابقة</div>
          <p className="mt-1 text-sm">جرّب تغيير الفلتر أو كلمة البحث</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} onClick={() => setSelected(o.id)} />
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-steel-600 bg-steel-900 p-5 shadow-2xl sm:rounded-2xl sm:p-6">
            <div className="hazard-stripe absolute inset-x-0 top-0 h-1.5 rounded-t-2xl" />
            <div className="mb-4 flex items-start justify-between gap-3 pt-1">
              <div>
                <span className="stamp-badge text-safety">{selectedOrder.code}</span>
                <h3 className="mt-2 font-display text-xl font-bold text-white">
                  {selectedOrder.jobName}
                </h3>
                <p className="text-sm text-steel-400">{selectedOrder.clientName}</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>
                إغلاق
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-steel-700 bg-steel-850 p-3">
                <div className="text-xs text-steel-500">المهندس المنفذ</div>
                <div className="mt-1 font-semibold">{selectedOrder.execEngineer}</div>
              </div>
              <div className="rounded-xl border border-steel-700 bg-steel-850 p-3">
                <div className="text-xs text-steel-500">عدد العمال</div>
                <div className="mt-1 font-mono text-lg font-bold text-safety">
                  {selectedOrder.workers}
                </div>
              </div>
              <div className="rounded-xl border border-steel-700 bg-steel-850 p-3">
                <div className="text-xs text-steel-500">التشطيب</div>
                <div className="mt-1 font-semibold">{selectedOrder.finishLabel}</div>
              </div>
              <div className="rounded-xl border border-steel-700 bg-steel-850 p-3">
                <div className="text-xs text-steel-500">نوع المنتج</div>
                <div className="mt-1 font-semibold">{selectedOrder.productType}</div>
              </div>
            </div>

            <div className="mb-3 text-sm font-bold text-steel-300">قائمة القطع / الخامات</div>
            <div className="mb-4 space-y-2">
              {selectedOrder.materials.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-dashed border-steel-600 bg-steel-950/50 px-3 py-2.5"
                >
                  <div>
                    <div className="font-semibold text-steel-100">{m.typeLabel}</div>
                    <div className="font-mono text-[11px] text-steel-500">
                      {m.thickness ? `${m.thickness}مم · ` : ''}
                      {m.length}سم
                      {m.width ? ` × ${m.width}سم` : ''} · ×{m.quantity}
                    </div>
                  </div>
                  <div className="text-left font-mono text-sm">
                    <div className="text-safety">{m.weightKg.toFixed(1)} كجم</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-safety/30 bg-safety/5 p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-steel-400">تكلفة إجمالية</div>
                <div className="text-left font-mono font-bold">
                  {selectedOrder.totalCost.toLocaleString('ar-EG')} ج.م
                </div>
                <div className="text-steel-400">سعر البيع</div>
                <div className="text-left font-mono font-bold text-safety-bright">
                  {selectedOrder.sellPrice.toLocaleString('ar-EG')} ج.م
                </div>
                <div className="text-steel-400">الربح</div>
                <div className="text-left font-mono font-bold text-success">
                  {selectedOrder.profit.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
