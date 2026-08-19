"use client";
import { Descriptions, Drawer, Tag } from "antd";
import { formatIncome, formatIncomeDate, getEntityLabel } from "@/components/income/incomeUtils";

function StatusBadge({ value }) {
  const colors = { active: "green", pending: "gold", expired: "default", cancelled: "orange", failed: "red" };
  return value ? <Tag color={colors[value] || "blue"}>{String(value).replaceAll("_", " ").toUpperCase()}</Tag> : "—";
}

export default function PaymentDetailsDrawer({ record, onClose }) {
  const currency = record?.currency || "BDT";
  const items = record ? [["User", getEntityLabel(record.user, ["name", "email", "phone"])], ["Package", getEntityLabel(record.package, ["title", "name"])], ["Coupon", record.couponCode || getEntityLabel(record.coupon, ["code", "couponCode"])], ["Payment provider", record.paymentProvider || "—"], ["Transaction ID", record.tranId || "—"], ["Original price", formatIncome(record.originalPrice, currency)], ["Discount amount", formatIncome(record.discountAmount, currency)], ["Final paid amount", formatIncome(record.payableAmount, currency)], ["Payment date", formatIncomeDate(record.paidAt)], ["Subscription start", formatIncomeDate(record.startDate)], ["Subscription end", formatIncomeDate(record.endDate)], ["Status", <StatusBadge key="status" value={record.status}/>]].map(([label, children], index) => ({ key: String(index), label, children })) : [];
  return <Drawer title="Payment details" open={Boolean(record)} onClose={onClose} width={680}><Descriptions bordered column={1} items={items}/></Drawer>;
}
