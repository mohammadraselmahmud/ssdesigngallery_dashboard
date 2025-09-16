import { Spin } from "antd";

export default function PageLoader() {
  return (
    <div className="flex-center h-[75vh]">
      <Spin size="large" />
    </div>
  );
}
