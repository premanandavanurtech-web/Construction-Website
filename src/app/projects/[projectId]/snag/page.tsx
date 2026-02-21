"use client";

import { useEffect, useState } from "react";

import ReportIssueModal from "@/src/component/project/snag/ReportlssueModal";
import SnagCard from "@/src/component/project/snag/SnagCard";
import SnagHeader from "@/src/component/project/snag/SnagHeader";
import SnagStats from "@/src/component/project/snag/SnagStats";
import ViewDetailsModal from "@/src/component/project/snag/ViewDetailsModal";
import ViewImagesModal from "@/src/component/project/snag/viewImagesModal";

/* ✅ Snag Type */
type Snag = {
  id: string;
  title: string;
  location: string;
  description: string;
  assignedTo: string;
  deadline: string;
  reportedOn: string;
  priority: "high" | "pending" | "low";
  status: "unresolved" | "in-progress" | "resolved" | "pending";
  images: string[];
};

export default function SnagPage() {
  const [snags, setSnags] = useState<Snag[]>([]);
  const [openReport, setOpenReport] = useState(false);

  const [openImages, setOpenImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedSnag, setSelectedSnag] = useState<Snag | null>(null);

  /* 🔹 Load snags from localStorage */
  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("snagIssues") || "[]"
    );
    setSnags(stored);
  }, []);

  /* 🔹 Persist snags */
  useEffect(() => {
    localStorage.setItem("snagIssues", JSON.stringify(snags));
  }, [snags]);

  /* 🔹 ADD NEW SNAG (🔥 FIX) */
  const addSnag = (snag: Snag) => {
    setSnags((prev) => [...prev, snag]);
  };

  /* 🔹 Update status */
  const updateStatus = (
    id: string,
    status: Snag["status"]
  ) => {
    setSnags((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status } : s
      )
    );
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <SnagHeader onReport={() => setOpenReport(true)} />
      <SnagStats />

      {/* Snag Cards */}
      {snags.length === 0 ? (
        <p className="text-sm text-gray-500">
          No issues reported yet.
        </p>
      ) : (
        snags.map((snag) => (
          <SnagCard
            key={snag.id}
            {...snag}
            onViewImages={(imgs) => {
              setImages(imgs);
              setOpenImages(true);
            }}
            onViewDetails={() => {
              setSelectedSnag(snag);
              setOpenDetails(true);
            }}
            onStartWork={() =>
              updateStatus(snag.id, "in-progress")
            }
            onMarkResolved={() =>
              updateStatus(snag.id, "resolved")
            }
          />
        ))
      )}

      {/* Report Issue Modal */}
      <ReportIssueModal
        open={openReport}
        onClose={() => setOpenReport(false)}
        onSubmit={addSnag}
      />

      {/* View Images Modal */}
     

      {/* View Details Modal */}
      {openDetails && selectedSnag && (
        <ViewDetailsModal
          {...selectedSnag}
          onClose={() => {
            setOpenDetails(false);
            setSelectedSnag(null);
          }}
        />
      )}
    </div>
  );
}
