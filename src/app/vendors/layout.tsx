
import VendorManagementTabs from "@/src/component/vendors/VendorManagementNav";


export default function VendorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 space-y-6">
      {/* FIXED HEADER */}
      <VendorManagementTabs />
      
     
      <div>{children}</div>
    </div>
  );
}