"use client";
import Logo from "@/assets/logos/Logo";
import "./Sidebar.css";
import LogoSmall from "@/assets/logos/LogoSmall";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  Users2,
  LogOut,
  House,
  Settings,
  BookOpenText,
  CircleDollarSign,
  GraduationCap,
  Package,
  Tag,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { successToast } from "@/utils/customToast";
import { Shapes } from "lucide-react";
import { Layers } from "lucide-react";

const SidebarContainer = ({ collapsed }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Logout handler
  const handleLogout = (e) => {
    if (e.key !== "logout") return;

    dispatch(logout());
    router.refresh();
    router.push("/login");
    successToast("Logout Successful!");
  };

  const sidebarLinks = [
    {
      key: "slider",
      icon: <Users2 size={21} strokeWidth={2} />,
      label: <Link href={"/admin/slider"}>Sliders</Link>,
    },
    {
      key: "account-details",
      icon: <Users2 size={21} strokeWidth={2} />,
      label: <Link href={"/admin/account-details"}>Account Details</Link>,
    },

    {
      key: "categories",
      icon: <Shapes size={21} strokeWidth={2} />,
      label: <Link href={"/admin/categories"}>Categories</Link>,
    },

    {
      key: "products",
      icon: <Layers size={21} strokeWidth={2} />,
      label: <Link href={"/admin/products"}>Products</Link>,
    },
    {
      key: "packages",
      icon: <Package size={21} strokeWidth={2} />,
      label: <Link href={"/admin/packages"}>Packages</Link>,
    },
    {
      key: "coupons",
      icon: <Tag size={21} strokeWidth={2} />,
      label: <Link href={"/admin/coupons"}>Coupons</Link>,
    },
    {
      key: "subscriptions",
      icon: <FileText size={21} strokeWidth={2} />,
      label: <Link href={"/admin/subscriptions"}>Subscriptions</Link>,
    },
    {
      key: "settings",
      icon: <Settings size={21} strokeWidth={2} />,
      label: <Link href={"/admin/settings"}>Settings</Link>,
    },
    {
      key: "logout",
      icon: <LogOut size={21} strokeWidth={2} />,
      label: "Logout",
    },
  ];

  // Get current path for sidebar menu item `key`
  const currentPathname = usePathname()?.replace("/admin/", "")?.split(" ")[0];

  return (
    <Sider
      width={320}
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={20}
      style={{
        paddingInline: "10px",
        paddingBlock: "80px",
        backgroundColor: "var(--primary-white)",
        maxHeight: "100vh",
        overflow: "hidden", // important for sliding effect
        transition: "all 0.5s ease-in-out", // inline transition fallback
      }}
      className={`scroll-hide overflow-hidden ${
        collapsed ? "max-w-0 opacity-0" : "max-w-[320px] opacity-100"
      }`}
    >
      {/* <div className="mb-6 flex flex-col items-center justify-center gap-y-5">
    <Link href={"/"}>{collapsed ? <LogoSmall /> : <Logo />}</Link>
  </div> */}

      <Menu
        onClick={handleLogout}
        defaultSelectedKeys={[currentPathname]}
        mode="inline"
        className="sidebar-menu space-y-2.5 !border-none !bg-transparent !pb-10"
        items={sidebarLinks}
      />
    </Sider>
  );
};

export default SidebarContainer;
