"use client";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Button,
} from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { errorToast, successToast } from "@/utils/customToast";
import {
  useCreateCouponMutation,
  useEditCouponMutation,
} from "@/redux/api/couponApi";
import { useGetAllPackagesQuery } from "@/redux/api/packageApi";

const { RangePicker } = DatePicker;

const generateCouponCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = new Uint32Array(8);
  window.crypto.getRandomValues(values);
  return `SAVE${Array.from(values, (value) => alphabet[value % alphabet.length]).join("")}`;
};

export default function AddEditCouponModal({
  open,
  setOpen,
  selectedCoupon,
  onSuccess,
}) {
  const [form] = Form.useForm();

  const { data: packagesRes } = useGetAllPackagesQuery({ limit: 9999 });
  const packages = packagesRes?.records || [];

  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [editCoupon, { isLoading: editing }] = useEditCouponMutation();

  useEffect(() => {
    if (selectedCoupon) {
      form.setFieldsValue({
        ...selectedCoupon,
        applicablePackages: (selectedCoupon.applicablePackages || [])
          .map((item) => (typeof item === "string" ? item : item?._id))
          .filter(Boolean),
        startsAt: selectedCoupon.startsAt
          ? dayjs(selectedCoupon.startsAt)
          : null,
        expiresAt: selectedCoupon.expiresAt
          ? dayjs(selectedCoupon.expiresAt)
          : null,
        perUserLimit: selectedCoupon.perUserLimit ?? 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        perUserLimit: 1,
        discountType: "percentage",
        isActive: true,
        applicablePackages: [],
      });
    }
  }, [selectedCoupon, form]);

  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        code: (values.code || "").toUpperCase(),
        startsAt: values.startsAt ? values.startsAt.toISOString() : null,
        expiresAt: values.expiresAt?.toISOString(),
        applicablePackages: values.applicablePackages || [],
      };

      if (selectedCoupon) {
        await editCoupon({ id: selectedCoupon._id, data: payload }).unwrap();
        successToast("Coupon updated successfully");
      } else {
        await createCoupon(payload).unwrap();
        successToast("Coupon created successfully");
      }

      await onSuccess?.();
      setOpen(false);
    } catch (error) {
      errorToast(error?.message || error?.data?.message);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      title={selectedCoupon ? "Edit Coupon" : "Add Coupon"}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="code"
          label="Code"
          rules={[{ required: true, message: "Code required" }]}
        >
          <Input
            addonAfter={
              <Button
                type="text"
                className="!-mx-3"
                onClick={() => form.setFieldValue("code", generateCouponCode())}
              >
                Generate
              </Button>
            }
            onChange={(e) =>
              form.setFieldValue("code", e.target.value.toUpperCase())
            }
            placeholder="Enter or generate a coupon code"
          />
        </Form.Item>

        <Form.Item
          name="discountType"
          label="Discount Type"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="percentage">Percentage</Select.Option>
            <Select.Option value="fixed">Fixed</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="discountValue"
          label="Discount Value"
          rules={[
            {
              required: true,
              type: "number",
              min: 0.01,
              message: "Discount must be greater than zero",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const type = getFieldValue("discountType");
                if (type === "percentage" && value > 100) {
                  return Promise.reject(
                    new Error("Percentage cannot exceed 100"),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="minPurchase"
          label="Minimum Purchase"
          rules={[{ type: "number", min: 0 }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          shouldUpdate={(prev, curr) => prev.discountType !== curr.discountType}
          noStyle
        >
          {({ getFieldValue }) =>
            getFieldValue("discountType") !== "fixed" ? (
              <Form.Item
                name="maxDiscount"
                label="Maximum Discount"
                rules={[{ type: "number", min: 0.01 }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item
          name="usageLimit"
          label="Usage Limit"
          rules={[{ type: "number", min: 1 }]}
        >
          <InputNumber min={1} precision={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="perUserLimit"
          label="Per User Limit"
          initialValue={1}
          rules={[{ type: "number", min: 1 }]}
        >
          <InputNumber min={1} precision={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="startsAt" label="Starts At">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="expiresAt"
          label="Expires At"
          dependencies={["startsAt"]}
          rules={[
            { required: true, message: "Expiry required" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const start = getFieldValue("startsAt");
                if (start && value && !dayjs(value).isAfter(dayjs(start))) {
                  return Promise.reject(
                    new Error("Expiry must be after start date"),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="applicablePackages" label="Applicable Packages">
          <Select
            mode="multiple"
            allowClear
            placeholder="Select packages (empty = all)"
          >
            {packages.map((p) => (
              <Select.Option key={p._id} value={p._id}>
                {p.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-x-2">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating || editing}
            >
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
