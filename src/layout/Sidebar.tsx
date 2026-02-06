"use client";

import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Shield,
  Truck,
  Users,
  KeyRound 
} from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();

  // first URL segment (dashboard, projects, etc.)
  const activeSegment = segments[0];

  const menu = [
    { name: "Dashboard", segment: "dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", segment: "projects", path: "/projects", icon: FolderKanban },
    { name: "Administration", segment: "administration", path: "/administration", icon: Shield },
    { name: "Vendor Management", segment: "vendors", path: "/vendors", icon: Truck },
    { name: "Labour Management", segment: "labour", path: "/labour", icon: Users },
    { name: "Access", segment: "access", path: "/access", icon: KeyRound },
  ];

  return (
    <aside className="w-[300px] bg-white h-screen px-4 py-6 border-r border-gray-200">
      
      {/* Profile */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src="https://www.vanurmedia.com/images/logo-1.png"
          className="w-10 h-10 rounded-full"
          alt="profile"
        />
        <div>
          <h3 className="font-semibold text-gray-900">Abhishek</h3>
          <p className="text-xs text-gray-500">Manager</p>
        </div>
      </div>

      <div className="h-px bg-gray-200 mb-4" />

      {/* Menu */}
      <nav className="space-y-2">
        {menu.map(({ name, path, icon: Icon, segment }) => {
          const isActive = segments.includes(segment);


          return (
            <button
              key={name}
              onClick={() => router.push(path)}
              className={`w-full h-10 px-4 flex items-center gap-3 rounded-lg text-sm transition
                ${
                  isActive
                    ? "bg-[#344960] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon size={17} />
              {name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;