import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Search,
  Phone,
  MapPin,
  Building2,
  Package,
  Weight,
  Target,
  TrendingUp,
  ArrowRight,
  StickyNote,
  Calendar,
} from 'lucide-react';
import {
  clients,
  orders,
  formatDate,
  formatEGP,
  formatNum,
  statusLabel,
  statusPillClass,
} from '../data/mockData';
import StageBar from '../components/StageBar';

export default function Clients() {
  const { id } = useParams();
  if (id) return <ClientDetail id={id} />;
  return <ClientsGrid />;
}

function ClientsGrid() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const qq = q.trim();
    if (!qq) return clients;
    return clients.filter(
      (c) =>
        c.name.includes(qq) ||
        c.phone.includes(qq) ||
        (c.company && c.company.includes(qq))
    );
  }, [q]);

  return (
    <div className="space-y-5">
      <div className="page-header flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="lg:hidden">العملاء</h1>
          <p>سجل العملاء وإحصائيات الالتزام والأرباح</p>
        </div>
        <div className="font-mono text-sm text-steel-500">
          <span className="text-safety-bright">{filtered.length}</span> عميل
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-500" />
        <input
          className="input pr-11"
          placeholder="بحث بالاسم، الشركة، أو الموبايل..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <article
            key={c.id}
            onClick={() => navigate(`/clients/${c.id}`)}
            className="card-industrial cursor-pointer p-5 transition hover:border-safety/40"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-steel-700 to-steel-800 font-display text-lg font-bold text-safety">
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-base font-bold text-white">{c.name}</h3>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-steel-400">
                  <Building2 className="h-3.5 w-3.5" />
                  {c.company || '—'}
                </div>
              </div>
            </div>

            <div className="mb-4 space-y-1.5 text-sm text-steel-400">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-steel-500" />
                <span className="font-mono" dir="ltr">
                  {c.phone}
                </span>
              </div>
              {c.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-steel-500" />
                  <span className="truncate">{c.address}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-steel-700 pt-3">
              <div className="rounded-lg bg-steel-950/50 p-2.5">
                <div className="text-[10px] text-steel-500">أوردرات</div>
                <div className="font-mono text-lg font-bold text-white">{c.ordersCount}</div>
              </div>
              <div className="rounded-lg bg-steel-950/50 p-2.5">
                <div className="text-[10px] text-steel-500">التزام</div>
                <div
                  className={`font-mono text-lg font-bold ${
                    c.onTimeRate >= 85 ? 'text-success' : c.onTimeRate >= 70 ? 'text-safety' : 'text-danger'
                  }`}
                >
                  {c.onTimeRate}%
                </div>
              </div>
              <div className="rounded-lg bg-steel-950/50 p-2.5">
                <div className="text-[10px] text-steel-500">وزن إجمالي</div>
                <div className="font-mono text-sm font-bold text-steel-200">
                  {formatNum(c.totalWeightKg, 0)} كجم
                </div>
              </div>
              <div className="rounded-lg bg-steel-950/50 p-2.5">
                <div className="text-[10px] text-steel-500">أرباح</div>
                <div className="font-mono text-sm font-bold text-success">
                  {formatEGP(c.totalProfit)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ClientDetail({ id }: { id: string }) {
  const client = clients.find((c) => c.id === id);
  const clientOrders = orders.filter((o) => o.clientId === id);

  if (!client) {
    return (
      <div className="empty-state card-industrial">
        <div className="font-display text-lg">العميل غير موجود</div>
        <Link to="/clients" className="btn btn-secondary mt-4">
          العودة للعملاء
        </Link>
      </div>
    );
  }

  const stats = [
    {
      label: 'عدد الأوردرات',
      value: String(client.ordersCount),
      icon: Package,
      color: 'text-safety',
      bg: 'bg-safety/15',
    },
    {
      label: 'وزن إجمالي',
      value: `${formatNum(client.totalWeightKg, 0)} كجم`,
      icon: Weight,
      color: 'text-info',
      bg: 'bg-info/15',
    },
    {
      label: 'الالتزام بالمواعيد',
      value: `${client.onTimeRate}%`,
      icon: Target,
      color: client.onTimeRate >= 85 ? 'text-success' : 'text-warning',
      bg: client.onTimeRate >= 85 ? 'bg-success/15' : 'bg-warning/15',
    },
    {
      label: 'إجمالي الأرباح',
      value: formatEGP(client.totalProfit),
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/15',
    },
  ];

  return (
    <div className="space-y-6">
      <Link to="/clients" className="btn btn-ghost btn-sm -mr-2 w-fit">
        <ArrowRight className="h-4 w-4" />
        كل العملاء
      </Link>

      {/* Header card */}
      <div className="card-industrial overflow-hidden">
        <div className="hazard-stripe h-1.5" />
        <div className="flex flex-wrap items-start gap-4 p-5 sm:p-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-safety/30 to-safety/10 font-display text-2xl font-extrabold text-safety-bright ring-2 ring-safety/40">
            {client.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold text-white">{client.name}</h1>
              <span className="stamp-badge text-steel-400">CLIENT</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-steel-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {client.company}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                <span className="font-mono" dir="ltr">
                  {client.phone}
                </span>
              </span>
              {client.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {client.address}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                عميل منذ {formatDate(client.since)}
              </span>
            </div>
            {client.engineer && client.engineer !== '—' && (
              <div className="mt-2 text-sm text-steel-300">
                مهندس العميل: <span className="font-semibold">{client.engineer}</span>
              </div>
            )}
          </div>
          <div className="rounded-xl border border-steel-700 bg-steel-950/50 px-4 py-3 text-left">
            <div className="text-[11px] text-steel-500">إجمالي الإيراد</div>
            <div className="font-mono text-xl font-bold text-safety-bright">
              {formatEGP(client.totalRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-industrial p-4">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className={`font-mono text-xl font-bold sm:text-2xl ${s.color}`}>{s.value}</div>
            <div className="mt-1 text-xs font-semibold text-steel-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders history */}
        <section className="lg:col-span-2">
          <h2 className="section-title mb-3">سجل الأوردرات</h2>
          {clientOrders.length === 0 ? (
            <div className="card-industrial empty-state py-10">
              <p>لا توجد أوردرات مسجّلة لهذا العميل في البيانات الحالية</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clientOrders.map((o) => (
                <div key={o.id} className="card-industrial p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="stamp-badge text-safety">{o.code}</span>
                      <span className={statusPillClass(o.status)}>{statusLabel(o.status)}</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-safety-bright">
                      {formatEGP(o.sellPrice)}
                    </span>
                  </div>
                  <div className="font-semibold text-white">{o.jobName}</div>
                  <div className="mt-0.5 text-sm text-steel-400">
                    {o.productType} · {o.execEngineer}
                  </div>
                  <div className="mt-3">
                    <StageBar stages={o.stages} showLabels />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[11px] text-steel-500">
                    <span>استلام {formatDate(o.receiveDate)}</span>
                    <span>تسليم {formatDate(o.deliveryDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notes */}
        <section>
          <h2 className="section-title mb-3">ملاحظات</h2>
          <div className="card-industrial p-4">
            {client.notes.length === 0 ? (
              <div className="py-6 text-center text-sm text-steel-500">لا توجد ملاحظات</div>
            ) : (
              <ul className="space-y-3">
                {client.notes.map((n, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-xl border border-steel-700 bg-steel-950/40 p-3 text-sm text-steel-300"
                  >
                    <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-safety" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn btn-secondary mt-4 w-full btn-sm">+ إضافة ملاحظة</button>
          </div>

          {/* Quality cert stamp decorative */}
          <div className="mt-4 overflow-hidden rounded-xl border border-steel-700 bg-steel-900">
            <div className="hazard-stripe h-1" />
            <div className="p-4 text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-safety/50 font-mono text-[10px] font-bold leading-tight text-safety">
                QC
                <br />
                OK
              </div>
              <div className="font-display text-sm font-bold text-steel-300">بطاقة جودة العميل</div>
              <div className="mt-1 font-mono text-[11px] text-steel-500">
                تقييم الالتزام {client.onTimeRate}/100
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
