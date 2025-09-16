import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";

const UDateTimePicker = ({
  name,
  label,
  size,
  placeholder,
  labelStyles = {},
  format,
  showTime = false,
  picker,
  style,
  disabledDate,
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
              label && label
            )
          }
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          <DatePicker
            {...field}
            showTime={{ use12Hours: true }}
            id={name}
            picker={picker}
            size={size}
            placeholder={placeholder}
            format={format}
            onChange={(date) => field.onChange(dayjs(date).utc())}
            value={field.value ? dayjs(field.value) : null}
            style={
              style
                ? style
                : {
                    height: "35px",
                    width: "100%",
                    border: "1px solid var(--input-border)",
                  }
            }
            disabledDate={disabledDate}
          />
        </Form.Item>
      )}
    />
  );
};

export default UDateTimePicker;
