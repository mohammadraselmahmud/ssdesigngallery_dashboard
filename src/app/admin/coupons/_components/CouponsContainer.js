"use client";
import { Alert, Button, Input, Pagination, Table, Tag } from "antd";
import { PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import { ConfirmModal } from "@/utils/modalHook";
import { errorToast, successToast } from "@/utils/customToast";
import AddEditCouponModal from "./AddEditCouponModal";
import {
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
} from "@/redux/api/couponApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { canManageAdminResources } from "@/utils/adminAccess";

const readableDate = (value) =>
  value ? new Date(value).toLocaleString() : "—";
const couponStatus = (coupon) => {
  const now = Date.now();
  if (!coupon.isActive) return ["Inactive", "default"];
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now)
    return ["Scheduled", "blue"];
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now)
    return ["Expired", "red"];
  return ["Active", "green"];
};

export default function CouponsContainer() {
  const user = useSelector(selectUser);
  const hasAccess = canManageAdminResources(user);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const query = {};
  query["page"] = currentPage;
  query["limit"] = limit;
  if (searchText) query["searchTerm"] = searchText;

  const {
    data: couponsRes,
    isLoading,
    isError,
    refetch,
  } = useGetAllCouponsQuery(query, { skip: !hasAccess });
  const coupons = couponsRes?.records || [];
  const meta = couponsRes?.meta || {};

  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const handleDelete = (id) => {
    ConfirmModal("Are you sure?", "Coupon will be deleted permanently.").then(
      async (res) => {
        if (res.isConfirmed) {
          try {
            await deleteCoupon(id).unwrap();
            await refetch();
            successToast("Coupon deleted successfully");
          } catch (error) {
            errorToast(error?.message || error?.data?.message);
          }
        }
      },
    );
  };

  const columns = [
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Discount",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (v, r) =>
        `${r.discountValue} ${r.discountType === "percentage" ? "%" : ""}`,
    },
    { title: "Min Purchase", dataIndex: "minPurchase", key: "minPurchase" },
    { title: "Max Discount", dataIndex: "maxDiscount", key: "maxDiscount" },
    {
      title: "Usage/Per User",
      key: "usage",
      render: (v, r) => `${r.usageLimit || "-"} / ${r.perUserLimit || 1}`,
    },
    {
      title: "Starts At",
      dataIndex: "startsAt",
      key: "startsAt",
      render: readableDate,
    },
    {
      title: "Expires At",
      dataIndex: "expiresAt",
      key: "expiresAt",
      render: readableDate,
    },
    {
      title: "Applicable Packages",
      dataIndex: "applicablePackages",
      render: (items) =>
        !items?.length
          ? "All packages"
          : items
              .map((item) =>
                typeof item === "string"
                  ? item
                  : item?.title || item?._id || "—",
              )
              .join(", "),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const [label, color] = couponStatus(record);
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-x-2">
          <Button
            onClick={() => {
              setEditing(record);
              setShowModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            loading={isDeleting}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (!hasAccess)
    return (
      <Alert
        type="error"
        showIcon
        message="You do not have permission to manage coupons."
      />
    );
  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<PlusCircle size={20} />}
        className="!w-full !py-6"
        onClick={() => {
          setEditing(null);
          setShowModal(true);
        }}
      >
        Add Coupon
      </Button>

      <section className="mt-6">
        <div className="flex-center-between mb-4 px-1">
          <h3 className="mb-4 text-2xl font-semibold text-white">Coupons</h3>

          <Input
            placeholder="Search by coupon code"
            prefix={<Search className="mr-2 text-muted" size={18} />}
            className="h-10 !w-1/2 !rounded-lg !border !text-base lg:!w-1/3"
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <div className="rounded-xl bg-white p-6 text-center">
            <p className="mb-3">Could not load coupons.</p>
            <Button onClick={refetch}>Retry</Button>
          </div>
        ) : coupons?.length > 0 ? (
          <div className="overflow-hidden rounded-xl">
            <Table
              dataSource={coupons}
              columns={columns}
              rowKey={(r) => r._id}
              pagination={false}
              scroll={{ x: 1350 }}
            />
          </div>
        ) : (
          <EmptyContainer />
        )}
      </section>

      <div className="ml-auto mt-6 w-max">
        <Pagination
          pageSize={limit}
          current={currentPage}
          onChange={(page, pageSize) => (
            setCurrentPage(page),
            setLimit(pageSize)
          )}
          total={meta.total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50", "100"]}
        />
      </div>

      <AddEditCouponModal
        open={showModal}
        setOpen={setShowModal}
        selectedCoupon={editing}
        onSuccess={refetch}
      />
    </div>
  );
}
