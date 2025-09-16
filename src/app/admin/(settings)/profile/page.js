import ProfileContainer from "./_components/ProfileContainer";

export const metadata = {
  title: "Profile",
  description: "Admin profile page",
};

export default function ProfilePage() {
  return (
    <div className="min-h-[85vh]">
      <ProfileContainer />
    </div>
  );
}
