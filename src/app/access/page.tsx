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

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <AccessTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === "request" && <AccessRequest />}
      {activeTab === "permissions" && <ActivePermissions />}
      {activeTab === "roles" && <RoleAssignment />}
    </div>
  );
}
