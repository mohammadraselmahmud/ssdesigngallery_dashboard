import { Upload, Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { UploadCloud } from "lucide-react";
import { CloudUpload } from "lucide-react";
import { message } from "antd";

export default function UUpload({
  name,
  label,
  uploadTitle,
  maxCount,
  labelStyles = {},
  fileList,
  fileType = "image",
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={fileList}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-3">
          <label style={labelStyles} className="mb-2 block font-medium">
            {label}
          </label>

          <div className="flex-center h-32 w-full rounded-xl border-2 border-dashed border-gray-300">
            <Upload
              name={field.name}
              listType="picture"
              maxCount={maxCount}
              fileList={field.value || []}
              onChange={(info) => {
                field.onChange(info.fileList);
              }}
              beforeUpload={(file) => {
                if (!file.type.startsWith(fileType)) {
                  message.error(
                    `You can't upload file of type ${file.type} to a field that only supports ${fileType} files!!`,
                  );
                  return Upload.LIST_IGNORE;
                }
                return true;
              }}
            >
              <button
                type="button"
                className="flex-center !mx-auto w-max gap-x-2 rounded-md border border-black/10 bg-white px-4 py-2 font-medium shadow-sm transition-all duration-300 ease-in-out active:scale-95"
              >
                <CloudUpload size={20} /> Upload {uploadTitle}
              </button>
            </Upload>
          </div>

          {error && <p className="text-danger">{error.message}</p>}
        </div>
      )}
    />
  );
}
