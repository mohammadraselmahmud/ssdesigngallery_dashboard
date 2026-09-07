"use client";

import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import {
  useCreateAdMutation,
  useDeleteAdMutation,
  useGetAllAdsQuery,
  useUpdateAdMutation,
} from "@/redux/api/adsApi";
import { errorToast, successToast } from "@/utils/customToast";
import { ConfirmModal } from "@/utils/modalHook";
import { Button, ConfigProvider, Input, Pagination, Select, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { Megaphone, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import AdModal from "./AdModal";

const getErrorMessage = (error) => error?.data?.message || error?.message || "Something went wrong";
const getMediaUrl = (ad, type) => {
  const value = type === "image"
    ? ad?.image || ad?.imageUrl || ad?.adImage
    : ad?.video || ad?.videoUrl || ad?.adVideo;
  return typeof value === "string" ? value : value?.url;
};
const getAds = (response) => response?.data?.data || response?.data || [];
const getMeta = (response) => response?.data?.meta || response?.meta || {};

export default function AdsContainer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isActive, setIsActive] = useState(undefined);
  const [expiredAt, setExpiredAt] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [fields, setFields] = useState("");

  const query = {
    page,
    limit,
    searchTerm: searchTerm || undefined,
    isActive,
    expiredAt: expiredAt || undefined,
    sort,
    fields: fields || undefined,
  };
  const { data: adsResponse, isLoading, isFetching } = useGetAllAdsQuery(query);
  const ads = getAds(adsResponse);
  const meta = getMeta(adsResponse);

  const [createAd, { isLoading: isCreating }] = useCreateAdMutation();
  const [updateAd, { isLoading: isUpdating }] = useUpdateAdMutation();
  const [deleteAd, { isLoading: isDeleting }] = useDeleteAdMutation();

  const openCreate = () => {
    setSelectedAd(null);
    setModalOpen(true);
  };
  const openEdit = (ad) => {
    setSelectedAd(ad);
    setModalOpen(true);
  };
  const handleSubmit = async (body) => {
    try {
      if (selectedAd?._id) {
        await updateAd({ id: selectedAd._id, body }).unwrap();
        successToast("Ad updated successfully!");
      } else {
        await createAd(body).unwrap();
        successToast("Ad created successfully!");
      }
      setModalOpen(false);
    } catch (error) {
      errorToast(getErrorMessage(error));
    }
  };
  const handleDelete = (id) => {
    ConfirmModal("Delete this ad?", "The ad will be removed from the active ads list.").then(async ({ isConfirmed }) => {
      if (!isConfirmed) return;
      try {
        await deleteAd(id).unwrap();
        successToast("Ad deleted successfully!");
      } catch (error) {
        errorToast(getErrorMessage(error));
      }
    });
  };

  const columns = [
    {
      title: "Media",
      key: "media",
      render: (_, ad) => {
        const imageUrl = getMediaUrl(ad, "image");
        const videoUrl = getMediaUrl(ad, "video");
        return (
          <Space size={8}>
            {imageUrl ? <img src={imageUrl} alt={ad.title || "Ad"} className="h-14 w-20 rounded object-cover" /> : null}
            {videoUrl ? <video src={videoUrl} muted className="h-14 w-20 rounded object-cover" /> : null}
            {!imageUrl && !videoUrl ? <span className="text-muted">No media</span> : null}
          </Space>
        );
      },
    },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (link) => link ? <a href={link} target="_blank" rel="noreferrer" className="text-blue-600">Open link</a> : "-",
    },
    {
      title: "Status",
      key: "status",
      render: (_, ad) => <Tag color={ad.isActive ? "green" : "default"}>{ad.isActive ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Expires",
      dataIndex: "expiredAt",
      key: "expiredAt",
      render: (date) => {
        if (!date) return "Never";
        const expired = dayjs(date).isBefore(dayjs());
        return <Tag color={expired ? "red" : "blue"}>{dayjs(date).format("MMM D, YYYY")}{expired ? " (Expired)" : ""}</Tag>;
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date ? dayjs(date).format("MMM D, YYYY") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, ad) => (
        <Space>
          <Button onClick={() => openEdit(ad)}>Edit</Button>
          <Button danger loading={isDeleting} onClick={() => handleDelete(ad._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#322b25", colorInfo: "#322b25" } }}>
      <Button type="primary" size="large" icon={<PlusCircle size={20} />} onClick={openCreate} className="!w-full !py-6">
        Create Ad
      </Button>
      <section className="mt-6 space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h3 className="text-2xl font-semibold text-white"><Megaphone className="mr-2 inline" size={24} /> Ads List</h3>
          <Input
            value={searchTerm}
            placeholder="Search ads"
            prefix={<Search className="mr-2 text-muted" size={18} />}
            className="h-10 xl:!w-1/4"
            onChange={(event) => { setPage(1); setSearchTerm(event.target.value); }}
          />
        </div>
        <div className="flex flex-wrap gap-3 rounded-lg bg-white p-4">
          <Select allowClear placeholder="Status" className="min-w-32" value={isActive} onChange={(value) => { setPage(1); setIsActive(value); }} options={[{ value: true, label: "Active" }, { value: false, label: "Inactive" }]} />
          <Input type="date" value={expiredAt} onChange={(event) => { setPage(1); setExpiredAt(event.target.value); }} className="w-44" />
          <Select value={sort} onChange={setSort} className="min-w-44" options={[{ value: "-createdAt", label: "Newest first" }, { value: "createdAt", label: "Oldest first" }, { value: "title", label: "Title A-Z" }, { value: "-title", label: "Title Z-A" }]} />
          <Input value={fields} onChange={(event) => setFields(event.target.value)} placeholder="Fields (e.g. title,link)" className="w-52" />
        </div>
        {isLoading ? <PageLoader /> : ads.length ? <Table rowKey="_id" loading={isFetching} columns={columns} dataSource={ads} scroll={{ x: 1050 }} pagination={false} /> : <EmptyContainer />}
        <div className="ml-auto w-max">
          <Pagination
            pageSize={limit}
            current={page}
            total={meta.total || 0}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50", "100"]}
            onChange={(nextPage, nextLimit) => { setPage(nextPage); setLimit(nextLimit); }}
          />
        </div>
      </section>
      <AdModal open={modalOpen} setOpen={setModalOpen} selectedAd={selectedAd} onSubmit={handleSubmit} isLoading={isCreating || isUpdating} />
    </ConfigProvider>
  );
}
