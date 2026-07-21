import { useMemo, useState } from 'react';
import { Save, Pencil, Check, X, Layers, Banknote } from 'lucide-react';
import {
  materialPrices as initialPrices,
  orders,
  formatDate,
  formatEGP,
  type MaterialPrice,
} from '../data/mockData';
import { cn } from '../lib/utils';

export default function Costs() {
  const [tab, setTab] = useState<'prices' | 'orders'>('prices');
  const [prices, setPrices] = useState<MaterialPrice[]>(initialPrices);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const orderCosts = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    []
  );

  const totals = useMemo(() => {
    return orderCosts.reduce(
      (acc, o) => ({
        material: acc.material + o.materialCost,
        labor: acc.labor + o.laborCost,
        finish: acc.finish + o.finishCost,
        expenses: acc.expenses + o.expenses,
        profit: acc.profit + o.profit,
        sell: acc.sell + o.sellPrice,
      }),
      { material: 0, labor: 0, finish: 0, expenses: 0, profit: 0, sell: 0 }
    );
  }, [orderCosts]);

  function startEdit(p: MaterialPrice) {
    setEditing(p.type);
    setEditValue(String(p.pricePerKg));
  }

  function commitEdit(type: string) {
    const v = parseFloat(editValue);
    if (!isNaN(v) && v > 0) {
      setPrices((prev) =>
        prev.map((p) =>
          p.type === type
            ? { ...p, pricePerKg: v, updatedAt: new Date().toISOString().slice(0, 10) }
            : p
        )
      );
    }
    setEditing(null);
  }

  function handleSaveAll() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="page-header flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="lg:hidden">التكاليف</h1>
          <p>أسعار الخامات وتحليل تكلفة كل أوردر</p>
        </div>
        {tab === 'prices' && (
          <button className="btn btn-primary" onClick={handleSaveAll}>
            {savedFlash ? (
              <>
                <Check className="h-5 w-5" /> تم الحفظ
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> حفظ الأسعار
              </>
            )}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl border border-steel-700 bg-steel-900 p-1.5">
        <button
          className={cn(
            'btn flex-1 btn-sm',
            tab === 'prices' ? 'btn-primary' : 'btn-ghost'
          )}
          onClick={() => setTab('prices')}
        >
          <Layers className="h-4 w-4" />
          أسعار الخامات
        </button>
        <button
          className={cn(
            'btn flex-1 btn-sm',
            tab === 'orders' ? 'btn-primary' : 'btn-ghost'
          )}
          onClick={() => setTab('orders')}
        >
          <Banknote className="h-4 w-4" />
          تكلفة الأوردرات
        </button>
      </div>

      {tab === 'prices' && (
        <>
          <div className="overflow-hidden rounded-xl border border-safety/20 bg-safety/5 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="hazard-stripe h-8 w-3 shrink-0 rounded" />
              <div>
                <div className="font-display text-sm font-bold text-safety-bright">
                  لوحة أسعار الورشة
                </div>
                <p className="text-xs text-steel-400">
                  حدّث سعر الكيلو لكل خامة — يُستخدم تلقائياً في حساب الأوردرات الجديدة
                </p>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 sm:hidden">
            {prices.map((p) => (
              <div key={p.type} className="card-industrial p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-display font-bold text-white">{p.label}</div>
                  <span className="stamp-badge text-steel-500">{p.unit}</span>
                </div>
                {editing === p.type ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="input input-mono"
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button className="btn btn-success btn-icon" onClick={() => commitEdit(p.type)}>
                      <Check className="h-4 w-4" />
                    </button>
                    <button className="btn btn-ghost btn-icon" onClick={() => setEditing(null)}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-2xl font-bold text-safety-bright">
                        {p.pricePerKg}
                        <span className="mr-1 text-sm text-steel-400">ج.م</span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-steel-500">
                        كثافة {p.density} · حدّث {formatDate(p.updatedAt)}
                      </div>
                    </div>
                    <button className="btn btn-secondary btn-icon" onClick={() => startEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="table-wrap hidden sm:block">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الخامة</th>
                  <th>الوحدة</th>
                  <th>الكثافة</th>
                  <th>السعر (ج.م/كجم)</th>
                  <th>آخر تحديث</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p) => (
                  <tr key={p.type}>
                    <td className="font-semibold text-white">{p.label}</td>
                    <td className="font-mono text-xs text-steel-400">{p.unit}</td>
                    <td className="font-mono text-sm">{p.density}</td>
                    <td>
                      {editing === p.type ? (
                        <input
                          className="input input-mono max-w-[140px]"
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit(p.type);
                            if (e.key === 'Escape') setEditing(null);
                          }}
                        />
                      ) : (
                        <span className="font-mono text-base font-bold text-safety-bright">
                          {p.pricePerKg.toLocaleString('ar-EG')}
                        </span>
                      )}
                    </td>
                    <td className="font-mono text-xs">{formatDate(p.updatedAt)}</td>
                    <td>
                      {editing === p.type ? (
                        <div className="flex gap-1">
                          <button
                            className="btn btn-success btn-sm btn-icon"
                            onClick={() => commitEdit(p.type)}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={() => setEditing(null)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-secondary btn-sm" onClick={() => startEdit(p)}>
                          <Pencil className="h-3.5 w-3.5" />
                          تعديل
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <>
          {/* Summary strip */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {[
              { label: 'خامات', v: totals.material, c: 'text-steel-200' },
              { label: 'عمالة', v: totals.labor, c: 'text-info' },
              { label: 'تشطيب', v: totals.finish, c: 'text-warning' },
              { label: 'مصاريف', v: totals.expenses, c: 'text-steel-300' },
              { label: 'أرباح', v: totals.profit, c: 'text-success' },
            ].map((s) => (
              <div key={s.label} className="card-industrial p-3 sm:p-4">
                <div className="text-[11px] font-semibold text-steel-500">{s.label}</div>
                <div className={cn('mt-1 font-mono text-sm font-bold sm:text-base', s.c)}>
                  {formatEGP(s.v)}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="space-y-3 lg:hidden">
            {orderCosts.map((o) => (
              <div key={o.id} className="card-industrial p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="stamp-badge text-safety">{o.code}</span>
                  <span className="font-mono text-sm font-bold text-success">
                    +{formatEGP(o.profit)}
                  </span>
                </div>
                <div className="mb-3 font-semibold text-white">{o.jobName}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <CostCell label="خامة" value={o.materialCost} />
                  <CostCell label="عمالة" value={o.laborCost} />
                  <CostCell label="تشطيب" value={o.finishCost} />
                  <CostCell label="مصاريف" value={o.expenses} />
                </div>
                <div className="mt-3 flex justify-between border-t border-steel-700 pt-2 font-mono text-sm">
                  <span className="text-steel-400">بيع {formatEGP(o.sellPrice)}</span>
                  <span className="font-bold text-steel-100">تكلفة {formatEGP(o.totalCost)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="table-wrap hidden lg:block">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الكود</th>
                  <th>الشغلانة</th>
                  <th>خامة</th>
                  <th>عمالة</th>
                  <th>تشطيب</th>
                  <th>مصاريف</th>
                  <th>إجمالي التكلفة</th>
                  <th>سعر البيع</th>
                  <th>الربح</th>
                </tr>
              </thead>
              <tbody>
                {orderCosts.map((o) => (
                  <tr key={o.id}>
                    <td className="font-mono text-xs text-safety">{o.code}</td>
                    <td>
                      <div className="max-w-[200px] truncate font-semibold text-steel-100">
                        {o.jobName}
                      </div>
                    </td>
                    <td className="font-mono text-sm">{formatEGP(o.materialCost)}</td>
                    <td className="font-mono text-sm">{formatEGP(o.laborCost)}</td>
                    <td className="font-mono text-sm">{formatEGP(o.finishCost)}</td>
                    <td className="font-mono text-sm">{formatEGP(o.expenses)}</td>
                    <td className="font-mono text-sm font-bold text-white">
                      {formatEGP(o.totalCost)}
                    </td>
                    <td className="font-mono text-sm text-safety-bright">
                      {formatEGP(o.sellPrice)}
                    </td>
                    <td className="font-mono text-sm font-bold text-success">
                      {formatEGP(o.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-steel-600 bg-steel-800">
                  <td colSpan={2} className="px-4 py-3 font-display font-bold text-white">
                    الإجمالي
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">{formatEGP(totals.material)}</td>
                  <td className="px-4 py-3 font-mono text-sm">{formatEGP(totals.labor)}</td>
                  <td className="px-4 py-3 font-mono text-sm">{formatEGP(totals.finish)}</td>
                  <td className="px-4 py-3 font-mono text-sm">{formatEGP(totals.expenses)}</td>
                  <td className="px-4 py-3 font-mono text-sm font-bold">
                    {formatEGP(
                      totals.material + totals.labor + totals.finish + totals.expenses
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm font-bold text-safety-bright">
                    {formatEGP(totals.sell)}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm font-bold text-success">
                    {formatEGP(totals.profit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function CostCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-steel-950/50 px-2.5 py-2">
      <div className="text-steel-500">{label}</div>
      <div className="font-mono font-semibold text-steel-200">{formatEGP(value)}</div>
    </div>
  );
}
