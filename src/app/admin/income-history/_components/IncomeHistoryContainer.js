"use client";
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, DatePicker, Empty, Input, Pagination, Row, Select, Skeleton, Table, Tag } from "antd";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { useGetIncomeHistoryQuery } from "@/redux/api/incomeApi";
import PaymentDetailsDrawer from "./PaymentDetailsDrawer";
import { ALLOWED_INCOME_ROLES, formatIncome, formatIncomeDate, getEntityLabel } from "@/components/income/incomeUtils";

const { RangePicker } = DatePicker;
const incomeCardClass = "h-full !rounded-2xl !border-0 shadow-sm transition-shadow hover:shadow-md";
function StatusBadge({ value }) {
  const colors = { active: "green", pending: "gold", expired: "default", cancelled: "orange", failed: "red" };
  return value ? <Tag color={colors[value] || "blue"} className="!rounded-full !px-3">{String(value).replaceAll("_", " ").toUpperCase()}</Tag> : "—";
}

function IncomeFilters({ filters, searchInput, onSearchInput, onChange, onClear }) {
  const range = filters.startDate && filters.endDate ? [dayjs(filters.startDate), dayjs(filters.endDate)] : null;
  return <Card className={`mb-5 ${incomeCardClass}`} title="Filter transactions"><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
    <label><span className="mb-1 block">Currency</span><Select className="w-full" value={filters.currency} onChange={(value) => onChange("currency", value)} options={[{ value: "BDT" }, { value: "INR" }]}/></label>
    <label><span className="mb-1 block">Provider</span><Select className="w-full" allowClear value={filters.provider || undefined} onChange={(value) => onChange("provider", value)} options={[{ value: "aamarpay" }, { value: "cashfree" }]}/></label>
    <label><span className="mb-1 block">Coupon used</span><Select className="w-full" allowClear value={filters.couponUsed || undefined} onChange={(value) => onChange("couponUsed", value)} options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}/></label>
    <label className="xl:col-span-2"><span className="mb-1 block">Payment date range</span><RangePicker className="w-full" value={range} onChange={(dates) => { onChange("startDate", dates?.[0]?.startOf("day").toISOString()); onChange("endDate", dates?.[1]?.endOf("day").toISOString()); }}/></label>
    <label><span className="mb-1 block">Transaction or coupon</span><Input allowClear prefix={<Search size={16}/>} value={searchInput} onChange={(event) => onSearchInput(event.target.value)} placeholder="Search"/></label>
  </div><Button className="mt-4" onClick={onClear}>Clear filters</Button></Card>;
}

function Summary({ summary, selectedCurrency }) {
  const currency = summary.currency || selectedCurrency;
  return <Row gutter={[16, 16]} className="mb-5">{[["Filtered Income", formatIncome(summary.income, currency)], ["Filtered Discount", formatIncome(summary.discount, currency)], ["Transactions", summary.transactions ?? "—"], ["Selected Currency", currency]].map(([label, value], index) => <Col xs={24} sm={12} xl={6} key={label}><Card className={`${incomeCardClass} ${index === 0 ? "!bg-primary" : "!bg-primary-white"}`}><p className={index === 0 ? "text-white/80" : "text-muted"}>{label}</p><p className={`mt-2 text-2xl font-semibold ${index === 0 ? "text-white" : "text-primary-black"}`}>{value}</p></Card></Col>)}</Row>;
}

export default function IncomeHistoryContainer() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = useMemo(() => ({ page: Math.max(Number(searchParams.get("page")) || 1, 1), limit: Number(searchParams.get("limit")) || 20, currency: searchParams.get("currency") || "BDT", provider: searchParams.get("provider") || "", couponUsed: searchParams.get("couponUsed") || "", startDate: searchParams.get("startDate") || "", endDate: searchParams.get("endDate") || "", searchTerm: searchParams.get("searchTerm") || "" }), [searchParams]);
  const [filters, setFilters] = useState(initial);
  const [searchInput, setSearchInput] = useState(initial.searchTerm);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const hasAccess = ALLOWED_INCOME_ROLES.includes(user?.role);
  useEffect(() => { const timer = setTimeout(() => setFilters((current) => ({ ...current, searchTerm: searchInput, page: 1 })), 400); return () => clearTimeout(timer); }, [searchInput]);
  useEffect(() => { const params = new URLSearchParams(); Object.entries(filters).forEach(([key, value]) => { if (value !== "" && value != null) params.set(key, String(value)); }); router.replace(`${pathname}?${params}`, { scroll: false }); }, [filters, pathname, router]);
  const query = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value != null)), [filters]);
  const { data, isLoading, isFetching, isError, refetch } = useGetIncomeHistoryQuery(query, { skip: !hasAccess });
  const responseCurrency = data?.summary?.currency || filters.currency;
  const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value || "", page: key === "page" || key === "limit" ? current.page : 1 }));
  const clearFilters = () => { setSearchInput(""); setFilters({ page: 1, limit: 20, currency: "BDT", provider: "", couponUsed: "", startDate: "", endDate: "", searchTerm: "" }); };
  const columns = [
    { title: "Payment Date", dataIndex: "paidAt", render: formatIncomeDate }, { title: "Transaction ID", dataIndex: "tranId", render: (value) => value || "—" },
    { title: "User", dataIndex: "user", render: (value) => getEntityLabel(value, ["name", "email", "phone"]) }, { title: "Package", dataIndex: "package", render: (value) => getEntityLabel(value, ["title", "name"]) },
    { title: "Original Price", dataIndex: "originalPrice", render: (value, record) => formatIncome(value, record.currency || responseCurrency) }, { title: "Coupon Code", dataIndex: "couponCode", render: (value, record) => value || getEntityLabel(record.coupon, ["code", "couponCode"]) },
    { title: "Discount", dataIndex: "discountAmount", render: (value, record) => formatIncome(value, record.currency || responseCurrency) }, { title: "Paid Amount", dataIndex: "payableAmount", render: (value, record) => <span className="font-semibold text-primary-black">{formatIncome(value, record.currency || responseCurrency)}</span> },
    { title: "Provider", dataIndex: "paymentProvider", render: (value) => value || "—" }, { title: "Currency", dataIndex: "currency", render: (value) => value || "—" },
    { title: "Subscription Status", dataIndex: "status", render: (value) => <StatusBadge value={value}/> }, { title: "Actions", fixed: "right", render: (_, record) => <Button type="link" onClick={() => setSelectedRecord(record)}>View details</Button> },
  ];
  if (!hasAccess) return <Alert type="error" showIcon message="You do not have permission to view income data."/>;
  return <div><div className="mb-5"><p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Financial analytics</p><h1 className="text-3xl font-semibold text-white">Income History</h1><p className="mt-1 text-sm text-gray-300">Review and filter completed payment activity</p></div><IncomeFilters filters={filters} searchInput={searchInput} onSearchInput={setSearchInput} onChange={changeFilter} onClear={clearFilters}/>
    {isLoading ? <Card className={incomeCardClass}><Skeleton active paragraph={{ rows: 10 }}/></Card> : isError ? <Alert className="!rounded-2xl" type="error" showIcon message="Could not load income history" action={<Button onClick={refetch}>Retry</Button>}/> : <><Summary summary={data?.summary || {}} selectedCurrency={filters.currency}/><Card className={incomeCardClass} bodyStyle={{ padding: 0 }}><div className="overflow-x-auto"><Table loading={isFetching} dataSource={data?.records || []} columns={columns} rowKey={(record) => record._id || record.tranId} pagination={false} scroll={{ x: 1500 }} locale={{ emptyText: <Empty description="No transactions match these filters"/> }}/></div></Card><div className="mt-5 flex justify-end"><Pagination current={data?.meta?.page || filters.page} pageSize={data?.meta?.limit || filters.limit} total={data?.meta?.total || 0} showSizeChanger pageSizeOptions={["10", "20", "50", "100"]} onChange={(page, limit) => setFilters((current) => ({ ...current, page, limit }))}/></div></>}
    <PaymentDetailsDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} /></div>;
}
