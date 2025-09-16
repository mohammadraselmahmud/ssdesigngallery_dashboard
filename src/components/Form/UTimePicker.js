import { TimePicker } from "antd";
import { Form } from "antd";
import { Controller } from "react-hook-form";

export default function UTimePicker({
  label,
  name,
  use12Hours = true,
  format = "HH:mm a",
  placeholder,
}) {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          <TimePicker
            {...field}
            use12Hours={use12Hours}
            format={format}
            placeholder={placeholder}
            style={{
              height: "35px",
              width: "100%",
              border: "1px solid var(--input-border)",
            }}
          />
        </Form.Item>
      )}
    />
  );
}
