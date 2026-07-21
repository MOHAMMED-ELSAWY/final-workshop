import { useState } from 'react';
import { Download, FileSpreadsheet, Users, Package, CheckCircle2, Printer } from 'lucide-react';
import { clients, orders, statusLabel } from '../data/mockData';
import { downloadCSV } from '../lib/utils';

export default function ExportPage() {
  const [done, setDone] = useState<string | null>(null);

  function exportOrders() {
    const rows = [
      [
        'الكود',
        'الشغلانة',
        'العميل',
        'الموبايل',
        'نوع المنتج',
        'التشطيب',
        'المهندس المنفذ',
        'الحالة',
        'تاريخ الاستلام',
        'تاريخ التسليم',
        'عدد العمال',
        'تكلفة الخامة',
        'تكلفة العمالة',
        'تكلفة التشطيب',
        'مصاريف',
        'إجمالي التكلفة',
        'سعر البيع',
        'الربح',
      ],
      ...orders.map((o) => [
        o.code,
        o.jobName,
        o.clientName,
        o.clientPhone,
        o.productType,
        o.finishLabel,
        o.execEngineer,
        statusLabel(o.status),
        o.receiveDate,
        o.deliveryDate,
        String(o.workers),
        String(Math.round(o.materialCost)),
        String(Math.round(o.laborCost)),
        String(Math.round(o.finishCost)),
        String(Math.round(o.expenses)),
        String(Math.round(o.totalCost)),
        String(Math.round(o.sellPrice)),
        String(Math.round(o.profit)),
      ]),
    ];
    downloadCSV(`prismops-orders-${dateStamp()}.csv`, rows);
    flash('orders');
  }

  function exportClients() {
    const rows = [
      [
        'الاسم',
        'الموبايل',
        'الشركة',
        'المهندس',
        'العنوان',
        'عدد الأوردرات',
        'وزن إجمالي (كجم)',
        'نسبة الالتزام %',
        'إجمالي الأرباح',
        'إجمالي الإيراد',
        'عميل منذ',
      ],
      ...clients.map((c) => [
        c.name,
        c.phone,
        c.company || '',
        c.engineer || '',
        c.address || '',
        String(c.ordersCount),
        String(c.totalWeightKg),
        String(c.onTimeRate),
        String(c.totalProfit),
        String(c.totalRevenue),
        c.since,
      ]),
    ];
    downloadCSV(`prismops-clients-${dateStamp()}.csv`, rows);
    flash('clients');
  }

  function exportCostSheet() {
    const rows = [
      ['الكود', 'الشغلانة', 'خامة', 'عمالة', 'تشطيب', 'مصاريف', 'إجمالي', 'بيع', 'ربح', 'هامش %'],
      ...orders.map((o) => {
        const margin = o.sellPrice > 0 ? ((o.profit / o.sellPrice) * 100).toFixed(1) : '0';
        return [
          o.code,
          o.jobName,
          String(Math.round(o.materialCost)),
          String(Math.round(o.laborCost)),
          String(Math.round(o.finishCost)),
          String(Math.round(o.expenses)),
          String(Math.round(o.totalCost)),
          String(Math.round(o.sellPrice)),
          String(Math.round(o.profit)),
          margin,
        ];
      }),
    ];
    downloadCSV(`prismops-costs-${dateStamp()}.csv`, rows);
    flash('costs');
  }

  function flash(key: string) {
    setDone(key);
    setTimeout(() => setDone(null), 2500);
  }

  function dateStamp() {
    return new Date().toISOString().slice(0, 10);
  }

  const cards = [
    {
      key: 'orders',
      title: 'تصدير الأوردرات',
      desc: 'كل الأوردرات مع الحالة، التكاليف، التواريخ، والمهندسين',
      icon: Package,
      meta: `${orders.length} سجل`,
      action: exportOrders,
      accent: 'safety' as const,
    },
    {
      key: 'clients',
      title: 'تصدير العملاء',
      desc: 'بيانات العملاء، الإحصائيات، الالتزام، والأرباح',
      icon: Users,
      meta: `${clients.length} سجل`,
      action: exportClients,
      accent: 'info' as const,
    },
    {
      key: 'costs',
      title: 'تصدير تكلفة الأوردرات',
      desc: 'جدول تكلفة مفصّل (خامة / عمالة / تشطيب / ربح)',
      icon: FileSpreadsheet,
      meta: 'Cost Sheet',
      action: exportCostSheet,
      accent: 'success' as const,
    },
  ];

  const accentStyles = {
    safety: 'from-safety/20 to-transparent border-safety/30 text-safety',
    info: 'from-info/20 to-transparent border-info/30 text-info',
    success: 'from-success/20 to-transparent border-success/30 text-success',
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="lg:hidden">تصدير</h1>
        <p>تحميل ملفات CSV جاهزة للطباعة أو Excel</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-steel-700 bg-steel-900">
        <div className="hazard-stripe h-1.5" />
        <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-safety/15 text-safety">
            <Printer className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">مركز التصدير</h2>
            <p className="mt-0.5 max-w-xl text-sm text-steel-400">
              الملفات تُحمَّل بصيغة CSV مع دعم كامل للعربية (UTF-8 BOM) لتفتح مباشرة في Excel دون
              مشاكل ترميز.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.key}
            className={`card-industrial flex flex-col bg-gradient-to-b p-5 ${accentStyles[c.accent].split(' ').slice(0, 2).join(' ')} border ${accentStyles[c.accent].split(' ').find((x) => x.startsWith('border'))}`}
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-steel-900/60 ${accentStyles[c.accent].split(' ').pop()}`}
            >
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">{c.title}</h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-steel-400">{c.desc}</p>
            <div className="mt-3 mb-4">
              <span className="stamp-badge text-steel-400">{c.meta}</span>
            </div>
            <button className="btn btn-primary w-full" onClick={c.action}>
              {done === c.key ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  تم التحميل
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  تحميل CSV
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="card-industrial p-5">
        <h3 className="section-title mb-3">ملاحظات التصدير</h3>
        <ul className="space-y-2 text-sm text-steel-400">
          <li className="flex gap-2">
            <span className="text-safety">▸</span>
            الأعمدة بالعربية — مناسب للتقارير المحاسبية والإدارة.
          </li>
          <li className="flex gap-2">
            <span className="text-safety">▸</span>
            الأرقام بدون فواصل آلاف لتسهيل الجمع في Excel.
          </li>
          <li className="flex gap-2">
            <span className="text-safety">▸</span>
            يمكن طباعة ملف التكلفة كورقة Cut/Cost List للورشة.
          </li>
        </ul>
      </div>
    </div>
  );
}
