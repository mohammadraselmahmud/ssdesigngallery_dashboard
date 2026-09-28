"use client";
import { Alert, Button, Input, Pagination, Table, Tag } from "antd";
import { PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import { ConfirmModal } from "@/utils/modalHook";
import { errorToast, successToast } from "@/utils/customToast";
import AddEditPackageModal from "./AddEditPackageModal";
import {
  useDeletePackageMutation,
  useGetAllPackagesQuery,
} from "@/redux/api/packageApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { canManageAdminResources } from "@/utils/adminAccess";

export default function PackagesContainer() {
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

  const { data: packagesRes, isLoading, isError, refetch } = useGetAllPackagesQuery(query, { skip: !hasAccess });
  const packages = packagesRes?.records || [];
  const meta = packagesRes?.meta || {};

  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();

  const handleDelete = (id) => {
    ConfirmModal("Are you sure?", "Package will be deleted permanently.").then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deletePackage(id).unwrap();
          await refetch();
          successToast("Package deleted successfully");
        } catch (error) {
          errorToast(error?.message || error?.data?.message);
        }
      }
    });
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", sorter: (a, b) => String(a.title || "").localeCompare(String(b.title || "")) },
    { title: "Plan Name", dataIndex: "planName", key: "planName", sorter: (a, b) => String(a.planName || "").localeCompare(String(b.planName || "")) },
    { title: "Product ID", dataIndex: "productId", key: "productId", sorter: (a, b) => String(a.productId || "").localeCompare(String(b.productId || "")) },
    { title: "Price", dataIndex: "price", key: "price", sorter: (a, b) => Number(a.price || 0) - Number(b.price || 0) },
    { title: "Total Days", dataIndex: "totalDays", key: "totalDays", sorter: (a, b) => Number(a.totalDays || 0) - Number(b.totalDays || 0) },
    { title: "Limit", dataIndex: "limit", key: "limit", sorter: (a, b) => Number(a.limit || 0) - Number(b.limit || 0) },
    {
      title: "Recommended",
      dataIndex: "isRecommended",
      key: "isRecommended",
      render: (val) => <Tag color={val ? "gold" : "default"}>{val ? "Recommended" : "Standard"}</Tag>,
    },
    { title: "Status", dataIndex: "status", key: "status", render: (value) => value ? <Tag color={value === "active" ? "green" : "default"}>{value.toUpperCase()}</Tag> : "—" },
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
          <Button danger loading={isDeleting} onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (!hasAccess) return <Alert type="error" showIcon message="You do not have permission to manage packages." />;
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
        Add Package
      </Button>

      <section className="mt-6">
        <div className="flex-center-between mb-4 px-1">
          <h3 className="mb-4 text-2xl font-semibold text-white">Packages</h3>

          <Input
            placeholder="Search by title or product id"
            prefix={<Search className="mr-2 text-muted" size={18} />}
            className="h-10 !w-1/2 !rounded-lg !border !text-base lg:!w-1/3"
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <div className="rounded-xl bg-white p-6 text-center"><p className="mb-3">Could not load packages.</p><Button onClick={refetch}>Retry</Button></div>
        ) : packages?.length > 0 ? (
          <Table
            dataSource={packages}
            columns={columns}
            rowKey={(r) => r._id}
            pagination={false}
          />
        ) : (
          <EmptyContainer />
        )}
      </section>

      <div className="ml-auto mt-6 w-max">
        <Pagination
          pageSize={limit}
          current={currentPage}
          onChange={(page, pageSize) => (setCurrentPage(page), setLimit(pageSize))}
          total={meta.total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50", "100"]}
        />
      </div>

      <AddEditPackageModal
        open={showModal}
        setOpen={setShowModal}
        selectedPackage={editing}
        onSuccess={refetch}
      />
    </div>
  );
}
