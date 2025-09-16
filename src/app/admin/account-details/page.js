import AccountDetailsTable from "./_components/AccountDetailsTable";

export const metadata = {
  title: "Account Details",
  description: "User account details page",
};

export default function AccountDetailsPage() {
  return (
    <div className="min-h-[85vh]">
      <AccountDetailsTable />
    </div>
  );
}
