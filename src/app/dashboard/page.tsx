"use client";

import { useEffect, useState } from "react";

import ActionCards from "../../component/dashboard/ActionCard";
import Alerts from "../../component/dashboard/Alerts";
import BudgetDistribution from "../../component/dashboard/BudgetDistribution";
import DashboardStats from "../../component/dashboard/DashboardStats";
import ModuleCard from "../../component/dashboard/ModuleCard";
import OnTimeVsDelayed from "../../component/dashboard/OnTimeVsDelayed";
import ProgressChart from "../../component/dashboard/ProgressChat";
import ProjectCard from "../../component/dashboard/ProjectCard";
import CreateProjectModal, {
  Task,
  TaskInput,
} from "../../component/dashboard/CreateProjectModal";

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<Task[]>([]);

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  // Create project
  const handleCreate = (task: TaskInput) => {
    const newProject: Task = {
      id: crypto.randomUUID(),
      project: task.project,
      location: task.location,
       image: task.image ?? null,
      createdAt: Date.now(),
    expiresAt: Date.now() + ONE_WEEK

    };

  
  const updated = [...projects, newProject];
  setProjects(updated);
  localStorage.setItem("tasks", JSON.stringify(updated));
};

 

  // Delete project
  const handleDelete = (id: string) => {
    const updated = projects.filter((item) => item.id !== id);
    setProjects(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };
  
useEffect(() => {
  const savedProjects = localStorage.getItem("tasks");

  if (savedProjects) {
    setProjects(JSON.parse(savedProjects) as Task[]);
  }
}, []);


  return (
    <div className="p-6 min-h-screen">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-black">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time insights across all projects and modules
          </p>
        </div>

        <button className="w-[208px] h-[40px] rounded-xl bg-[#344960] text-white font-medium">
          Export
        </button>
      </div>

      {/* Action Cards */}
     <ActionCards onCreateTask={() => setShowModal(true)} />

      {/* Project Portfolio */}
      <div className="mt-8">
        <h2 className="font-medium text-[16px] text-black mb-4">
          Project Portfolio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((item) => (
            <ProjectCard
              key={item.id}
              id={item.id}
              slug={item.id}
              project={item.project}
              location={item.location}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* ✅ MODULE STATUS — FULLY RESTORED */}
        <div className="py-5 mb-4">
          <h1 className="text-black mb-4 font-medium text-[16px]">
            Module status
          </h1>

          <div className="grid grid-cols-4 gap-4">
            <ModuleCard
              title="Recce"
              progress={65}
              rows={[
                { label: "Surveyed", value: "65%" },
                { label: "15 sites pending", value: "" },
              ]}
            />

            <ModuleCard
              title="Design"
              rows={[
                { label: "Approved", value: 42 },
                {
                  label: "Pending-8",
                  value: "Rev 3.2",
                  valueColor: "text-gray-500",
                },
              ]}
            />

            <ModuleCard
              title="BOQ"
              rows={[
                { label: "Total Value", value: "₹85.6L" },
                {
                  label: "Pending-8",
                  value: "Issues-3",
                  valueColor: "text-red-500",
                },
              ]}
            />

            <ModuleCard
              title="Orders"
              rows={[
                { label: "In Progress", value: 18 },
                {
                  label: "Delivered-45",
                  labelColor: "text-green-300",
                  value: "Late-8",
                  valueColor: "text-red-500",
                },
              ]}
            />

            <ModuleCard
              title="Work Progress"
              progress={65}
              rows={[
                { label: "Surveyed", value: "65%" },
                { label: "Delays-2", value: "Logs-123" },
              ]}
            />

            <ModuleCard
              title="Snag"
              rows={[
                { label: "Open issues", value: 24 },
                {
                  label: "Resolved-45",
                  labelColor: "text-green-300",
                  value: "Critical-8",
                  valueColor: "text-red-500",
                },
              ]}
            />

            <ModuleCard
              title="Finance"
              progress={65}
              rows={[
                { label: "Budget User", value: "65%" },
                { label: "Upcoming:8", value: "pending:₹12.4L" },
              ]}
            />

            <ModuleCard
              title="Stocks"
              rows={[
                { label: "Total Items", value: 256 },
                {
                  label: "Low-8",
                  labelColor: "text-yellow-200",
                  value: "critical-8",
                  valueColor: "text-red-500",
                },
              ]}
            />
          </div>
        </div>

        {/* Analytics */}
        <div className="mt-8 space-y-6">
          <Alerts />
          <ProgressChart />
          <BudgetDistribution />
          <OnTimeVsDelayed />
          <DashboardStats />
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

