"use client";
import { Modal, Form, Input, InputNumber, Switch, Button } from "antd";
import { useEffect } from "react";
import {
  useCreatePackageMutation,
  useEditPackageMutation,
  useGetPackageByIdQuery,
} from "@/redux/api/packageApi";
import { errorToast, successToast } from "@/utils/customToast";

export default function AddEditPackageModal({ open, setOpen, selectedPackage, onSuccess }) {
  const [form] = Form.useForm();

  const [createPackage, { isLoading: creating }] = useCreatePackageMutation();
  const [editPackage, { isLoading: editing }] = useEditPackageMutation();

  useEffect(() => {
    if (selectedPackage) {
      form.setFieldsValue({
        title: selectedPackage.title,
        planName: selectedPackage.planName,
        productId: selectedPackage.productId,
        description: selectedPackage.description,
        price: selectedPackage.price,
        totalDays: selectedPackage.totalDays,
        limit: selectedPackage.limit,
        isRecommended: !!selectedPackage.isRecommended,
      });
    } else {
      form.resetFields();
    }
  }, [selectedPackage, form]);

  const handleFinish = async (values) => {
    try {
      if (selectedPackage) {
        await editPackage({ id: selectedPackage._id, data: values }).unwrap();
        successToast("Package updated successfully");
      } else {
        await createPackage(values).unwrap();
        successToast("Package created successfully");
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
      title={selectedPackage ? "Edit Package" : "Add Package"}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}> 
          <Input />
        </Form.Item>

        <Form.Item name="planName" label="Plan Name" rules={[{ required: false }]}> 
          <Input />
        </Form.Item>

        <Form.Item name="productId" label="Product ID" rules={[{ required: true, message: "Product ID is required" }]}> 
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true, message: "Price is required" }, { type: 'number', min: 0, message: 'Price must be positive' }]}> 
          <InputNumber min={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="totalDays" label="Total Days" rules={[{ required: true, message: "Total days required" }, { type: 'number', min: 1, message: 'Must be positive integer' }]}> 
          <InputNumber min={1} precision={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="limit" label="Limit" rules={[{ required: true, message: "Limit required" }, { type: 'integer', min: 0, message: 'Limit must be a whole number of 0 or more' }]}>
          <InputNumber min={0} precision={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="isRecommended" label="Recommended" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <div className="flex gap-x-2 justify-end">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating || editing}>
              {selectedPackage ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
