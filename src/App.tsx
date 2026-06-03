import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowDownToLine,
  BarChart3,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Download,
  Filter,
  Landmark,
  LineChart,
  Package,
  ReceiptText,
  RefreshCw,
  Search,
  ShoppingBag,
  Store,
  TicketCheck,
  Wallet,
} from 'lucide-react';

import { cn } from './types';

type Period = 'today' | 'week' | 'month' | 'custom';
type StoreId = 'all' | 'north' | 'river' | 'east';
type Tab = 'project' | 'source' | 'payment' | 'store';
type Project = 'venue' | 'storedCard' | 'courseCard' | 'passCard' | 'goods';
type Source = 'miniProgram' | 'cashier' | 'meituan' | 'douyin';
type Payment = 'wechat' | 'payCode' | 'storedBalance' | 'offline' | 'corporate' | 'free' | 'meituanGroup' | 'douyinGroup';

type RevenueOrder = {
  id: string;
  store: Exclude<StoreId, 'all'>;
  project: Project;
  source: Source;
  payment: Payment;
  receivable: number;
  discount: number;
  paid: number;
  orders: number;
  dateBucket: 'today' | 'week' | 'month';
};

const stores = [
  { id: 'all', name: '全部门店' },
  { id: 'north', name: '湖滨旗舰馆' },
  { id: 'river', name: '江湾训练馆' },
  { id: 'east', name: '东城综合馆' },
] satisfies { id: StoreId; name: string }[];

const periods = [
  { id: 'today', name: '本日', range: '2026-06-03' },
  { id: 'week', name: '本周', range: '2026-06-01 至 2026-06-07' },
  { id: 'month', name: '本月', range: '2026-06-01 至 2026-06-30' },
  { id: 'custom', name: '自定义', range: '2026-05-24 至 2026-06-03' },
] satisfies { id: Period; name: string; range: string }[];

const projectMeta: Record<Project, { name: string; short: string; color: string; icon: typeof Store }> = {
  venue: { name: '场地预订', short: '场地', color: 'bg-cyan-500', icon: CalendarDays },
  storedCard: { name: '储值卡销售', short: '储值卡', color: 'bg-emerald-500', icon: Wallet },
  courseCard: { name: '课程卡销售', short: '课程卡', color: 'bg-indigo-500', icon: TicketCheck },
  passCard: { name: '次卡 / 时间卡销售', short: '次卡时间卡', color: 'bg-amber-500', icon: CreditCard },
  goods: { name: '商品销售（含直接收款）', short: '商品/直接收款', color: 'bg-rose-500', icon: ShoppingBag },
};

const sourceMeta: Record<Source, { name: string; tag?: string; color: string }> = {
  miniProgram: { name: '小程序', color: 'bg-green-500' },
  cashier: { name: '收银台', color: 'bg-slate-700' },
  meituan: { name: '美团核销', tag: '第三方团购', color: 'bg-yellow-500' },
  douyin: { name: '抖音核销', tag: '第三方团购', color: 'bg-fuchsia-500' },
};

const paymentMeta: Record<Payment, { name: string; revenue: boolean; note: string; icon: typeof Wallet }> = {
  wechat: { name: '微信支付', revenue: true, note: '线上直收', icon: Wallet },
  payCode: { name: '付款码支付', revenue: true, note: '收银台扫码', icon: ReceiptText },
  storedBalance: { name: '储值卡支付', revenue: false, note: '余额消耗，不重复计入营收', icon: CreditCard },
  offline: { name: '线下付款', revenue: true, note: '现金或其他线下确认', icon: Store },
  corporate: { name: '对公收款', revenue: true, note: '当日确认收款', icon: Landmark },
  free: { name: '无需支付', revenue: false, note: '金额为 0，保留订单数', icon: CircleDollarSign },
  meituanGroup: { name: '美团核销实付', revenue: true, note: '第三方团购', icon: TicketCheck },
  douyinGroup: { name: '抖音核销实付', revenue: true, note: '第三方团购', icon: TicketCheck },
};

const orders: RevenueOrder[] = [
  { id: 'R001', store: 'north', project: 'venue', source: 'miniProgram', payment: 'wechat', receivable: 16800, discount: 920, paid: 15880, orders: 79, dateBucket: 'today' },
  { id: 'R002', store: 'north', project: 'venue', source: 'cashier', payment: 'storedBalance', receivable: 8200, discount: 240, paid: 7960, orders: 31, dateBucket: 'today' },
  { id: 'R003', store: 'north', project: 'storedCard', source: 'cashier', payment: 'payCode', receivable: 24000, discount: 1600, paid: 22400, orders: 18, dateBucket: 'today' },
  { id: 'R004', store: 'river', project: 'courseCard', source: 'miniProgram', payment: 'wechat', receivable: 18600, discount: 1200, paid: 17400, orders: 15, dateBucket: 'today' },
  { id: 'R005', store: 'river', project: 'passCard', source: 'cashier', payment: 'offline', receivable: 12800, discount: 560, paid: 12240, orders: 26, dateBucket: 'today' },
  { id: 'R006', store: 'east', project: 'goods', source: 'cashier', payment: 'payCode', receivable: 6200, discount: 180, paid: 6020, orders: 96, dateBucket: 'today' },
  { id: 'R007', store: 'east', project: 'goods', source: 'cashier', payment: 'offline', receivable: 2380, discount: 0, paid: 2380, orders: 34, dateBucket: 'today' },
  { id: 'R008', store: 'north', project: 'venue', source: 'meituan', payment: 'meituanGroup', receivable: 9400, discount: 700, paid: 8700, orders: 44, dateBucket: 'today' },
  { id: 'R009', store: 'river', project: 'venue', source: 'douyin', payment: 'douyinGroup', receivable: 7600, discount: 520, paid: 7080, orders: 39, dateBucket: 'today' },
  { id: 'R010', store: 'east', project: 'courseCard', source: 'cashier', payment: 'corporate', receivable: 22000, discount: 2000, paid: 20000, orders: 3, dateBucket: 'today' },
  { id: 'R011', store: 'north', project: 'passCard', source: 'miniProgram', payment: 'free', receivable: 1200, discount: 1200, paid: 0, orders: 6, dateBucket: 'today' },
  { id: 'W001', store: 'north', project: 'venue', source: 'miniProgram', payment: 'wechat', receivable: 68600, discount: 4200, paid: 64400, orders: 318, dateBucket: 'week' },
  { id: 'W002', store: 'river', project: 'storedCard', source: 'cashier', payment: 'payCode', receivable: 82000, discount: 5600, paid: 76400, orders: 55, dateBucket: 'week' },
  { id: 'W003', store: 'east', project: 'goods', source: 'cashier', payment: 'offline', receivable: 21400, discount: 640, paid: 20760, orders: 302, dateBucket: 'week' },
  { id: 'W004', store: 'river', project: 'courseCard', source: 'douyin', payment: 'douyinGroup', receivable: 34600, discount: 2600, paid: 32000, orders: 128, dateBucket: 'week' },
  { id: 'W005', store: 'north', project: 'venue', source: 'meituan', payment: 'meituanGroup', receivable: 29600, discount: 1800, paid: 27800, orders: 116, dateBucket: 'week' },
  { id: 'M001', store: 'north', project: 'venue', source: 'cashier', payment: 'storedBalance', receivable: 144000, discount: 6200, paid: 137800, orders: 472, dateBucket: 'month' },
  { id: 'M002', store: 'river', project: 'courseCard', source: 'miniProgram', payment: 'wechat', receivable: 210000, discount: 13000, paid: 197000, orders: 160, dateBucket: 'month' },
  { id: 'M003', store: 'east', project: 'storedCard', source: 'cashier', payment: 'corporate', receivable: 188000, discount: 11200, paid: 176800, orders: 86, dateBucket: 'month' },
  { id: 'M004', store: 'east', project: 'passCard', source: 'miniProgram', payment: 'wechat', receivable: 118000, discount: 7800, paid: 110200, orders: 264, dateBucket: 'month' },
  { id: 'M005', store: 'north', project: 'goods', source: 'cashier', payment: 'payCode', receivable: 39000, discount: 1100, paid: 37900, orders: 691, dateBucket: 'month' },
  { id: 'M006', store: 'river', project: 'venue', source: 'meituan', payment: 'meituanGroup', receivable: 76000, discount: 5200, paid: 70800, orders: 298, dateBucket: 'month' },
  { id: 'M007', store: 'east', project: 'venue', source: 'douyin', payment: 'douyinGroup', receivable: 62000, discount: 4200, paid: 57800, orders: 233, dateBucket: 'month' },
];

const trend = [
  { label: '05-29', sales: 69300, revenue: 58200, stored: 11100 },
  { label: '05-30', sales: 74500, revenue: 64200, stored: 10300 },
  { label: '05-31', sales: 81900, revenue: 70900, stored: 11000 },
  { label: '06-01', sales: 92600, revenue: 78500, stored: 14100 },
  { label: '06-02', sales: 98400, revenue: 83900, stored: 14500 },
  { label: '06-03', sales: 112240, revenue: 104280, stored: 7960 },
];

function App() {
  const [period, setPeriod] = useState<Period>('today');
  const [store, setStore] = useState<StoreId>('all');
  const [tab, setTab] = useState<Tab>('project');

  const filteredOrders = useMemo(() => {
    const bucket = period === 'custom' ? ['today', 'week'] : [period];
    return orders.filter((order) => bucket.includes(order.dateBucket) && (store === 'all' || order.store === store));
  }, [period, store]);

  const totals = useMemo(() => summarize(filteredOrders), [filteredOrders]);
  const projectRows = useMemo(() => groupBy(filteredOrders, 'project'), [filteredOrders]);
  const sourceRows = useMemo(() => groupBy(filteredOrders, 'source'), [filteredOrders]);
  const paymentRows = useMemo(() => groupBy(filteredOrders, 'payment'), [filteredOrders]);
  const storeRows = useMemo(() => groupBy(filteredOrders, 'store'), [filteredOrders]);
  const activePeriod = periods.find((item) => item.id === period)!;

  return (
    <div className="min-h-screen bg-[#f3f6f4] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
            <Building2 size={21} />
          </div>
          <div>
            <div className="text-base font-black">卡猫数字场馆</div>
            <div className="text-xs font-semibold text-slate-500">经营收款看板</div>
          </div>
        </div>
        <nav className="px-3 py-4">
          {[
            ['营收看板', BarChart3],
            ['订单管理', ReceiptText],
            ['会员与卡项', Wallet],
            ['商品库存', Package],
          ].map(([label, Icon], index) => (
            <button key={label as string} className={cn('mb-1 flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-bold', index === 0 ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100')}>
              <Icon size={18} />
              {label as string}
            </button>
          ))}
        </nav>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Store size={14} />
                管理后台 / 营收分析
              </div>
              <h1 className="mt-1 text-xl font-black text-slate-950">收入分析看板</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <IconAction label="刷新">
                <RefreshCw size={17} />
              </IconAction>
              <IconAction label="导出">
                <Download size={17} />
              </IconAction>
            </div>
          </div>
        </header>

        <section className="px-4 py-4 lg:px-6">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
            <Segmented value={period} onChange={setPeriod} />
            <SelectBox icon={Building2} value={store} onChange={(value) => setStore(value as StoreId)} options={stores} />
            <button className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
              <Filter size={16} />
              更多筛选
              <ChevronDown size={15} />
            </button>
            <div className="ml-auto flex h-10 min-w-64 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-500">
              <Search size={16} />
              搜索订单号、门店、项目
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="font-semibold text-slate-500">统计区间：{activePeriod.range}，仅统计支付成功 / 核销完成订单，不含退款、撤单、作废订单。</div>
            <div className="rounded-md bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
              实际营收 = 总销售额 - 储值卡支付；美团/抖音计入实际营收并标注第三方团购。
            </div>
          </div>

          <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <MetricCard title="实际营收" value={money(totals.actualRevenue)} helper="真实新增收入" accent="bg-slate-950 text-white" large />
            <MetricCard title="总销售额" value={money(totals.sales)} helper="含储值卡销售与余额消费" />
            <MetricCard title="储值卡支付" value={money(totals.storedBalance)} helper="余额消耗，不重复计入营收" />
            <MetricCard title="应收金额" value={money(totals.receivable)} helper="支付前应收" />
            <MetricCard title="优惠金额" value={money(totals.discount)} helper="不拆优惠类型" />
            <MetricCard title="订单数" value={`${totals.orders}`} helper={`客单价 ${money(totals.orders ? totals.sales / totals.orders : 0)}`} />
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <Panel title="营收趋势" icon={LineChart} action="按日展示">
              <TrendChart />
            </Panel>
            <Panel title="关键口径" icon={ReceiptText} action="原型说明">
              <div className="space-y-3 text-sm">
                <Definition label="储值卡充值营收" value={`${money(totals.storedCardRevenue)}，按实收金额计算，不按面值。`} />
                <Definition label="美团核销实付" value={`${money(totals.meituan)}，计入实际营收，标注第三方团购。`} />
                <Definition label="抖音核销实付" value={`${money(totals.douyin)}，计入实际营收，标注第三方团购。`} />
                <Definition label="商品销售" value="包含已配置商品销售，也包含未建商品的直接收款。" />
              </div>
            </Panel>
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Panel title="销售项目结构" icon={BarChart3}>
              <BarList rows={projectRows.map((row) => ({ name: projectMeta[row.key as Project].short, value: row.total.actualRevenue, color: projectMeta[row.key as Project].color }))} total={totals.actualRevenue} />
            </Panel>
            <Panel title="多维明细" icon={ArrowDownToLine}>
              <div className="mb-3 flex flex-wrap gap-2">
                {[
                  { id: 'project', name: '销售项目' },
                  { id: 'source', name: '购买来源' },
                  { id: 'payment', name: '付款方式' },
                  { id: 'store', name: '门店对比' },
                ].map((item) => (
                  <button key={item.id} onClick={() => setTab(item.id as Tab)} className={cn('h-9 rounded-md px-3 text-sm font-bold', tab === item.id ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600')}>
                    {item.name}
                  </button>
                ))}
              </div>
              {tab === 'project' && <DataTable rows={projectRows} type="project" total={totals.actualRevenue} />}
              {tab === 'source' && <DataTable rows={sourceRows} type="source" total={totals.actualRevenue} />}
              {tab === 'payment' && <DataTable rows={paymentRows} type="payment" total={totals.actualRevenue} />}
              {tab === 'store' && <DataTable rows={storeRows} type="store" total={totals.actualRevenue} />}
            </Panel>
          </section>
        </section>
      </main>
    </div>
  );
}

function summarize(rows: RevenueOrder[]) {
  const base = rows.reduce(
    (acc, row) => {
      acc.receivable += row.receivable;
      acc.discount += row.discount;
      acc.sales += row.paid;
      acc.orders += row.orders;
      if (row.payment === 'storedBalance') acc.storedBalance += row.paid;
      if (row.project === 'storedCard') acc.storedCardRevenue += row.paid;
      if (row.payment === 'meituanGroup') acc.meituan += row.paid;
      if (row.payment === 'douyinGroup') acc.douyin += row.paid;
      return acc;
    },
    { receivable: 0, discount: 0, sales: 0, storedBalance: 0, storedCardRevenue: 0, meituan: 0, douyin: 0, orders: 0 },
  );

  return { ...base, actualRevenue: base.sales - base.storedBalance };
}

function groupBy<T extends keyof RevenueOrder>(rows: RevenueOrder[], key: T) {
  const grouped = new Map<string, RevenueOrder[]>();
  rows.forEach((row) => {
    const value = String(row[key]);
    grouped.set(value, [...(grouped.get(value) ?? []), row]);
  });

  return Array.from(grouped.entries())
    .map(([groupKey, groupRows]) => ({ key: groupKey, total: summarize(groupRows) }))
    .sort((a, b) => b.total.actualRevenue - a.total.actualRevenue);
}

function Segmented({ value, onChange }: { value: Period; onChange: (value: Period) => void }) {
  return (
    <div className="flex h-10 rounded-md bg-white p-1 ring-1 ring-slate-200">
      {periods.map((item) => (
        <button key={item.id} onClick={() => onChange(item.id)} className={cn('min-w-16 rounded px-3 text-sm font-bold', value === item.id ? 'bg-slate-950 text-white' : 'text-slate-600')}>
          {item.name}
        </button>
      ))}
    </div>
  );
}

function SelectBox({ icon: Icon, value, onChange, options }: { icon: typeof Store; value: string; onChange: (value: string) => void; options: { id: string; name: string }[] }) {
  return (
    <label className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
      <Icon size={16} />
      <select value={value} onChange={(event) => onChange(event.target.value)} className="bg-transparent outline-none">
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function IconAction({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600" title={label} aria-label={label}>
      {children}
    </button>
  );
}

function MetricCard({ title, value, helper, accent, large }: { title: string; value: string; helper: string; accent?: string; large?: boolean }) {
  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white p-4', accent)}>
      <div className={cn('text-sm font-bold', accent ? 'text-white/70' : 'text-slate-500')}>{title}</div>
      <div className={cn('mt-2 font-black tracking-normal', large ? 'text-3xl' : 'text-2xl')}>{value}</div>
      <div className={cn('mt-2 text-xs font-semibold leading-5', accent ? 'text-white/65' : 'text-slate-500')}>{helper}</div>
    </div>
  );
}

function Panel({ title, icon: Icon, action, children }: { title: string; icon: typeof Store; action?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex min-h-12 items-center justify-between border-b border-slate-100 px-4">
        <div className="flex items-center gap-2 text-sm font-black">
          <Icon size={17} />
          {title}
        </div>
        {action && <div className="text-xs font-bold text-slate-400">{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function TrendChart() {
  const max = Math.max(...trend.map((item) => item.sales));
  return (
    <div className="h-72">
      <div className="flex h-60 items-end gap-3">
        {trend.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-48 w-full items-end justify-center gap-1 rounded-md bg-slate-50 px-2 pb-2">
              <div className="w-3 rounded-t bg-slate-900" style={{ height: `${(item.revenue / max) * 100}%` }} title={`实际营收 ${money(item.revenue)}`} />
              <div className="w-3 rounded-t bg-cyan-500" style={{ height: `${(item.sales / max) * 100}%` }} title={`总销售额 ${money(item.sales)}`} />
              <div className="w-3 rounded-t bg-amber-500" style={{ height: `${(item.stored / max) * 100}%` }} title={`储值卡支付 ${money(item.stored)}`} />
            </div>
            <div className="text-xs font-bold text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
        <Legend color="bg-slate-900" label="实际营收" />
        <Legend color="bg-cyan-500" label="总销售额" />
        <Legend color="bg-amber-500" label="储值卡支付" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2.5 w-2.5 rounded-full', color)} />
      {label}
    </div>
  );
}

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="text-xs font-black text-slate-500">{label}</div>
      <div className="mt-1 font-bold leading-6 text-slate-900">{value}</div>
    </div>
  );
}

function BarList({ rows, total }: { rows: { name: string; value: number; color: string }[]; total: number }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const percent = total ? (row.value / total) * 100 : 0;
        return (
          <div key={row.name}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-black">{row.name}</span>
              <span className="font-bold text-slate-500">{money(row.value)} / {percent.toFixed(1)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={cn('h-full rounded-full', row.color)} style={{ width: `${Math.max(percent, 3)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DataTable({ rows, type, total }: { rows: { key: string; total: ReturnType<typeof summarize> }[]; type: Tab; total: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="text-xs font-black text-slate-500">
            <th className="border-b border-slate-100 py-3 pr-4">{tableTitle(type)}</th>
            <th className="border-b border-slate-100 py-3 pr-4 text-right">应收金额</th>
            <th className="border-b border-slate-100 py-3 pr-4 text-right">优惠金额</th>
            <th className="border-b border-slate-100 py-3 pr-4 text-right">总销售额</th>
            <th className="border-b border-slate-100 py-3 pr-4 text-right">储值卡支付</th>
            <th className="border-b border-slate-100 py-3 pr-4 text-right">实际营收</th>
            <th className="border-b border-slate-100 py-3 text-right">订单数</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="font-bold text-slate-800">
              <td className="border-b border-slate-100 py-3 pr-4">
                <RowName rowKey={row.key} type={type} />
              </td>
              <td className="border-b border-slate-100 py-3 pr-4 text-right">{money(row.total.receivable)}</td>
              <td className="border-b border-slate-100 py-3 pr-4 text-right text-rose-600">{money(row.total.discount)}</td>
              <td className="border-b border-slate-100 py-3 pr-4 text-right">{money(row.total.sales)}</td>
              <td className="border-b border-slate-100 py-3 pr-4 text-right text-amber-700">{money(row.total.storedBalance)}</td>
              <td className="border-b border-slate-100 py-3 pr-4 text-right text-slate-950">{money(row.total.actualRevenue)}</td>
              <td className="border-b border-slate-100 py-3 text-right">
                {row.total.orders}
                <span className="ml-2 text-xs text-slate-400">{total ? ((row.total.actualRevenue / total) * 100).toFixed(1) : '0.0'}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowName({ rowKey, type }: { rowKey: string; type: Tab }) {
  if (type === 'project') {
    const item = projectMeta[rowKey as Project];
    const Icon = item.icon;
    return (
      <div className="flex items-center gap-2">
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-md text-white', item.color)}>
          <Icon size={16} />
        </span>
        {item.name}
      </div>
    );
  }

  if (type === 'source') {
    const item = sourceMeta[rowKey as Source];
    return (
      <div className="flex items-center gap-2">
        <span className={cn('h-2.5 w-2.5 rounded-full', item.color)} />
        {item.name}
        {item.tag && <span className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">{item.tag}</span>}
      </div>
    );
  }

  if (type === 'payment') {
    const item = paymentMeta[rowKey as Payment];
    const Icon = item.icon;
    return (
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          <Icon size={16} />
        </span>
        <span>{item.name}</span>
        <span className={cn('rounded px-2 py-1 text-xs', item.revenue ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{item.revenue ? '计入实际营收' : '不计入营收'}</span>
      </div>
    );
  }

  return stores.find((item) => item.id === rowKey)?.name ?? rowKey;
}

function tableTitle(type: Tab) {
  return { project: '销售项目', source: '购买来源', payment: '付款方式', store: '门店' }[type];
}

function money(value: number) {
  return `¥${Math.round(value).toLocaleString('zh-CN')}`;
}

export default App;
