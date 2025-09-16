"use client";

import { Form, Select } from "antd";
import { Controller } from "react-hook-form";

const UTags = ({
  name,
  label,
  size,
  placeholder,
  disabled = false,
  labelStyles = {},
  className,
  style,
  required,
}) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={
            Object.keys(labelStyles)?.length > 0 ? (
              <label style={labelStyles}>{label}</label>
            ) : (
              label
            )
          }
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          <Select
            {...field}
            mode="tags" // 👈 makes it a tag input
            tokenSeparators={[","]} // optional: allows comma separation
            size={size}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
             style={{
              ...style,
              height: style?.height || "35px",
            }}
          />
        </Form.Item>
      )}
    />
  );
};

export default UTags;
