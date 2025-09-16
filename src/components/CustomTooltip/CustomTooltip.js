import { Tooltip } from "antd";

export default function CustomTooltip({
  children,
  placement = "top",
  title = "Tooltip",
}) {
  return (
    <Tooltip title={title} placement={placement}>
      {children}
    </Tooltip>
  );
}
