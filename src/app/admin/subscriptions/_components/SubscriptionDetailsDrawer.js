"use client";
import { Descriptions, Drawer, Skeleton, Tag } from "antd";
import { useGetSubscriptionByIdQuery } from "@/redux/api/subscriptionApi";

export default function SubscriptionDetailsDrawer({ id, onClose }) {
  const { data, isLoading } = useGetSubscriptionByIdQuery(id, { skip: !id });
  const sub = data || {};

  const dateText = (value) => value ? new Date(value).toLocaleString() : "—";
  const entityText = (value, fields) => typeof value === "string" ? value : fields.map((field) => value?.[field]).find(Boolean) || value?._id || "—";
  const moneyText = (value) => typeof value === "number" ? new Intl.NumberFormat(sub.currency === "INR" ? "en-IN" : "bn-BD", { style: "currency", currency: sub.currency || "BDT" }).format(value) : "—";
  const items = [
    ["User", entityText(sub.user, ["name", "email", "phone"])], ["Package", entityText(sub.package, ["title", "name"])], ["Coupon", sub.couponCode || entityText(sub.coupon, ["code", "couponCode"])],
    ["Original price", moneyText(sub.originalPrice)], ["Discount", moneyText(sub.discountAmount)], ["Payable amount", moneyText(sub.payableAmount)], ["Transaction ID", sub.tranId || "—"],
    ["Currency", sub.currency || "—"], ["Payment provider", sub.paymentProvider || "—"], ["Payment date", dateText(sub.paidAt)], ["Start date", dateText(sub.startDate)], ["End date", dateText(sub.endDate)], ["Status", sub.status ? <Tag key="status">{sub.status.toUpperCase()}</Tag> : "—"], ["Active", sub.isActive == null ? "—" : sub.isActive ? "Yes" : "No"], ["Expired", sub.isExpired == null ? "—" : sub.isExpired ? "Yes" : "No"], ["Created", dateText(sub.createdAt)],
  ].map(([label, children], index) => ({ key: String(index), label, children }));

  return (
    <Drawer title="Subscription Details" open={!!id} onClose={onClose} width={720}>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Descriptions bordered column={1} items={items} />
      )}
    </Drawer>
  );
}
