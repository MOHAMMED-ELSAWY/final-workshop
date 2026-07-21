export type OrderStatus = 'new' | 'in_progress' | 'urgent' | 'late' | 'delivered';
export type StageKey = 'receive' | 'prep' | 'cut' | 'weld' | 'paint' | 'deliver';
export type MaterialType =
  | 'sheet_iron'
  | 'sheet_stainless'
  | 'sheet_galvanized'
  | 'sheet_aluminum'
  | 'sheet_copper'
  | 'pipe'
  | 'angle'
  | 'box'
  | 'beam';
export type FinishType = 'powder' | 'oil' | 'galvanize' | 'raw' | 'stainless_polish';

export interface StageProgress {
  key: StageKey;
  label: string;
  status: 'done' | 'current' | 'pending' | 'late';
}

export interface MaterialLine {
  id: string;
  type: MaterialType;
  typeLabel: string;
  thickness?: number;
  length: number;
  width?: number;
  height?: number;
  quantity: number;
  weightKg: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEngineer: string;
  execEngineer: string;
  jobName: string;
  productType: string;
  finish: FinishType;
  finishLabel: string;
  materials: MaterialLine[];
  workers: number;
  receiveDate: string;
  deliveryDate: string;
  status: OrderStatus;
  stages: StageProgress[];
  materialCost: number;
  laborCost: number;
  finishCost: number;
  expenses: number;
  totalCost: number;
  sellPrice: number;
  profit: number;
  notes?: string;
  urgent: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  company?: string;
  engineer?: string;
  address?: string;
  ordersCount: number;
  totalWeightKg: number;
  onTimeRate: number;
  totalProfit: number;
  totalRevenue: number;
  notes: string[];
  since: string;
}

export interface MaterialPrice {
  type: MaterialType;
  label: string;
  unit: string;
  pricePerKg: number;
  density: number;
  updatedAt: string;
}

export const STAGES: { key: StageKey; label: string }[] = [
  { key: 'receive', label: 'استلام' },
  { key: 'prep', label: 'تجهيز خامة' },
  { key: 'cut', label: 'قص وتشكيل' },
  { key: 'weld', label: 'لحام' },
  { key: 'paint', label: 'دهان' },
  { key: 'deliver', label: 'تسليم' },
];

export const MATERIAL_TYPES: { type: MaterialType; label: string; density: number }[] = [
  { type: 'sheet_iron', label: 'صاج حديد', density: 7.85 },
  { type: 'sheet_stainless', label: 'صاج استانلس', density: 8.0 },
  { type: 'sheet_galvanized', label: 'صاج مجلفن', density: 7.85 },
  { type: 'sheet_aluminum', label: 'صاج ألومنيوم', density: 2.7 },
  { type: 'sheet_copper', label: 'صاج نحاس', density: 8.96 },
  { type: 'pipe', label: 'مواسير', density: 7.85 },
  { type: 'angle', label: 'زوايا', density: 7.85 },
  { type: 'box', label: 'علب', density: 7.85 },
  { type: 'beam', label: 'كمر', density: 7.85 },
];

export const FINISH_OPTIONS: { value: FinishType; label: string; priceFactor: number }[] = [
  { value: 'powder', label: 'دهان بودرة', priceFactor: 1.15 },
  { value: 'oil', label: 'دهان زيتي', priceFactor: 1.08 },
  { value: 'galvanize', label: 'جلفنة', priceFactor: 1.25 },
  { value: 'raw', label: 'بدون تشطيب', priceFactor: 1.0 },
  { value: 'stainless_polish', label: 'تلميع استانلس', priceFactor: 1.2 },
];

export const PRODUCT_TYPES = [
  'بوابة',
  'استاند',
  'رفوف',
  'سلم',
  'حاجز',
  'دربزين',
  'هيكل معدني',
  'خزان',
  'أخرى',
];

export const ENGINEERS = [
  'م. أحمد حسن',
  'م. محمد علي',
  'م. كريم نبيل',
  'م. ياسر فؤاد',
  'م. سارة محمود',
];

function makeStages(currentIdx: number, isLate = false): StageProgress[] {
  return STAGES.map((s, i) => ({
    key: s.key,
    label: s.label,
    status:
      i < currentIdx
        ? 'done'
        : i === currentIdx
          ? isLate
            ? 'late'
            : 'current'
          : 'pending',
  }));
}

export const materialPrices: MaterialPrice[] = [
  { type: 'sheet_iron', label: 'صاج حديد', unit: 'جنيه/كجم', pricePerKg: 42, density: 7.85, updatedAt: '2026-03-01' },
  { type: 'sheet_stainless', label: 'صاج استانلس', unit: 'جنيه/كجم', pricePerKg: 145, density: 8.0, updatedAt: '2026-03-01' },
  { type: 'sheet_galvanized', label: 'صاج مجلفن', unit: 'جنيه/كجم', pricePerKg: 52, density: 7.85, updatedAt: '2026-02-28' },
  { type: 'sheet_aluminum', label: 'صاج ألومنيوم', unit: 'جنيه/كجم', pricePerKg: 95, density: 2.7, updatedAt: '2026-03-02' },
  { type: 'sheet_copper', label: 'صاج نحاس', unit: 'جنيه/كجم', pricePerKg: 320, density: 8.96, updatedAt: '2026-02-25' },
  { type: 'pipe', label: 'مواسير', unit: 'جنيه/كجم', pricePerKg: 48, density: 7.85, updatedAt: '2026-03-01' },
  { type: 'angle', label: 'زوايا', unit: 'جنيه/كجم', pricePerKg: 44, density: 7.85, updatedAt: '2026-03-01' },
  { type: 'box', label: 'علب', unit: 'جنيه/كجم', pricePerKg: 46, density: 7.85, updatedAt: '2026-02-27' },
  { type: 'beam', label: 'كمر', unit: 'جنيه/كجم', pricePerKg: 40, density: 7.85, updatedAt: '2026-03-01' },
];

export const clients: Client[] = [
  {
    id: 'c1',
    name: 'شركة النور للمقاولات',
    phone: '01012345678',
    company: 'النور للمقاولات',
    engineer: 'م. حسام الدين',
    address: 'التجمع الخامس، القاهرة',
    ordersCount: 12,
    totalWeightKg: 8450,
    onTimeRate: 92,
    totalProfit: 186500,
    totalRevenue: 920000,
    notes: ['عميل منتظم — دفع آجل 30 يوم', 'يفضّل دهان بودرة أسود مطفي'],
    since: '2023-06-15',
  },
  {
    id: 'c2',
    name: 'مؤسسة البناء الحديث',
    phone: '01198765432',
    company: 'البناء الحديث',
    engineer: 'م. عمرو شريف',
    address: 'مدينة نصر، القاهرة',
    ordersCount: 8,
    totalWeightKg: 5200,
    onTimeRate: 75,
    totalProfit: 98400,
    totalRevenue: 510000,
    notes: ['يطلب معاينة ميدانية قبل التنفيذ'],
    since: '2024-01-20',
  },
  {
    id: 'c3',
    name: 'أحمد عبدالرحمن',
    phone: '01234567890',
    company: 'فردي',
    engineer: '—',
    address: 'المعادي، القاهرة',
    ordersCount: 3,
    totalWeightKg: 980,
    onTimeRate: 100,
    totalProfit: 24500,
    totalRevenue: 87500,
    notes: ['بوابة فيلا سكنية'],
    since: '2025-08-10',
  },
  {
    id: 'c4',
    name: 'مصنع الشرق للأغذية',
    phone: '01555551234',
    company: 'الشرق للأغذية',
    engineer: 'م. نادية كمال',
    address: 'العاشر من رمضان',
    ordersCount: 15,
    totalWeightKg: 12400,
    onTimeRate: 87,
    totalProfit: 312000,
    totalRevenue: 1450000,
    notes: ['عقود صيانة سنوية', 'مواصفات استانلس غذائي فقط'],
    since: '2022-11-03',
  },
  {
    id: 'c5',
    name: 'مكتب إعمار للاستشارات',
    phone: '01099887766',
    company: 'إعمار للاستشارات',
    engineer: 'م. تامر جلال',
    address: 'الشيخ زايد',
    ordersCount: 6,
    totalWeightKg: 3100,
    onTimeRate: 83,
    totalProfit: 67200,
    totalRevenue: 298000,
    notes: [],
    since: '2024-09-01',
  },
  {
    id: 'c6',
    name: 'شركة الأفق العقارية',
    phone: '01122334455',
    company: 'الأفق العقارية',
    engineer: 'م. ليلى سمير',
    address: 'العاصمة الإدارية',
    ordersCount: 9,
    totalWeightKg: 6700,
    onTimeRate: 67,
    totalProfit: 142800,
    totalRevenue: 780000,
    notes: ['مشاريع متعددة المواقع', 'يتأخر أحياناً في اعتماد الرسومات'],
    since: '2023-03-22',
  },
];

export const orders: Order[] = [
  {
    id: 'o1',
    code: 'PO-2026-0142',
    clientId: 'c1',
    clientName: 'شركة النور للمقاولات',
    clientPhone: '01012345678',
    clientEngineer: 'م. حسام الدين',
    execEngineer: 'م. أحمد حسن',
    jobName: 'بوابة رئيسية — كمبوند النرجس',
    productType: 'بوابة',
    finish: 'powder',
    finishLabel: 'دهان بودرة',
    materials: [
      {
        id: 'm1',
        type: 'sheet_iron',
        typeLabel: 'صاج حديد',
        thickness: 3,
        length: 400,
        width: 200,
        quantity: 4,
        weightKg: 188.4,
        unitPrice: 42,
        total: 7912.8,
      },
      {
        id: 'm2',
        type: 'box',
        typeLabel: 'علب',
        thickness: 2,
        length: 600,
        quantity: 12,
        weightKg: 96,
        unitPrice: 46,
        total: 4416,
      },
    ],
    workers: 4,
    receiveDate: '2026-03-05',
    deliveryDate: '2026-03-18',
    status: 'in_progress',
    stages: makeStages(3),
    materialCost: 12328.8,
    laborCost: 4800,
    finishCost: 2100,
    expenses: 650,
    totalCost: 19878.8,
    sellPrice: 28500,
    profit: 8621.2,
    urgent: false,
    createdAt: '2026-03-05',
  },
  {
    id: 'o2',
    code: 'PO-2026-0138',
    clientId: 'c4',
    clientName: 'مصنع الشرق للأغذية',
    clientPhone: '01555551234',
    clientEngineer: 'م. نادية كمال',
    execEngineer: 'م. سارة محمود',
    jobName: 'رفوف استانلس — خط التعبئة',
    productType: 'رفوف',
    finish: 'stainless_polish',
    finishLabel: 'تلميع استانلس',
    materials: [
      {
        id: 'm3',
        type: 'sheet_stainless',
        typeLabel: 'صاج استانلس',
        thickness: 2,
        length: 300,
        width: 150,
        quantity: 8,
        weightKg: 576,
        unitPrice: 145,
        total: 83520,
      },
    ],
    workers: 3,
    receiveDate: '2026-02-28',
    deliveryDate: '2026-03-10',
    status: 'late',
    stages: makeStages(4, true),
    materialCost: 83520,
    laborCost: 7200,
    finishCost: 4800,
    expenses: 1200,
    totalCost: 96720,
    sellPrice: 125000,
    profit: 28280,
    urgent: true,
    createdAt: '2026-02-28',
    notes: 'تأخير بسبب نقص خامة استانلس',
  },
  {
    id: 'o3',
    code: 'PO-2026-0145',
    clientId: 'c2',
    clientName: 'مؤسسة البناء الحديث',
    clientPhone: '01198765432',
    clientEngineer: 'م. عمرو شريف',
    execEngineer: 'م. محمد علي',
    jobName: 'سلالم طوارئ — مبنى إداري',
    productType: 'سلم',
    finish: 'galvanize',
    finishLabel: 'جلفنة',
    materials: [
      {
        id: 'm4',
        type: 'angle',
        typeLabel: 'زوايا',
        thickness: 5,
        length: 600,
        quantity: 40,
        weightKg: 420,
        unitPrice: 44,
        total: 18480,
      },
      {
        id: 'm5',
        type: 'sheet_galvanized',
        typeLabel: 'صاج مجلفن',
        thickness: 2.5,
        length: 200,
        width: 100,
        quantity: 20,
        weightKg: 392.5,
        unitPrice: 52,
        total: 20410,
      },
    ],
    workers: 5,
    receiveDate: '2026-03-08',
    deliveryDate: '2026-03-25',
    status: 'urgent',
    stages: makeStages(1),
    materialCost: 38890,
    laborCost: 9500,
    finishCost: 6200,
    expenses: 1800,
    totalCost: 56390,
    sellPrice: 78000,
    profit: 21610,
    urgent: true,
    createdAt: '2026-03-08',
  },
  {
    id: 'o4',
    code: 'PO-2026-0131',
    clientId: 'c6',
    clientName: 'شركة الأفق العقارية',
    clientPhone: '01122334455',
    clientEngineer: 'م. ليلى سمير',
    execEngineer: 'م. كريم نبيل',
    jobName: 'حواجز شرفات — برج A',
    productType: 'حاجز',
    finish: 'powder',
    finishLabel: 'دهان بودرة',
    materials: [
      {
        id: 'm6',
        type: 'pipe',
        typeLabel: 'مواسير',
        thickness: 2,
        length: 600,
        quantity: 80,
        weightKg: 640,
        unitPrice: 48,
        total: 30720,
      },
    ],
    workers: 6,
    receiveDate: '2026-02-15',
    deliveryDate: '2026-03-01',
    status: 'delivered',
    stages: makeStages(6),
    materialCost: 30720,
    laborCost: 12000,
    finishCost: 5400,
    expenses: 2100,
    totalCost: 50220,
    sellPrice: 72000,
    profit: 21780,
    urgent: false,
    createdAt: '2026-02-15',
  },
  {
    id: 'o5',
    code: 'PO-2026-0148',
    clientId: 'c3',
    clientName: 'أحمد عبدالرحمن',
    clientPhone: '01234567890',
    clientEngineer: '—',
    execEngineer: 'م. ياسر فؤاد',
    jobName: 'بوابة فيلا + دربزين',
    productType: 'بوابة',
    finish: 'oil',
    finishLabel: 'دهان زيتي',
    materials: [
      {
        id: 'm7',
        type: 'sheet_iron',
        typeLabel: 'صاج حديد',
        thickness: 2,
        length: 350,
        width: 180,
        quantity: 2,
        weightKg: 98.9,
        unitPrice: 42,
        total: 4153.8,
      },
      {
        id: 'm8',
        type: 'pipe',
        typeLabel: 'مواسير',
        thickness: 1.5,
        length: 400,
        quantity: 15,
        weightKg: 72,
        unitPrice: 48,
        total: 3456,
      },
    ],
    workers: 2,
    receiveDate: '2026-03-10',
    deliveryDate: '2026-03-22',
    status: 'new',
    stages: makeStages(0),
    materialCost: 7609.8,
    laborCost: 2800,
    finishCost: 950,
    expenses: 300,
    totalCost: 11659.8,
    sellPrice: 18500,
    profit: 6840.2,
    urgent: false,
    createdAt: '2026-03-10',
  },
  {
    id: 'o6',
    code: 'PO-2026-0140',
    clientId: 'c5',
    clientName: 'مكتب إعمار للاستشارات',
    clientPhone: '01099887766',
    clientEngineer: 'م. تامر جلال',
    execEngineer: 'م. أحمد حسن',
    jobName: 'استاندات عرض — معرض',
    productType: 'استاند',
    finish: 'powder',
    finishLabel: 'دهان بودرة',
    materials: [
      {
        id: 'm9',
        type: 'box',
        typeLabel: 'علب',
        thickness: 1.5,
        length: 300,
        quantity: 30,
        weightKg: 85.5,
        unitPrice: 46,
        total: 3933,
      },
      {
        id: 'm10',
        type: 'sheet_aluminum',
        typeLabel: 'صاج ألومنيوم',
        thickness: 1.5,
        length: 200,
        width: 100,
        quantity: 10,
        weightKg: 81,
        unitPrice: 95,
        total: 7695,
      },
    ],
    workers: 3,
    receiveDate: '2026-03-01',
    deliveryDate: '2026-03-12',
    status: 'late',
    stages: makeStages(2, true),
    materialCost: 11628,
    laborCost: 3600,
    finishCost: 1800,
    expenses: 450,
    totalCost: 17478,
    sellPrice: 26000,
    profit: 8522,
    urgent: true,
    createdAt: '2026-03-01',
  },
  {
    id: 'o7',
    code: 'PO-2026-0135',
    clientId: 'c1',
    clientName: 'شركة النور للمقاولات',
    clientPhone: '01012345678',
    clientEngineer: 'م. حسام الدين',
    execEngineer: 'م. محمد علي',
    jobName: 'هيكل معدني — مخزن',
    productType: 'هيكل معدني',
    finish: 'raw',
    finishLabel: 'بدون تشطيب',
    materials: [
      {
        id: 'm11',
        type: 'beam',
        typeLabel: 'كمر',
        thickness: 8,
        length: 1200,
        quantity: 24,
        weightKg: 2880,
        unitPrice: 40,
        total: 115200,
      },
    ],
    workers: 8,
    receiveDate: '2026-02-10',
    deliveryDate: '2026-02-28',
    status: 'delivered',
    stages: makeStages(6),
    materialCost: 115200,
    laborCost: 22000,
    finishCost: 0,
    expenses: 4500,
    totalCost: 141700,
    sellPrice: 195000,
    profit: 53300,
    urgent: false,
    createdAt: '2026-02-10',
  },
  {
    id: 'o8',
    code: 'PO-2026-0149',
    clientId: 'c4',
    clientName: 'مصنع الشرق للأغذية',
    clientPhone: '01555551234',
    clientEngineer: 'م. نادية كمال',
    execEngineer: 'م. سارة محمود',
    jobName: 'خزان استانلس 2000 لتر',
    productType: 'خزان',
    finish: 'stainless_polish',
    finishLabel: 'تلميع استانلس',
    materials: [
      {
        id: 'm12',
        type: 'sheet_stainless',
        typeLabel: 'صاج استانلس',
        thickness: 3,
        length: 250,
        width: 250,
        quantity: 6,
        weightKg: 900,
        unitPrice: 145,
        total: 130500,
      },
    ],
    workers: 4,
    receiveDate: '2026-03-11',
    deliveryDate: '2026-03-28',
    status: 'in_progress',
    stages: makeStages(2),
    materialCost: 130500,
    laborCost: 15000,
    finishCost: 8500,
    expenses: 2200,
    totalCost: 156200,
    sellPrice: 210000,
    profit: 53800,
    urgent: false,
    createdAt: '2026-03-11',
  },
];

export const kpiData = {
  totalOrders: { value: 48, delta: 12.5, up: true },
  inProgress: { value: 14, delta: 8.2, up: true },
  late: { value: 5, delta: 16.7, up: false },
  delivered: { value: 29, delta: 18.0, up: true },
  clients: { value: 22, delta: 4.8, up: true },
};

export const lateAlerts = [
  {
    id: 'a1',
    orderCode: 'PO-2026-0138',
    jobName: 'رفوف استانلس — خط التعبئة',
    clientName: 'مصنع الشرق للأغذية',
    daysLate: 4,
    stage: 'دهان',
    engineer: 'م. سارة محمود',
  },
  {
    id: 'a2',
    orderCode: 'PO-2026-0140',
    jobName: 'استاندات عرض — معرض',
    clientName: 'مكتب إعمار للاستشارات',
    daysLate: 2,
    stage: 'قص وتشكيل',
    engineer: 'م. أحمد حسن',
  },
  {
    id: 'a3',
    orderCode: 'PO-2026-0129',
    jobName: 'دربزين سطح — فيلا',
    clientName: 'شركة الأفق العقارية',
    daysLate: 7,
    stage: 'لحام',
    engineer: 'م. كريم نبيل',
  },
];

export function statusLabel(s: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    new: 'جديد',
    in_progress: 'جاري التنفيذ',
    urgent: 'عاجل',
    late: 'متأخر',
    delivered: 'تم التسليم',
  };
  return map[s];
}

export function statusPillClass(s: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    new: 'pill pill-dot pill-new',
    in_progress: 'pill pill-dot pill-progress',
    urgent: 'pill pill-dot pill-urgent',
    late: 'pill pill-dot pill-late',
    delivered: 'pill pill-dot pill-done',
  };
  return map[s];
}

export function formatEGP(n: number): string {
  return (
    new Intl.NumberFormat('ar-EG', {
      maximumFractionDigits: 0,
    }).format(Math.round(n)) + ' ج.م'
  );
}

export function formatNum(n: number, digits = 1): string {
  return new Intl.NumberFormat('ar-EG', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(n);
}

export function formatDate(d: string): string {
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(d));
  } catch {
    return d;
  }
}

export function calcSheetWeight(
  density: number,
  thicknessMm: number,
  lengthCm: number,
  widthCm: number,
  qty: number
): number {
  // kg = density(g/cm3) * L(cm) * W(cm) * T(cm) * qty / 1000
  const tCm = thicknessMm / 10;
  return (density * lengthCm * widthCm * tCm * qty) / 1000;
}

export function calcLinearWeight(
  density: number,
  thicknessMm: number,
  lengthCm: number,
  qty: number,
  approxSectionCm2 = 8
): number {
  // approximate for pipes/angles/boxes using section area proxy
  const tFactor = Math.max(thicknessMm / 2, 0.5);
  return (density * lengthCm * approxSectionCm2 * tFactor * qty) / 1000 / 10;
}
