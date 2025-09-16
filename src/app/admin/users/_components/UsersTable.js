"use client";

import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Table, Tooltip } from "antd";
import { Eye } from "lucide-react";
import Image from "next/image";
import userImage from "@/assets/images/user-avatar-lg.png";
import { useState } from "react";
import ProfileModal from "@/components/SharedModals/ProfileModal";
import { UserRoundX } from "lucide-react";

const usersData = Array.from({ length: 5 }).map((_, inx) => ({
  key: inx + 1,
  name: "Justina Ojuylub",
  userImg: userImage,
  email: "justina@gmail.com",
  contact: "+1234567890",
  date: "11 oct 24, 11:10 PM",
}));

export default function UsersTable() {
  const [showProfileModal, setShowProfileModal] = useState(false);

  // =============== Table columns ===============
  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      render: (value) => `#${value}`,
    },
    {
      title: "Full Name",
      dataIndex: "name",
      render: (value, record) => (
        <div className="flex-center-start gap-x-2">
          <Image
            src={record.userImg}
            alt="User avatar"
            width={50}
            height={50}
            className="aspect-square rounded-full"
          />
          <p>{value}</p>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Action",
      render: () => (
        <div className="flex-center-start gap-x-4">
          <Tooltip title="Show Details">
            <button onClick={() => setShowProfileModal(true)}>
              <Eye color="var(--secondary)" size={23} />
            </button>
          </Tooltip>

          <Tooltip title="Block User">
            <CustomConfirm description="Are you sure you want to block this user?">
              <button>
                <UserRoundX color="var(--danger)" size={22} />
              </button>
            </CustomConfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        style={{ overflowX: "auto" }}
        columns={columns}
        dataSource={usersData}
        scroll={{ x: "100%" }}
      ></Table>

      <ProfileModal open={showProfileModal} setOpen={setShowProfileModal} />
    </div>
  );
}
