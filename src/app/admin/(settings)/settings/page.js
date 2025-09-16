import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Settings",
  description: "Admin settings page",
};

const SETTINGS_LINKS = [
  {
    key: "personal-information",
    label: "Personal Information",
    route: "/admin/profile",
  },
  // {
  //   key: "privacy-policy",
  //   label: "Privacy Policy",
  //   route: "/admin/privacy-policy",
  // },
  // {
  //   key: "terms-conditions",
  //   label: "Terms & Conditions",
  //   route: "/admin/terms-conditions",
  // },
  // {
  //   key: "about-us",
  //   label: "About Us",
  //   route: "/admin/about-us",
  // },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {SETTINGS_LINKS.map((item) => (
        <Link
          key={item.key}
          href={item.route}
          className="flex-center-between rounded-lg bg-primary p-5 py-4 text-lg text-white"
        >
          <span>{item.label}</span>

          <ChevronRight size={22} />
        </Link>
      ))}
    </div>
  );
}
