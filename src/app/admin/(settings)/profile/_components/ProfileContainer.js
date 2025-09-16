"use client";

import Image from "next/image";
import adminImg from "@/assets/images/user-avatar.png";
import { ImagePlus } from "lucide-react";
import ChangePassForm from "./ChangePassForm";
import EditProfileForm from "./EditProfileForm";
import { Tabs } from "antd";
import { ConfigProvider } from "antd";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { Avatar } from "antd";
import ChangeProfilePicModal from "./ChangeProfilePicModal";
import { useState } from "react";

const customAntTheme = {
  components: {
    Form: {
      labelColor: "white",
    },
    Input: {
      colorBgContainerDisabled: "var(--foundation-white-darker)",
      colorTextDisabled: "lightGray",
    },
  },
};

export default function ProfileContainer() {
  const userId = useSelector((state) => state.auth.user)?.userId;
  const [showChangePicModal, setShowChangePicModal] = useState(false);

  const { data: myProfileRes } = useGetProfileQuery({}, { skip: !userId });
  const myProfile = myProfileRes?.data || {};

  const tabItems = [
    {
      key: "editProfile",
      label: "Edit Profile",
      children: (
        <ConfigProvider theme={customAntTheme}>
          <EditProfileForm myProfile={myProfile} />
        </ConfigProvider>
      ),
    },
    {
      key: "changePassword",
      label: "Change Password",
      children: (
        <ConfigProvider theme={customAntTheme}>
          <ChangePassForm />
        </ConfigProvider>
      ),
    },
  ];

  return (
    <div>
      {/* Profile pic */}
      <section className="flex-center gap-x-3 bg-primary py-8 text-white">
        <div className="relative w-max">
          {myProfile?.image ? (
            <Image
              src={myProfile?.image}
              alt="Avatar image of admin"
              width={1200}
              height={1200}
              className="aspect-square h-auto w-[150px] rounded-full p-1"
            />
          ) : (
            <Avatar
              style={{
                backgroundColor: "#fff",
                color: "#000",
                verticalAlign: "middle",
                height: "150px",
                width: "150px",
                fontSize: "2rem",
              }}
            >
              {myProfile?.name && myProfile?.name[0]}
            </Avatar>
          )}

          {/* Edit button */}
          <button
            className="flex-center absolute bottom-2 right-2 aspect-square rounded-full bg-foundation-white-darker p-2 text-white/95"
            onClick={() => setShowChangePicModal(true)}
          >
            <ImagePlus size={18} />
          </button>
        </div>

        <div>
          <h3 className="text-3xl font-semibold">{myProfile?.name}</h3>
          <p className="text-primary-blue mt-1 text-lg font-medium">
            Administrator
          </p>
        </div>
      </section>

      {/* Profile Information Forms */}
      <section className="mx-auto my-16 w-full px-5 md:w-3/4 md:px-0 xl:w-1/2">
        <Tabs defaultActiveKey="editProfile" centered items={tabItems} />
      </section>

      <ChangeProfilePicModal
        open={showChangePicModal}
        setOpen={setShowChangePicModal}
        profile={myProfile}
      />
    </div>
  );
}
