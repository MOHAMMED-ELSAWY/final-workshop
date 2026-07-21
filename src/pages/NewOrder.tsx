import { useMemo, useState } from 'react';
import {
  User,
  Wrench,
  Layers,
  CalendarDays,
  Plus,
  Trash2,
  Save,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import {
  ENGINEERS,
  FINISH_OPTIONS,
  MATERIAL_TYPES,
  PRODUCT_TYPES,
  calcLinearWeight,
  calcSheetWeight,
  clients,
  materialPrices,
  type FinishType,
  type MaterialType,
} from '../data/mockData';
import { cn } from '../lib/utils';

interface DraftMaterial {
  id: string;
  type: MaterialType;
  thickness: string;
  length: string;
  width: string;
  quantity: string;
}

const isSheet = (t: MaterialType) => t.startsWith('sheet_');

function emptyMaterial(): DraftMaterial {
  return {
    id: Math.random().toString(36).slice(2),
    type: 'sheet_iron',
    thickness: '2',
    length: '100',
    width: '100',
    quantity: '1',
  };
}

export default function NewOrder() {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEngineer, setClientEngineer] = useState('');
  const [execEngineer, setExecEngineer] = useState(ENGINEERS[0]);
  const [jobName, setJobName] = useState('');
  const [productType, setProductType] = useState(PRODUCT_TYPES[0]);
  const [finish, setFinish] = useState<FinishType>('powder');
  const [workers, setWorkers] = useState('3');
  const [receiveDate, setReceiveDate] = useState('2026-03-14');
  const [deliveryDate, setDeliveryDate] = useState('2026-03-28');
  const [materials, setMaterials] = useState<DraftMaterial[]>([emptyMaterial()]);
  const [draft, setDraft] = useState<DraftMaterial>(emptyMaterial());
  const [saved, setSaved] = useState(false);
  const [sellPrice, setSellPrice] = useState('');

  const computedMaterials = useMemo(() => {
    return materials.map((m) => {
      const meta = MATERIAL_TYPES.find((t) => t.type === m.type)!;
      const price = materialPrices.find((p) => p.type === m.type)!.pricePerKg;
      const th = parseFloat(m.thickness) || 0;
      const len = parseFloat(m.length) || 0;
      const wid = parseFloat(m.width) || 0;
      const qty = parseFloat(m.quantity) || 0;
      const weight = isSheet(m.type)
        ? calcSheetWeight(meta.density, th, len, wid, qty)
        : calcLinearWeight(meta.density, th, len, qty);
      const total = weight * price;
      return { ...m, label: meta.label, weight, price, total };
    });
  }, [materials]);

  const draftPreview = useMemo(() => {
    const meta = MATERIAL_TYPES.find((t) => t.type === draft.type)!;
    const price = materialPrices.find((p) => p.type === draft.type)!.pricePerKg;
    const th = parseFloat(draft.thickness) || 0;
    const len = parseFloat(draft.length) || 0;
    const wid = parseFloat(draft.width) || 0;
    const qty = parseFloat(draft.quantity) || 0;
    const weight = isSheet(draft.type)
      ? calcSheetWeight(meta.density, th, len, wid, qty)
      : calcLinearWeight(meta.density, th, len, qty);
    return { weight, total: weight * price, label: meta.label };
  }, [draft]);

  const costs = useMemo(() => {
    const materialCost = computedMaterials.reduce((s, m) => s + m.total, 0);
    const finishMeta = FINISH_OPTIONS.find((f) => f.value === finish)!;
    const finishCost = materialCost * (finishMeta.priceFactor - 1);
    const laborCost = (parseFloat(workers) || 0) * 400 * 5; // rough estimate
    const expenses = materialCost * 0.04;
    const totalCost = materialCost + finishCost + laborCost + expenses;
    const sell = parseFloat(sellPrice) || totalCost * 1.35;
    const profit = sell - totalCost;
    const margin = sell > 0 ? (profit / sell) * 100 : 0;
    return { materialCost, finishCost, laborCost, expenses, totalCost, sell, profit, margin };
  }, [computedMaterials, finish, workers, sellPrice]);

  function addMaterial() {
    if (!draft.thickness || !draft.length || !draft.quantity) return;
    setMaterials((prev) => [...prev, { ...draft, id: Math.random().toString(36).slice(2) }]);
    setDraft(emptyMaterial());
  }

  function removeMaterial(id: string) {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }

  function pickClient(name: string) {
    const c = clients.find((x) => x.name === name);
    if (c) {
      setClientName(c.name);
      setClientPhone(c.phone);
      setClientEngineer(c.engineer || '');
    } else {
      setClientName(name);
    }
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="lg:hidden">أوردر جديد</h1>
        <p>تسجيل شغلانة من الاستلام مع حساب التكلفة لحظياً</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {/* 1. Client */}
          <section className="form-section">
            <div className="form-section-header">
              <span className="form-section-num">01</span>
              <div>
                <div className="flex items-center gap-2 font-display text-base font-bold text-white">
                  <User className="h-4 w-4 text-safety" />
                  بيانات العميل
                </div>
                <div className="text-xs text-steel-500">معلومات التواصل والمهندسين</div>
              </div>
            </div>
            <div className="grid-form">
              <div>
                <label className="label">
                  اسم العميل <span className="req">*</span>
                </label>
                <input
                  className="input"
                  list="client-list"
                  value={clientName}
                  onChange={(e) => pickClient(e.target.value)}
                  placeholder="اختر أو اكتب اسم العميل"
                />
                <datalist id="client-list">
                  {clients.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="label">
                  الموبايل <span className="req">*</span>
                </label>
                <input
                  className="input input-mono"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="label">مهندس العميل</label>
                <input
                  className="input"
                  value={clientEngineer}
                  onChange={(e) => setClientEngineer(e.target.value)}
                  placeholder="اسم مهندس العميل"
                />
              </div>
              <div>
                <label className="label">
                  المهندس المنفذ <span className="req">*</span>
                </label>
                <select
                  className="select"
                  value={execEngineer}
                  onChange={(e) => setExecEngineer(e.target.value)}
                >
                  {ENGINEERS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 2. Job */}
          <section className="form-section">
            <div className="form-section-header">
              <span className="form-section-num">02</span>
              <div>
                <div className="flex items-center gap-2 font-display text-base font-bold text-white">
                  <Wrench className="h-4 w-4 text-safety" />
                  بيانات الشغلانة
                </div>
                <div className="text-xs text-steel-500">الاسم، النوع، والتشطيب العام</div>
              </div>
            </div>
            <div className="grid-form">
              <div className="sm:col-span-2">
                <label className="label">
                  اسم الشغلانة <span className="req">*</span>
                </label>
                <input
                  className="input"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="مثال: بوابة رئيسية — كمبوند النرجس"
                />
              </div>
              <div>
                <label className="label">نوع المنتج</label>
                <select
                  className="select"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  {PRODUCT_TYPES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">دهان / تشطيب (للشغلانة كلها)</label>
                <div className="flex flex-wrap gap-2">
                  {FINISH_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      className={cn('chip', finish === f.value && 'active')}
                      onClick={() => setFinish(f.value)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Materials / Cut list */}
          <section className="form-section">
            <div className="form-section-header">
              <span className="form-section-num">03</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-display text-base font-bold text-white">
                  <Layers className="h-4 w-4 text-safety" />
                  المواصفات — قائمة القطع
                  <span className="stamp-badge text-steel-400">CUT LIST</span>
                </div>
                <div className="text-xs text-steel-500">
                  أضف أكثر من مادة خام لنفس الشغلانة — الوزن يُحسب تلقائياً
                </div>
              </div>
            </div>

            <div className="mb-4 rounded-xl border border-dashed border-steel-600 bg-steel-950/60 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="label">نوع الخامة</label>
                  <select
                    className="select"
                    value={draft.type}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, type: e.target.value as MaterialType }))
                    }
                  >
                    {MATERIAL_TYPES.map((t) => (
                      <option key={t.type} value={t.type}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">السُمك (مم)</label>
                  <input
                    className="input input-mono"
                    type="number"
                    step="0.1"
                    value={draft.thickness}
                    onChange={(e) => setDraft((d) => ({ ...d, thickness: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">الطول (سم)</label>
                  <input
                    className="input input-mono"
                    type="number"
                    value={draft.length}
                    onChange={(e) => setDraft((d) => ({ ...d, length: e.target.value }))}
                  />
                </div>
                {isSheet(draft.type) && (
                  <div>
                    <label className="label">العرض (سم)</label>
                    <input
                      className="input input-mono"
                      type="number"
                      value={draft.width}
                      onChange={(e) => setDraft((d) => ({ ...d, width: e.target.value }))}
                    />
                  </div>
                )}
                <div>
                  <label className="label">الكمية</label>
                  <input
                    className="input input-mono"
                    type="number"
                    min="1"
                    value={draft.quantity}
                    onChange={(e) => setDraft((d) => ({ ...d, quantity: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <div className="w-full rounded-xl border border-steel-700 bg-steel-850 px-3 py-2.5">
                    <div className="text-[11px] text-steel-500">وزن محسوب</div>
                    <div className="font-mono text-lg font-bold text-safety-bright">
                      {draftPreview.weight.toFixed(2)}{' '}
                      <span className="text-sm text-steel-400">كجم</span>
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" className="btn btn-secondary mt-3 w-full sm:w-auto" onClick={addMaterial}>
                <Plus className="h-5 w-5" />
                إضافة للقائمة
              </button>
            </div>

            {computedMaterials.length === 0 ? (
              <div className="rounded-xl border border-steel-700 bg-steel-950/40 py-8 text-center text-sm text-steel-500">
                لم تُضف خامات بعد — ابدأ بإدخال أول مادة
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mb-1 flex items-center justify-between text-xs text-steel-500">
                  <span className="font-semibold">الخامات المسجّلة</span>
                  <span className="font-mono">{computedMaterials.length} بند</span>
                </div>
                {computedMaterials.map((m, idx) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl border border-steel-700 bg-steel-950/50 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-steel-800 font-mono text-xs font-bold text-safety">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-steel-100">{m.label}</div>
                      <div className="font-mono text-[11px] text-steel-500">
                        {m.thickness}مم · {m.length}سم
                        {isSheet(m.type) ? ` × ${m.width}سم` : ''} · ×{m.quantity}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-mono text-sm font-bold text-safety">
                        {m.weight.toFixed(1)} كجم
                      </div>
                      <div className="font-mono text-[11px] text-steel-500">
                        {m.total.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon text-danger"
                      onClick={() => removeMaterial(m.id)}
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 4. Execution */}
          <section className="form-section">
            <div className="form-section-header">
              <span className="form-section-num">04</span>
              <div>
                <div className="flex items-center gap-2 font-display text-base font-bold text-white">
                  <CalendarDays className="h-4 w-4 text-safety" />
                  بيانات التنفيذ
                </div>
                <div className="text-xs text-steel-500">العمالة والمواعيد</div>
              </div>
            </div>
            <div className="grid-form grid-form-3">
              <div>
                <label className="label">عدد العمال</label>
                <input
                  className="input input-mono"
                  type="number"
                  min="1"
                  value={workers}
                  onChange={(e) => setWorkers(e.target.value)}
                />
              </div>
              <div>
                <label className="label">تاريخ الاستلام</label>
                <input
                  className="input input-mono"
                  type="date"
                  value={receiveDate}
                  onChange={(e) => setReceiveDate(e.target.value)}
                />
              </div>
              <div>
                <label className="label">تاريخ التسليم المتوقع</label>
                <input
                  className="input input-mono"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="label">سعر البيع المقترح (ج.م)</label>
                <input
                  className="input input-mono"
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  placeholder={`مقترح: ${Math.round(costs.totalCost * 1.35).toLocaleString('ar-EG')}`}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn btn-primary btn-lg flex-1" onClick={handleSave}>
              {saved ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  تم حفظ الأوردر
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  حفظ الأوردر
                </>
              )}
            </button>
            <button type="button" className="btn btn-secondary btn-lg">
              مسودة
            </button>
          </div>
        </div>

        {/* Live cost preview */}
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="cost-preview">
            <div className="cost-preview-header">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-safety" />
                <div>
                  <div className="font-display text-sm font-bold text-safety-bright">
                    معاينة التكلفة الحية
                  </div>
                  <div className="font-mono text-[10px] text-steel-500">LIVE COST SHEET</div>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <CostRow label="خامات" value={costs.materialCost} />
              <CostRow label="عمالة" value={costs.laborCost} />
              <CostRow label="تشطيب" value={costs.finishCost} />
              <CostRow label="مصاريف" value={costs.expenses} />
              <div className="border-t border-steel-700 pt-3">
                <CostRow label="إجمالي التكلفة" value={costs.totalCost} bold />
              </div>
              <CostRow label="سعر البيع" value={costs.sell} accent="safety" bold />
              <CostRow
                label="الربح المتوقع"
                value={costs.profit}
                accent={costs.profit >= 0 ? 'success' : 'danger'}
                bold
              />
              <div className="rounded-xl border border-steel-700 bg-steel-950/60 p-3 text-center">
                <div className="text-xs text-steel-500">هامش الربح</div>
                <div
                  className={cn(
                    'font-mono text-3xl font-bold',
                    costs.margin >= 20 ? 'text-success' : costs.margin >= 10 ? 'text-safety' : 'text-danger'
                  )}
                >
                  {costs.margin.toFixed(1)}
                  <span className="text-lg">%</span>
                </div>
              </div>
              <div className="rounded-lg border border-dashed border-steel-600 p-2.5 text-center font-mono text-[11px] text-steel-500">
                وزن إجمالي:{' '}
                <span className="text-steel-200">
                  {computedMaterials.reduce((s, m) => s + m.weight, 0).toFixed(1)} كجم
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CostRow({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: number;
  bold?: boolean;
  accent?: 'safety' | 'success' | 'danger';
}) {
  const color =
    accent === 'safety'
      ? 'text-safety-bright'
      : accent === 'success'
        ? 'text-success'
        : accent === 'danger'
          ? 'text-danger'
          : bold
            ? 'text-white'
            : 'text-steel-200';
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className={cn(bold ? 'font-bold text-steel-200' : 'text-steel-400')}>{label}</span>
      <span className={cn('font-mono', bold && 'text-base font-bold', color)}>
        {value.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م
      </span>
    </div>
  );
}
