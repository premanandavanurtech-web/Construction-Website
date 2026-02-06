"use client";

import { useState } from "react";

import SnagHeader from "@/app/components/snag/SnagHeader";
import SnagStats from "@/app/components/snag/SnagStats";
import SnagCard from "@/app/components/snag/SnagCard";
import ReportIssueModal from "@/app/components/snag/ReportIssueModal";
import ViewImagesModal from "@/app/components/snag/ViewImagesModal";
import ViewDetailsModal from "@/app/components/snag/ViewDetailsModal";

/* ✅ Type for a Snag */
type Snag = {
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
  const [openReport, setOpenReport] = useState(false);
  const [openImages, setOpenImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedSnag, setSelectedSnag] = useState<Snag | null>(null);

  const snagData: Snag = {
    title: "Crack in external wall plaster",
    location: "2nd Floor",
    description:
      "Visible crack on north-facing wall, approximately 2 feet long",
    assignedTo: "Masonry Team",
    deadline: "Oct 12, 2026",
    reportedOn: "Oct 6, 2026",
    priority: "high",
    status: "resolved",
    images: [
      "https://images.pexels.com/photos/12326415/pexels-photo-12326415.jpeg",
      "https://images.pexels.com/photos/4040621/pexels-photo-4040621.jpeg",
    ],
  };

  return (
    <div className="p-6">
      {/* Header */}
      <SnagHeader onReport={() => setOpenReport(true)} />
      <SnagStats />

      {/* Snag Card */}
      <SnagCard
        {...snagData}
        onViewImages={(imgs) => {
          setImages(imgs);
          setOpenImages(true);
        }}
        onViewDetails={() => {
          setSelectedSnag(snagData);
          setOpenDetails(true);
        }}
      />

      {/* Report Issue Modal */}
      <ReportIssueModal
        open={openReport}
        onClose={() => setOpenReport(false)}
      />

      {/* Images Modal */}
      {openImages && (
        <ViewImagesModal
          images={images}
          onClose={() => {
            setOpenImages(false);
            setImages([]);
          }}
        />
      )}

      {/* Details Modal */}
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