  "use client";

  import { useState } from "react";
  import { X } from "lucide-react";
  import { Project } from "@/src/ts/project";

  type Props = {
    onClose: () => void;
    onCreate: (project: Project) => void;
  };

  const steps = ["Basic", "Timeline", "Financial", "Team", "Legal&Docs"] as const;

  const inputClass =
    "w-full h-10 px-3 rounded-md bg-gray-100 text-sm text-gray-900 placeholder-gray-400 outline-none";

  const labelClass =
    "text-sm font-medium text-black font-bold mb-1 block";

  export default function CreateProjectModal({ onClose, onCreate }: Props) {
    const [step, setStep] = useState(0);

    const [project, setProject] = useState<Project>({
      id: crypto.randomUUID(),

      name: "",
      type: "",
      city: "",
      address: "",
      region: "",
      gps: "",
      description: "",
      projectImage: null,

      startDate: "",
      endDate: "",
      milestones: [],
      schedule: "",

      budget: "",
      costBreakdown: [],
      fundingSource: "",
      roi: "",

      members: [],
      siteAccess: "",

      permits: null,
      legalDocs: null,
      drawings: null,

      createdAt: Date.now(),
    });

    const update = (key: keyof Project, value: any) =>
      setProject((p) => ({ ...p, [key]: value }));


 const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => update("projectImage", reader.result as string);
    reader.readAsDataURL(file);
  };

    const handleFile = (
      e: React.ChangeEvent<HTMLInputElement>,
      key: "permits" | "legalDocs" | "drawings"
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => update(key, reader.result as string);
      reader.readAsDataURL(file);
    };

    const finish = () => {
      const existing = JSON.parse(localStorage.getItem("projects") || "[]");
      localStorage.setItem("projects", JSON.stringify([...existing, project]));
      onCreate(project);
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-[900px] rounded-2xl p-6 relative">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-600"
          >
            <X size={18} />
          </button>

          <h2 className="text-xl font-semibold text-[#38485e] mb-5">Create Project</h2>

          {/* Tabs */}
          <div className="flex bg-gray-200 rounded-lg  p-1 mb-8">
            {steps.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(i)}
                className={`flex-1 py-2 rounded-md text-sm transition ${
                  i === step
                    ? "bg-white text-gray-900 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* ================= BASIC ================= */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-5">
              <div className="text-black text-2xl col-span-2">
                <label className={labelClass}>Project Name*</label>
                <input
                  className={inputClass}
                  placeholder="Enter Project Name"
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Project Type*</label>
                <input
                  className={inputClass}
                  placeholder="Enter Project Type"
                  onChange={(e) => update("type", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>City</label>
                <input
                  className={inputClass}
                  placeholder="Enter City Name"
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Address*</label>
                <input
                  className={inputClass}
                  placeholder="Enter Site Address"
                  onChange={(e) => update("address", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Region / State*</label>
                <input
                  className={inputClass}
                  placeholder="Enter Region/State"
                  onChange={(e) => update("region", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>GPS Coordinates</label>
                <input
                  className={inputClass}
                  placeholder="Eg: 128378 343 463435"
                  onChange={(e) => update("gps", e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Project Description</label>
                <textarea
                  className="w-full h-20 px-3 py-2 rounded-md bg-gray-100 text-sm outline-none"
                  placeholder="Enter Project Description"
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>
             <div className="col-span-2">
              <label className={labelClass}>Project Image</label>
              <label className="flex items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
                {project.projectImage ? (
                  <img
                    src={project.projectImage}
                    className="h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">
                    Click to upload image
                  </span>
                )}
              </label>
            </div>
          </div>

          )}

          {/* ================= TIMELINE ================= */}
        {step === 1 && (
    <>
      {/* Dates */}
      <div className="grid grid-cols-2  gap-6 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-800 mb-1 block">
            Start Date*
          </label>
          <input
            className="w-full h-10 px-3 rounded-md bg-gray-100 text-black text-sm outline-none"
            placeholder="DD/MM/YYYY"
            type="date"
            onChange={(e) => update("startDate", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-800 mb-1 block">
            Estimated Completion Date*
          </label>
          <input
            className="w-full h-10 px-3 rounded-md text-black bg-gray-100 text-sm outline-none"
            placeholder="DD/MM/YYYY"
              type="date"
            onChange={(e) => update("startDate", e.target.value)}
          />
        </div>
      </div>

      {/* Key Milestones */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-800 mb-2 block">
          Key Milestones
        </label>

        {/* Row 1 (with Add button) */}
        <div className="grid grid-cols-[1fr_220px_140px] gap-4 mb-3">
          <input
            className="h-10 px-3 rounded-md text-black bg-gray-100 text-sm outline-none"
            placeholder="Milestone Name"
          />
          <input
            className="h-10 px-3 rounded-md text-black bg-gray-100 text-sm outline-none"
            placeholder="DD/MM/YYYY"
              type="date"
            onChange={(e) => update("startDate", e.target.value)}
          />
          <button
            className="h-10 rounded-md border border-slate-600 text-sm text-slate-700"
          >
            Add Milestone
          </button>
        </div>

        {/* Row 2 (NO button) */}
        <div className="grid grid-cols-[1fr_220px] gap-4">
          <input
            className="h-10 px-3 rounded-md text-black bg-gray-100 text-sm outline-none"
            placeholder="Milestone Name"
          />
          <input
            className="h-10 px-3 rounded-md text-black bg-gray-100 text-sm outline-none"
            placeholder="DD/MM/YYYY"
            type="date"
            onChange={(e) => update("startDate", e.target.value)}
          />
        </div>
      </div>

      {/* Construction Schedule */}
      <div>
        <label className="text-sm font-medium text-gray-800 mb-1 block">
          Construction Schedule/Phases
        </label>
        <textarea
          className="w-full h-16 px-3 py-2 text-black rounded-md bg-gray-100 text-sm outline-none"
          placeholder="Outline The construction Phases And Timeline..."
        />
      </div>

      
    </>
  )}

          {/* ================= FINANCIAL ================= */}
        {step === 2 && (
    <div className="space-y-6">
      {/* Total Budget */}
      <div>
        <label className={labelClass}>
          Total Budget/Estimated Cost*
        </label>
        <input
          className={inputClass}
          placeholder="Enter Amount in Indian Rupees₹"
          onChange={(e) => update("budget", e.target.value)}
        />
      </div>

      {/* Cost Breakdown */}
      <div>
        <label className={labelClass}>Cost Breakdown</label>

        {/* Row 1 (with Add button) */}
        <div className="grid grid-cols-[1fr_1fr_140px] gap-4 mb-3">
          <input
            className={inputClass}
            placeholder="Category"
          />
          <input
            className={inputClass}
            placeholder="Amount"
          />
          <button
            className="h-10 rounded-md border border-slate-600 text-sm text-slate-700"
          >
            Add Milestone
          </button>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className={inputClass}
            placeholder="Category"
          />
          <input
            className={inputClass}
            placeholder="Amount"
          />
        </div>
      </div>

      {/* Funding Source */}
      <div>
        <label className={labelClass}>Funding Source</label>
        <input
          className={inputClass}
          placeholder="Funding Source"
          onChange={(e) => update("fundingSource", e.target.value)}
        />
      </div>

      {/* ROI */}
      <div>
        <label className={labelClass}>
          Expected ROI/Market Outlook
        </label>
        <textarea
          className="w-full h-24 px-3 py-2 rounded-md bg-gray-100 text-sm outline-none"
          onChange={(e) => update("roi", e.target.value)}
        />
      </div>
    </div>
  )}


          {/* ================= TEAM ================= */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Role*</label>
                <input className={inputClass} placeholder="Type Role" />
              </div>

              <div>
                <label className={labelClass}>Name*</label>
                <input className={inputClass} placeholder="Full Name or Company Name" />
              </div>

              <div>
                <label className={labelClass}>Email*</label>
                <input className={inputClass} placeholder="example@gmail.com" />
              </div>

              <div>
                <label className={labelClass}>Phone Number*</label>
                <input className={inputClass} placeholder="+91 XXXXXXXX" />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Site Access & Security Info</label>
                <textarea
                  className="w-full h-20 px-3 py-2 rounded-md bg-gray-100 text-sm outline-none"
                  onChange={(e) => update("siteAccess", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ================= LEGAL ================= */}
      {step === 4 && (
    <div className="space-y-8">

      {/* Building Permits */}
      <div>
        <label className="text-sm font-medium text-gray-800 mb-2 block">
          Building Permits
        </label>

        <label className="flex flex-col items-center justify-center h-30 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFile(e, "permits")}
          />

          <div className="flex flex-col items-center gap-2 text-gray-600">
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 16V4M8 8l4-4 4 4" />
              <path d="M4 16v4h16v-4" />
            </svg>

            <p className="text-sm">
              <span className="text-slate-800 font-medium">
                Upload A File
              </span>{" "}
              Or Drag And Drop
            </p>

            <p className="text-xs text-gray-500">
              Png, Jpg, Gif Upto 50MB
            </p>
          </div>
        </label>
      </div>

      {/* Legal Documentation */}
      <div>
        <label className="text-sm font-medium text-gray-800 mb-2 block">
          Legal Documentation
        </label>

        <label className="flex flex-col items-center justify-center h-30 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFile(e, "legalDocs")}
          />

          <div className="flex flex-col items-center gap-2 text-gray-600">
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 16V4M8 8l4-4 4 4" />
              <path d="M4 16v4h16v-4" />
            </svg>

            <p className="text-sm">
              <span className="text-slate-800 font-medium">
                Upload A File
              </span>{" "}
              Or Drag And Drop
            </p>

            <p className="text-xs text-gray-500">
              Png, Jpg, Gif Upto 50MB
            </p>
          </div>
        </label>
      </div>

      {/* Architectural Drawings & Plans */}
      <div>
        <label className="text-sm font-medium text-gray-800 mb-2 block">
          Architectural Drawings & Plans
        </label>

        <label className="flex flex-col items-center justify-center h-30 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFile(e, "drawings")}
          />

          <div className="flex flex-col items-center gap-2 text-gray-600">
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 16V4M8 8l4-4 4 4" />
              <path d="M4 16v4h16v-4" />
            </svg>

            <p className="text-sm">
              <span className="text-slate-800 font-medium">
                Upload A File
              </span>{" "}
              Or Drag And Drop
            </p>

            <p className="text-xs text-gray-500">
              Png, Jpg, Gif Upto 50MB
            </p>
          </div>
        </label>
      </div>

    </div>
  )}


          {/* Footer */}
        {/* Global Footer */}
  <div className="flex justify-end gap-4 mt-10">
    <button
      onClick={onClose}
      className="px-8 py-2 rounded-lg border border-gray-400 text-gray-700"
    >
      Cancel
    </button>

    {step > 0 && (
      <button
        onClick={() => setStep(step - 1)}
        className="px-8 py-2 rounded-lg border border-gray-400 text-gray-700"
      >
        Previous
      </button>
    )}

    {step < steps.length - 1 ? (
      <button
        onClick={() => setStep(step + 1)}
        className="px-8 py-2 rounded-lg bg-slate-800 text-white"
      >
        Next
      </button>
    ) : (
      <button
        onClick={finish}
        className="px-8 py-2 rounded-lg bg-slate-800 text-white"
      >
        Finish
      </button>
    )}
  </div>

        </div>
      </div>
    );
  }
