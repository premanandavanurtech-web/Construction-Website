"use client";

import { useState } from "react";

import AccessRequest from "@/src/component/access/AccessRequest";
import ActivePermissions from "@/src/component/access/ActivePermissions";
import RoleAssignment from "@/src/component/access/RoleAssignment";
import AccessTabs from "@/src/component/access/AccessTabs";

export default function AccessPage() {
  const [activeTab, setActiveTab] = useState<
    "request" | "permissions" | "roles"
  >("request");

  // Each time we switch TO the request tab, bump this key
  // so React unmounts + remounts <AccessRequest />, forcing a fresh localStorage read
  const [requestKey, setRequestKey] = useState(0);

  const handleTabChange = (tab: "request" | "permissions" | "roles") => {
    if (tab === "request") {
      setRequestKey((k) => k + 1);
    }
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <AccessTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Tab Content */}
      {activeTab === "request" && (
        <AccessRequest key={requestKey} />
      )}
      {activeTab === "permissions" && <ActivePermissions />}
      {activeTab === "roles" && <RoleAssignment />}
    </div>
  );
}