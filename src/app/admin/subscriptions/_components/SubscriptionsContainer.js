"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Input,
  Pagination,
  Select,
  Table,
  Tag,
} from "antd";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import { useGetAllSubscriptionsQuery } from "@/redux/api/subscriptionApi";
import { useGetAllPackagesQuery } from "@/redux/api/packageApi";
import { selectUser } from "@/redux/features/authSlice";
import { canManageAdminResources } from "@/utils/adminAccess";
import SubscriptionDetailsDrawer from "./SubscriptionDetailsDrawer";

const { RangePicker } = DatePicker;
const statusColor = {
  active: "green",
  expired: "default",
  cancelled: "orange",
};
const dateText = (value) => (value ? new Date(value).toLocaleString() : "—");
const entityText = (value, fields) =>
  typeof value === "string"
    ? value
    : fields.map((field) => value?.[field]).find(Boolean) || value?._id || "—";
const moneyText = (value, currency = "BDT") =>
  typeof value === "number"
    ? new Intl.NumberFormat(currency === "INR" ? "en-IN" : "bn-BD", {
        style: "currency",
        currency,
      }).format(value)
    : "—";

export default function SubscriptionsContainer() {
  const user = useSelector(selectUser);
  const hasAccess = canManageAdminResources(user);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState();
  const [packageId, setPackageId] = useState();
  const [couponUsed, setCouponUsed] = useState();
  const [dateRange, setDateRange] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo(() => {
    const params = { page, limit };
    if (searchTerm) params.searchTerm = searchTerm;
    if (status) params.status = status;
    if (packageId) params.package = packageId;
    if (couponUsed !== undefined) params.couponUsed = couponUsed;
    if (dateRange?.[0] && dateRange?.[1]) {
      params.startDate = dateRange[0].startOf("day").toISOString();
      params.endDate = dateRange[1].endOf("day").toISOString();
    }
    return params;
  }, [page, limit, searchTerm, status, packageId, couponUsed, dateRange]);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllSubscriptionsQuery(query, { skip: !hasAccess });
  const { data: packageData, isLoading: packagesLoading } =
    useGetAllPackagesQuery({ page: 1, limit: 100 }, { skip: !hasAccess });
  const subscriptions = (data?.records || []).filter((record) =>
    ["active", "expired", "cancelled"].includes(record?.status),
  );
  const meta = data?.meta || {};
  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };
  const clearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setStatus(undefined);
    setPackageId(undefined);
    setCouponUsed(undefined);
    setDateRange(null);
    setPage(1);
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      render: (value) => entityText(value, ["name", "email", "phoneNumber"]),
    },
    {
      title: "Package",
      dataIndex: "package",
      render: (value) => entityText(value, ["title", "productId"]),
    },
    {
      title: "Paid Amount",
      dataIndex: "payableAmount",
      render: (value, record) => moneyText(value, record.currency),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) =>
        value ? (
          <Tag color={statusColor[value] || "blue"}>{value.toUpperCase()}</Tag>
        ) : (
          "—"
        ),
    },
    { title: "Payment Date", dataIndex: "paidAt", render: dateText },
    {
      title: "Actions",
      render: (_, record) => (
        <Button type="link" onClick={() => setSelectedId(record._id)}>
          View
        </Button>
      ),
    },
  ];

  if (!hasAccess)
    return (
      <Alert
        type="error"
        showIcon
        message="You do not have permission to view subscriptions."
      />
    );

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Membership management
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Subscription History
        </h1>
        <p className="mt-1 text-sm text-gray-300">
          Review and filter paid subscription records
        </p>
      </div>
      <Card
        className="!rounded-2xl !border-0 shadow-sm"
        title="Filter subscriptions"
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="xl:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">Search</span>
            <Input
              className="w-full"
              allowClear
              value={searchInput}
              prefix={<Search size={16} />}
              placeholder="User, transaction or coupon"
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Status</span>
            <Select
              className="w-full"
              allowClear
              value={status}
              placeholder="All paid statuses"
              onChange={resetPage(setStatus)}
              options={[
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Package</span>
            <Select
              className="w-full"
              showSearch
              optionFilterProp="label"
              loading={packagesLoading}
              allowClear
              value={packageId}
              placeholder="All packages"
              onChange={resetPage(setPackageId)}
              options={(packageData?.records || []).map((item) => ({
                value: item._id,
                label: item.title,
              }))}
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Coupon</span>
            <Select
              className="w-full"
              allowClear
              value={couponUsed}
              placeholder="All"
              onChange={resetPage(setCouponUsed)}
              options={[
                { value: true, label: "Used" },
                { value: false, label: "Not used" },
              ]}
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">
              Payment date
            </span>
            <RangePicker
              className="w-full"
              value={dateRange}
              onChange={resetPage(setDateRange)}
            />
          </label>
        </div>
        <Button className="mt-4" onClick={clearFilters}>
          Clear filters
        </Button>
      </Card>

      {isLoading ? (
        <PageLoader />
      ) : isError ? (
        <Alert
          className="!rounded-2xl"
          type="error"
          showIcon
          message="Could not load subscriptions"
          action={<Button onClick={refetch}>Retry</Button>}
        />
      ) : (
        <Card
          className="overflow-hidden !rounded-2xl !border-0 shadow-sm"
          bodyStyle={{ padding: 0 }}
        >
          <Table
            loading={isFetching}
            dataSource={subscriptions}
            columns={columns}
            rowKey={(record) => record._id}
            pagination={false}
            scroll={{ x: 850 }}
            locale={{ emptyText: <EmptyContainer /> }}
          />
        </Card>
      )}
      <div className="flex justify-end pb-2">
        <Pagination
          current={meta.page || page}
          pageSize={meta.limit || limit}
          total={meta.total || 0}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          onChange={(nextPage, nextLimit) => {
            setPage(nextPage);
            setLimit(nextLimit);
          }}
        />
      </div>
      <SubscriptionDetailsDrawer
        id={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
