"use client";

type Props = {
  activeTab: "request" | "permissions" | "roles";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"request" | "permissions" | "roles">
  >;
};

export default function AccessTabs({
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div className="mt-6 flex border rounded-xl p-1">
      <button
        onClick={() => setActiveTab("request")}
        className={`flex-1 py-2 rounded-lg transition ${
          activeTab === "request"
            ? "bg-[#344960] text-white"
            : "text-gray-600"
        }`}
      >
        Access Request
      </button>

      <button
        onClick={() => setActiveTab("permissions")}
        className={`flex-1 py-2 rounded-lg transition ${
          activeTab === "permissions"
            ? "bg-[#344960] text-white"
            : "text-gray-600"
        }`}
      >
        Active Permissions
      </button>

      <button
        onClick={() => setActiveTab("roles")}
        className={`flex-1 py-2 rounded-lg transition ${
          activeTab === "roles"
            ? "bg-[#344960] text-white"
            : "text-gray-600"
        }`}
      >
        Role Assignment
      </button>
    </div>
  );
}