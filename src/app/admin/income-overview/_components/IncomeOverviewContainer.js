"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Card, Col, Empty, Row, Select, Skeleton, Statistic } from "antd";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { selectUser } from "@/redux/features/authSlice";
import { useGetOverviewQuery } from "@/redux/api/incomeApi";
import { ALLOWED_INCOME_ROLES, formatIncome } from "@/components/income/incomeUtils";

const STATUS_COLORS = ["#16a34a", "#eab308", "#64748b", "#f97316", "#dc2626"];
const incomeCardClass = "h-full !rounded-2xl !border-0 shadow-sm transition-shadow hover:shadow-md";

function CurrencySelector({ value, onChange }) {
  return <label className="flex items-center gap-2 text-sm font-medium text-white"><span>Currency</span><Select aria-label="Currency" value={value} onChange={onChange} className="w-28" options={[{ value: "BDT" }, { value: "INR" }]}/></label>;
}

function StatisticCard({ title, value, currency, money = true, accent = false }) {
  return <Card className={`${incomeCardClass} ${accent ? "!bg-primary" : "!bg-primary-white"}`}><Statistic title={<span className={accent ? "text-white/80" : "text-muted"}>{title}</span>} value={money ? formatIncome(value, currency) : value ?? "—"} valueStyle={{ color: accent ? "white" : "#1c1c1e", fontWeight: 650, fontSize: 24 }}/></Card>;
}

function lastTwelveMonths(monthlyIncome) {
  const byMonth = new Map((monthlyIncome || []).map((item) => [`${item.year}-${item.month}`, item]));
  const now = new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    const item = byMonth.get(`${date.getFullYear()}-${date.getMonth() + 1}`);
    return { month: date.toLocaleDateString(undefined, { month: "short", year: "2-digit" }), income: typeof item?.income === "number" ? item.income : 0, subscriptions: typeof item?.subscriptions === "number" ? item.subscriptions : 0 };
  });
}

function IncomeChart({ data, currency }) {
  return <ResponsiveContainer width="100%" height={300}><AreaChart data={data}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#907a69" stopOpacity={0.5}/><stop offset="95%" stopColor="#907a69" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#e7e0da" strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip formatter={(value, name) => name === "income" ? [formatIncome(value, currency), "Income"] : [value, "Subscriptions"]}/><Area type="monotone" dataKey="income" stroke="#907a69" strokeWidth={3} fill="url(#incomeFill)"/></AreaChart></ResponsiveContainer>;
}

function SubscriptionStatusChart({ status }) {
  const data = ["active", "pending", "expired", "cancelled", "failed"].map((name) => ({ name, value: Number(status?.[name]) || 0 }));
  return <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95}>{data.map((item, index) => <Cell key={item.name} fill={STATUS_COLORS[index]}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer>;
}

function TopPackagesChart({ packages, currency }) {
  if (!packages?.length) return <Empty description="No package income for this currency"/>;
  const highest = Math.max(...packages.map((item) => Number(item.income) || 0), 1);
  return <div className="space-y-5">{packages.map((item, index) => <div key={item.packageId || `${item.title}-${index}`}><div className="mb-2 flex flex-wrap justify-between gap-2"><span className="font-medium">{index + 1}. {item.title || "Untitled package"}</span><span className="text-sm text-muted">{formatIncome(item.income, currency)} · {item.subscriptions ?? "—"} subscriptions</span></div><div className="h-2 overflow-hidden rounded bg-[#e7e0da]"><div className="h-full rounded bg-primary" style={{ width: `${Math.max(((Number(item.income) || 0) / highest) * 100, 2)}%` }}/></div></div>)}</div>;
}

export default function IncomeOverviewContainer() {
  const user = useSelector(selectUser);
  const [requestedCurrency, setRequestedCurrency] = useState("BDT");
  const hasAccess = ALLOWED_INCOME_ROLES.includes(user?.role);
  const { data, isLoading, isError, refetch } = useGetOverviewQuery({ currency: requestedCurrency }, { skip: !hasAccess });
  const currency = data?.currency || requestedCurrency;
  const monthly = useMemo(() => lastTwelveMonths(data?.monthlyIncome), [data?.monthlyIncome]);
  const growth = Number(data?.growthPercentage);
  const hasGrowth = Number.isFinite(growth);

  if (!hasAccess) return <Alert type="error" showIcon message="You do not have permission to view income data."/>;
  if (isLoading) return <Card className={incomeCardClass}><Skeleton active paragraph={{ rows: 12 }}/></Card>;
  if (isError) return <Alert className="!rounded-2xl" type="error" showIcon message="Could not load income overview" action={<Button onClick={refetch}>Retry</Button>}/>;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Financial analytics</p><h1 className="text-3xl font-semibold text-white">Income Overview</h1>{data?.generatedAt && <p className="mt-1 text-sm text-gray-300">Updated {new Date(data.generatedAt).toLocaleString()}</p>}</div><CurrencySelector dark value={requestedCurrency} onChange={setRequestedCurrency}/></div>
    <Row gutter={[16, 16]}>{[["Total Income", data?.totalIncome, true, "total", true], ["This Month Income", data?.thisMonthIncome, true, "month"], ["Today Income", data?.todayIncome, true, "today"], ["Last Month Income", data?.lastMonthIncome, true, "previous"], ["Paid Subscriptions", data?.totalPaidSubscriptions, false, "subscriptions"], ["Total Coupon Discount", data?.totalDiscount, true, "discount"]].map(([title, value, money, icon, accent]) => <Col xs={24} sm={12} xl={8} key={title}><StatisticCard title={title} value={value} currency={currency} money={money} icon={icon} accent={accent}/></Col>)}</Row>
    <Card className={incomeCardClass}><div className="flex items-center gap-3"><div className={`rounded-full p-2 ${growth >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{growth >= 0 ? <ArrowUpRight/> : <ArrowDownRight/>}</div><div><p className="text-sm text-gray-500">Current month vs last month</p><p className={`text-2xl font-semibold ${growth >= 0 ? "text-green-700" : "text-red-700"}`}>{hasGrowth ? new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 2 }).format(growth / 100) : "—"}</p></div></div></Card>
    <Row gutter={[16, 16]}><Col xs={24} xl={14}><Card className={incomeCardClass} title="Monthly Income · Last 12 Months"><IncomeChart data={monthly} currency={currency}/></Card></Col><Col xs={24} xl={10}><Card className={incomeCardClass} title="Subscription Status"><SubscriptionStatusChart status={data?.subscriptionStatus}/></Card></Col></Row>
    <Card className={incomeCardClass} title="Top Packages"><TopPackagesChart packages={data?.topPackages} currency={currency}/></Card>
  </div>;
}
