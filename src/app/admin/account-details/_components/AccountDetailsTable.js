"use client";

import { Input, Table } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Search } from "lucide-react";
import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import ProfileModal from "@/components/SharedModals/ProfileModal";
import { Tag } from "antd";
import { UserRoundX } from "lucide-react";
import {
  useBlockUserMutation,
  useGetAllUsersQuery,
  useUnblockUserMutation,
} from "@/redux/api/userApi";
import { Avatar } from "antd";
import { Image } from "antd";
import dayjs from "dayjs";
import { errorToast, successToast } from "@/utils/customToast";
import { UserCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EyeIcon } from "lucide-react";
import { Flex } from "antd";

export default function AccountDetailsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const currentPathname = usePathname();

  // Get all users
  const {
    data: allUsersRes,
    isLoading,
    refetch,
  } = useGetAllUsersQuery({
    limit: 99999,
    sort: "-createdAt",
    searchTerm,
  }); 
  const allUsers = allUsersRes?.data?.data || [];
 
  // ================== Table Columns ================
  const columns = [
    {
      title: "Name",
      dataIndex: "",
      render: (value) => (
        <div className="flex-center-start gap-x-3">
          {value?.image ? (
            <Image
              src={value?.image}
              alt={"User avatar of" + value?.name}
              width={50}
              height={50}
              className="aspect-square rounded-full bg-white ring ring-primary ring-offset-transparent"
            />
          ) : (
            <Avatar
              style={{
                backgroundColor: "var(--primary)",
                verticalAlign: "middle",
                }}
                size="large"
            >
              {value?.fullName?.slice(0,1).toUpperCase()}
            </Avatar>
           
          )}

          <p className="font-medium">{value?.name}</p>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },
    
    {
      title: "Joined At",
      dataIndex: "createdAt",
      render: (value) => <p>{dayjs(value).format("DD MMM, YYYY")}</p>,
    },
    // {
    //   title: "Status",
    //   dataIndex: "emailVerified",
    //   render: (value) => {
         
    //     return (
    //     <Tag
    //       color={value === "active" ? "green" : "red"}
    //       className="capitalize"
    //     >
    //       {value}
    //     </Tag>
    //   )}
    // },
    // {
    //   title: "Action",
    //   render: (value) => (
    //     <Flex align="center" justify="start" gap={16}>
    //       <Tooltip title="View Details">
    //         <Link href={currentPathname + `/${value?._id}`}>
    //           <EyeIcon color="#fff" size={22} />
    //         </Link>
    //       </Tooltip>

    //       {value?.status === "blocked" ? (
    //         <Tooltip title="Unblock User">
    //           <div className="w-max">
    //             <CustomConfirm
    //               title="Unblock User"
    //               description="Are you sure to unblock this user?"
    //               onConfirm={() => handleUnblockUser(value?._id)}
    //             >
    //               <button>
    //                 <UserCheck color="lightGreen" size={20} />
    //               </button>
    //             </CustomConfirm>
    //           </div>
    //         </Tooltip>
    //       ) : (
    //         <Tooltip title="Block User">
    //           <div className="w-max">
    //             <CustomConfirm
    //               title="Block User"
    //               description="Are you sure to block this user?"
    //               onConfirm={() => handleBlockUser(value?._id)}
    //             >
    //               <button>
    //                 <UserRoundX color="#F16365" size={20} />
    //               </button>
    //             </CustomConfirm>
    //           </div>
    //         </Tooltip>
    //       )}
    //     </Flex>
    //   ),
    // },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#322b25",
          colorInfo: "#322b25",
        },
      }}
    >
      <div className="flex-center-between mb-4 px-1">
        <h2 className="text-[26px] font-semibold text-white">
          Account Details
        </h2>

        <Input
          placeholder="Search by name or email"
          prefix={<Search className="mr-2 text-muted" size={18} />}
          className="h-10 !w-1/2 !rounded-lg !border !text-base lg:!w-1/3 2xl:!w-1/4"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table
        style={{ overflowX: "auto" }}
        columns={columns}
        dataSource={allUsers}
        scroll={{ x: "100%" }}
        loading={isLoading}
        pagination
      ></Table>

      <ProfileModal open={profileModalOpen} setOpen={setProfileModalOpen} />
    </ConfigProvider>
  );
}
