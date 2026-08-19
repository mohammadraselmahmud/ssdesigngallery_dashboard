"use client";
import { Alert, Table } from "antd";
import { useGetAllSubscriptionsQuery } from "@/redux/api/subscriptionApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { canManageAdminResources } from "@/utils/adminAccess";

export default function PaymentsOverview() {
  const user = useSelector(selectUser);
  const hasAccess = canManageAdminResources(user);
  const { data: subsRes, isLoading } = useGetAllSubscriptionsQuery({ page: 1, limit: 50 }, { skip: !hasAccess });
  const subs = subsRes?.records || [];

  const rows = subs
    .filter((s) => s && (s.tranId || s.payableAmount || s.payableAmount === 0))
    .map((s) => ({
      key: s._id,
      tranId: s.tranId,
      user: s.user?.name || s.user || '-',
      subscription: s._id,
      package: s.package?.title || s.package || '-',
      originalAmount: s.originalPrice,
      discount: s.discountAmount,
      paidAmount: s.payableAmount,
      currency: s.currency || '-',
      status: s.status,
      paidAt: s.paidAt,
    }));

  const columns = [
    { title: "Transaction ID", dataIndex: "tranId", key: "tranId" },
    { title: "User", dataIndex: "user", key: "user" },
    { title: "Subscription", dataIndex: "subscription", key: "subscription" },
    { title: "Package", dataIndex: "package", key: "package" },
    { title: "Original", dataIndex: "originalAmount", key: "originalAmount" },
    { title: "Discount", dataIndex: "discount", key: "discount" },
    { title: "Paid", dataIndex: "paidAmount", key: "paidAmount" },
    { title: "Currency", dataIndex: "currency", key: "currency" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Paid At", dataIndex: "paidAt", key: "paidAt" },
  ];

  if (!hasAccess) return <Alert type="error" showIcon message="You do not have permission to view payments." />;
  return (
    <div>
      <h3 className="mb-4 text-2xl font-semibold text-white">Payments Overview</h3>
      <Alert className="mb-4" type="warning" showIcon message="Detailed payment history API required" description="This overview only shows payment fields returned by subscription records. Provider, gateway response, payment filters and exact payment timestamps are unavailable unless the backend exposes /payment/history." />
      <div className="overflow-x-auto"><Table dataSource={rows} columns={columns} loading={isLoading} pagination={{ pageSize: 20 }} scroll={{ x: 1200 }} /></div>
    </div>
  );
}
