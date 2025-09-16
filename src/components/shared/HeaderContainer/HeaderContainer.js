/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "antd";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout } from "antd";
import { AlignJustify } from "lucide-react";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useSelector } from "react-redux";
import { Avatar } from "antd"; 
import { toast } from "sonner"; 
import { Lock } from "lucide-react";
import useAdminPrivacyToken from "@/hooks/useAdminPrivacyToken";
const { Header } = Layout;

export default function HeaderContainer({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const navbarTitle = pathname.split("/admin")[1];
  const userId = useSelector((state) => state.auth.user)?.userId;   
  const { handleRemoveToken, getAdminPrivacyToken } = useAdminPrivacyToken();

  const { data: myProfileRes } = useGetProfileQuery({}, { skip: !userId });
  const myProfile = myProfileRes?.data || {}; 
 
 
  return (
    <Header
      style={{
        backgroundColor: "var(--primary-white)",
        color: "var(--primary-black)",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 0,
        paddingRight: "40px",
      }}
    >
      {/* Collapse Icon */}
      <div className="flex items-center gap-x-2 px-5">
        <Button
          type="text"
          icon={<AlignJustify strokeWidth={3} size={25} />}
          onClick={() => setCollapsed(!collapsed)}
          className="!text-primary-black"
        />

        <h1 className="text-3xl font-medium capitalize">
          {navbarTitle.length > 1
            ? navbarTitle.split("/")[1].replaceAll(/-/g, " ")
            : "account-details"}
        </h1>
      </div>

      {/* Right --- notification, user profile */}
      <div className="flex items-center gap-x-4">
        {getAdminPrivacyToken() && (
          <Button
            icon={<Lock size={16} />}
            iconPosition="end"
            type="primary"
            shape="round"
            className="!shadow-none"
            onClick={() => {
              handleRemoveToken();

              if (typeof window !== "undefined") {
                window.location.reload();
                toast.success("Admin privacy mode activated!");
              }
            }}
          >
            Lock
          </Button>
        )}
      

        {/* User */}
        <Link
          href={"/admin/profile"}
          className="hover:text-primary-blue group flex items-center gap-x-2 text-primary-black"
        >
          {myProfile?.image ? (
            <Image
              src={myProfile?.image}
              alt={`Avatar image of admin: ${myProfile?.name}`}
              width={52}
              height={52}
              className="aspect-square rounded-full border-2 border-primary-black p-0.5 group-hover:border"
            />
          ) : (
            <Avatar
              style={{
                backgroundColor: "var(--primary)",
                verticalAlign: "middle",
              }}
              size="large"
            >
              {myProfile?.name && myProfile?.name[0]}
            </Avatar>
          )}

          <h4 className="text-lg font-semibold hover:text-primary">
            {myProfile?.name}
          </h4>
        </Link>
      </div>
    </Header>
  );
}
