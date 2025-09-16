import { Image, Avatar } from "antd";

export default function CustomAvatar({
  src,
  name,
  size = 52,
  style = {},
  ...props
}) {
  return src ? (
    <Image
      src={src}
      alt={"User avatar of " + name}
      width={size}
      height={size}
      className="aspect-square rounded-full bg-white object-cover object-center ring ring-primary ring-offset-transparent"
    />
  ) : (
    <Avatar
      size={size}
      style={{ backgroundColor: "rgba(144, 122, 105, 0.7)", ...style }}
    >
      {name && name[0].toString().toUpperCase()}
    </Avatar>
  );
}
