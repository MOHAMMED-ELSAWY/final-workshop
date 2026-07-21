import {
  Package,
  Loader,
  AlertTriangle,
  CheckCircle2,
  Users,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import KpiCard from '../components/KpiCard';
import StageBar from '../components/StageBar';
import {
  kpiData,
  lateAlerts,
  orders,
  formatDate,
  formatEGP,
  statusLabel,
  statusPillClass,
} from '../data/mockData';

export default function Dashboard() {
  const recent = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-wrap items-end justify-between gap-3 lg:hidden">
        <div>
          <h1>لوحة التحكم</h1>
          <p>نظرة عامة على الورشة اليوم</p>
        </div>
        <Link to="/orders/new" className="btn btn-primary btn-sm">
          + أوردر جديد
        </Link>
      </div>

      {/* Workshop banner */}
      <div className="relative overflow-hidden rounded-2xl border border-steel-700 bg-gradient-to-l from-steel-900 via-steel-850 to-steel-900">
        <div className="hazard-stripe absolute inset-x-0 top-0 h-1.5" />
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="stamp-badge text-safety-bright">وردية نشطة</span>
              <span className="font-mono text-xs text-steel-500">
                {new Intl.DateTimeFormat('ar-EG', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                }).format(new Date())}
              </span>
            </div>
            <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
              مرحباً، جاهزين للشغل؟
            </h2>
            <p className="mt-1 text-sm text-steel-400">
              {kpiData.inProgress.value} أوردر قيد التنفيذ · {kpiData.late.value} متأخر يحتاج متابعة
            </p>
          </div>
          <Link to="/orders/new" className="btn btn-primary hidden sm:inline-flex">
            <Package className="h-5 w-5" />
            أوردر جديد
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-kpi">
        <KpiCard
          label="إجمالي الأوردرات"
          value={kpiData.totalOrders.value}
          delta={kpiData.totalOrders.delta}
          up={kpiData.totalOrders.up}
          icon={Package}
          accent="safety"
        />
        <KpiCard
          label="قيد التنفيذ"
          value={kpiData.inProgress.value}
          delta={kpiData.inProgress.delta}
          up={kpiData.inProgress.up}
          icon={Loader}
          accent="warning"
        />
        <KpiCard
          label="متأخرة"
          value={kpiData.late.value}
          delta={kpiData.late.delta}
          up={kpiData.late.up}
          icon={AlertTriangle}
          accent="danger"
          invertDelta
        />
        <KpiCard
          label="تم التسليم"
          value={kpiData.delivered.value}
          delta={kpiData.delivered.delta}
          up={kpiData.delivered.up}
          icon={CheckCircle2}
          accent="success"
        />
        <KpiCard
          label="عدد العملاء"
          value={kpiData.clients.value}
          delta={kpiData.clients.delta}
          up={kpiData.clients.up}
          icon={Users}
          accent="info"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Recent orders */}
        <section className="xl:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">أحدث الأوردرات</h2>
            <Link to="/orders" className="btn btn-ghost btn-sm text-safety">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="card-industrial overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>الكود</th>
                    <th>الشغلانة</th>
                    <th>العميل</th>
                    <th>الحالة</th>
                    <th>التسليم</th>
                    <th>القيمة</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <span className="font-mono text-xs font-semibold text-safety">{o.code}</span>
                      </td>
                      <td>
                        <div className="max-w-[180px]">
                          <div className="truncate font-semibold text-steel-100">{o.jobName}</div>
                          <div className="mt-1.5">
                            <StageBar stages={o.stages} compact />
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{o.clientName}</td>
                      <td>
                        <span className={statusPillClass(o.status)}>{statusLabel(o.status)}</span>
                      </td>
                      <td className="font-mono text-xs">{formatDate(o.deliveryDate)}</td>
                      <td className="font-mono text-sm font-semibold text-steel-100">
                        {formatEGP(o.sellPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="divide-y divide-steel-800 md:hidden">
              {recent.map((o) => (
                <Link key={o.id} to="/orders" className="block p-4 transition hover:bg-steel-850">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-safety">{o.code}</span>
                    <span className={statusPillClass(o.status)}>{statusLabel(o.status)}</span>
                  </div>
                  <div className="font-semibold text-white">{o.jobName}</div>
                  <div className="mt-0.5 text-sm text-steel-400">{o.clientName}</div>
                  <div className="mt-2">
                    <StageBar stages={o.stages} compact />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-xs text-steel-500">
                    <span>{formatDate(o.deliveryDate)}</span>
                    <span className="text-safety-bright">{formatEGP(o.sellPrice)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Late alerts */}
        <section className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">تنبيهات التأخير</h2>
            <span className="pill pill-late">{lateAlerts.length} تنبيه</span>
          </div>

          <div className="space-y-3">
            {lateAlerts.map((a) => (
              <div
                key={a.id}
                className="card-industrial border-danger/25 p-4 alert-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="stamp-badge text-danger">{a.orderCode}</span>
                      <span className="pill pill-late font-mono">+{a.daysLate} يوم</span>
                    </div>
                    <div className="font-semibold text-white">{a.jobName}</div>
                    <div className="mt-0.5 text-sm text-steel-400">{a.clientName}</div>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-steel-500">
                      <span>
                        المرحلة: <span className="text-warning">{a.stage}</span>
                      </span>
                      <span>{a.engineer}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick safety tip */}
          <div className="mt-4 overflow-hidden rounded-xl border border-safety/25 bg-safety/5">
            <div className="hazard-stripe h-1.5" />
            <div className="p-4">
              <div className="font-display text-sm font-bold text-safety-bright">لوحة السلامة</div>
              <p className="mt-1 text-xs leading-relaxed text-steel-400">
                تأكد من مراجعة أوامر القص (Cut List) قبل بدء الوردية. ارتدِ مهمات الوقاية عند اللحام والقص.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
