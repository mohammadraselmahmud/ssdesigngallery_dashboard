"use client";

import CustomModal from "@/components/CustomModal/CustomModal";
import FormWrapper from "@/components/Form/FormWrapper";
import UDatePicker from "@/components/Form/UDatePicker";
import UInput from "@/components/Form/UInput";
import USelect from "@/components/Form/USelect";
import UTextArea from "@/components/Form/UTextArea";
import UUpload from "@/components/Form/UUpload";
import { createAdSchema, updateAdSchema } from "@/schema/adSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const getFileUrl = (file) => {
  if (!file) return "";
  if (file.originFileObj) return URL.createObjectURL(file.originFileObj);
  return file.url || "";
};

function MediaPreview({ fileList, type }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const url = getFileUrl(fileList?.[0]);
    setPreviewUrl(url);
    return () => {
      if (fileList?.[0]?.originFileObj && url) URL.revokeObjectURL(url);
    };
  }, [fileList]);

  if (!previewUrl) return null;

  return type === "video" ? (
    <video controls className="mb-4 max-h-40 w-full rounded-lg bg-black" src={previewUrl} />
  ) : (
    <img src={previewUrl} alt="Selected ad media preview" className="mb-4 max-h-40 w-full rounded-lg object-contain" />
  );
}

function AdMediaField({ name, label, uploadTitle, type }) {
  const { control } = useFormContext();
  const fileList = useWatch({ control, name });

  return (
    <div>
      <UUpload
        name={name}
        label={label}
        uploadTitle={uploadTitle}
        maxCount={1}
        fileType={type}
      />
      <MediaPreview type={type} fileList={fileList} />
    </div>
  );
}

const existingMedia = (value, name) => {
  if (!value) return undefined;
  const url = typeof value === "string" ? value : value.url;
  return url ? [{ uid: `existing-${name}`, name: `${name} preview`, status: "done", url }] : undefined;
};

export default function AdModal({ open, setOpen, selectedAd, onSubmit, isLoading }) {
  const isEditing = Boolean(selectedAd?._id);
  const schema = isEditing ? updateAdSchema : createAdSchema;
  const defaultValues = isEditing
    ? {
        title: selectedAd.title || "",
        description: selectedAd.description || "",
        link: selectedAd.link || "",
        isActive: selectedAd.isActive ?? true,
        expiredAt: selectedAd.expiredAt ? dayjs(selectedAd.expiredAt).format("YYYY-MM-DD") : null,
        image: existingMedia(selectedAd.image || selectedAd.imageUrl || selectedAd.adImage, "image"),
        video: existingMedia(selectedAd.video || selectedAd.videoUrl || selectedAd.adVideo, "video"),
      }
    : { isActive: true };

  const handleSubmit = (data) => {
    const formData = new FormData();
    const { image, video, ...fields } = data;
    const normalizedFields = {
      ...fields,
      expiredAt: fields.expiredAt || undefined,
    };

    formData.append("data", JSON.stringify(normalizedFields));
    if (image?.[0]?.originFileObj) formData.append("image", image[0].originFileObj);
    if (video?.[0]?.originFileObj) formData.append("video", video[0].originFileObj);
    onSubmit(formData);
  };

  return (
    <CustomModal open={open} setOpen={setOpen} title={isEditing ? "Edit Ad" : "Create Ad"}>
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(schema)}
        defaultValues={defaultValues}
      >
        <UInput name="title" label="Title" placeholder="Enter ad title" required />
        <UTextArea name="description" label="Description" placeholder="Enter an optional description" />
        <UInput name="link" label="Link" placeholder="https://example.com" type="url" />
        <USelect
          name="isActive"
          label="Status"
          placeholder="Select status"
          options={[
            { value: true, label: "Active" },
            { value: false, label: "Inactive" },
          ]}
        />
        <UDatePicker
          name="expiredAt"
          label="Expiration date"
          placeholder="Select expiration date"
          format="YYYY-MM-DD"
          disabledDate={(current) => current && current < dayjs().startOf("day")}
        />
        <AdMediaField name="image" label="Image" uploadTitle="Image" type="image" />
        <AdMediaField name="video" label="Video" uploadTitle="Video" type="video" />
        <Button htmlType="submit" type="primary" className="w-full" size="large" loading={isLoading}>
          {isEditing ? "Update Ad" : "Create Ad"}
        </Button>
      </FormWrapper>
    </CustomModal>
  );
}
