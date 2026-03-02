"use client";
import { useState } from "react";

const STORAGE_KEY = "siteSurveyData";

// ─── Load saved data from localStorage on first render ───────────────────────
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { formValues: {}, docs: {}, customSections: [] };
    const { formValues = {}, docs = {}, customSections = [] } = JSON.parse(raw);
    // Normalize docs: ensure every entry is an array (old saves may have a single string)
    const normalizedDocs: Record<string, string[]> = {};
    for (const key of Object.keys(docs)) {
      const val = docs[key];
      normalizedDocs[key] = Array.isArray(val) ? val : val ? [val] : [];
    }
    return { formValues, docs: normalizedDocs, customSections };
  } catch {
    return { formValues: {}, docs: {}, customSections: [] };
  }
}

const FIXED_SECTIONS = [
  {
    id: "site_overview",
    title: "Site Overview",
    fixed: true,
    fields: [
      { id: "siteDescription", label: "Site Description", type: "input", placeholder: "Enter Overall Site Description" },
      { id: "siteCondition", label: "Site Condition", type: "select", options: ["Good", "Average", "Poor", "Requires Attention"] },
      { id: "accessDescription", label: "Access Description", type: "input", placeholder: "Describe How To Access The Site" },
    ]
  },
  {
    id: "boundary_access",
    title: "Boundary & Access",
    fixed: true,
    fields: [
      { id: "mainGateCondition", label: "Main Gate Condition", type: "select", options: ["Good", "Average", "Poor", "No Gate"] },
      { id: "roadCondition", label: "Road Condition", type: "select", options: ["Good", "Average", "Poor"] },
      { id: "roadWidth", label: "Access Road Width (ft)", type: "input", inputType: "number", placeholder: "Enter Road Width" },
      { id: "wideForVehicles", label: "Wide Enough For Construction Vehicles", type: "select", options: ["Yes", "No"] },
    ]
  },
  {
    id: "site_measurement",
    title: "Site Measurement",
    fixed: true,
    twoCol: ["plotLength", "plotWidth"],
    fields: [
      { id: "plotLength", label: "Plot Length (ft)", type: "input", inputType: "number", placeholder: "Plot Length" },
      { id: "plotWidth", label: "Plot Width (ft)", type: "input", inputType: "number", placeholder: "Plot Width" },
      { id: "terrainType", label: "Terrain Type", type: "input", placeholder: "Flat, Sloped, Hilly..." },
      { id: "soilType", label: "Soil Type", type: "select", options: ["Sandy", "Clay", "Rocky", "Loamy", "Fill Material", "Mixed"] },
      { id: "slopeGradient", label: "Slope / Gradient", type: "select", options: ["Level / Flat", "Gentle Slope", "Steep Slope", "Uneven"] },
      { id: "vegetationPresent", label: "Vegetation Present", type: "select", options: ["None", "Grass Only", "Shrubs", "Trees", "Heavy Vegetation"] },
    ]
  },
  {
    id: "existing_structures",
    title: "Existing Structures",
    fixed: true,
    fields: [
      { id: "existingStructures", label: "Existing Structures Present", type: "select", options: ["None", "Partial Structure", "Full Building", "Foundation Only", "Compound Wall Only"] },
      { id: "structureCondition", label: "Structure Condition", type: "select", options: ["Good", "Average", "Poor", "Dilapidated", "N/A"] },
      { id: "foundationVisible", label: "Foundation Visible", type: "select", options: ["Yes", "No", "Partially"] },
      { id: "cracksOrDamage", label: "Cracks Or Structural Damage", type: "select", options: ["None", "Minor Cracks", "Major Cracks", "Structural Damage"] },
    ]
  },
  {
    id: "utility_connections",
    title: "Utility Connections",
    fixed: true,
    twoCol: ["waterSupply", "electricityAvailable"],
    fields: [
      { id: "waterSupply", label: "Water Supply Available?", type: "select", options: ["Municipal", "Borewell", "Both", "None"] },
      { id: "electricityAvailable", label: "Electricity Supply Available?", type: "select", options: ["Yes", "No", "Nearby (Not Connected)"] },
      { id: "drainageAvailable", label: "Drainage Available?", type: "select", options: ["Yes", "No", "Open Drain Only"] },
      { id: "sewageConnection", label: "Sewage Connection", type: "select", options: ["Municipal Sewer", "Septic Tank", "None"] },
      { id: "gasLine", label: "Gas Pipeline", type: "select", options: ["Available", "Not Available", "Unknown"] },
      { id: "utilityNotes", label: "Additional Notes", type: "input", placeholder: "Enter Any Additional Observation" },
    ]
  },
  {
    id: "neighbourhood",
    title: "Neighbourhood & Surroundings",
    fixed: true,
    twoCol: ["leftNeighbour", "rightNeighbour"],
    fields: [
      { id: "leftNeighbour", label: "Left Neighbour", type: "input", placeholder: "Describe Left Neighbour Property" },
      { id: "rightNeighbour", label: "Right Neighbour", type: "input", placeholder: "Describe Right Neighbour Property" },
      { id: "rearNeighbour", label: "Rear Neighbour", type: "input", placeholder: "Describe Rear Property" },
      { id: "overheadObstructions", label: "Overhead Obstructions", type: "select", options: ["None", "Power Lines", "Telecom Cables", "Overhanging Trees", "Multiple"] },
      { id: "waterBodiesNearby", label: "Water Bodies Nearby (Within 50m)", type: "select", options: ["None", "River", "Pond", "Canal", "Well", "Multiple"] },
    ]
  },
  {
    id: "safety_environment",
    title: "Safety & Environment",
    fixed: true,
    fields: [
      { id: "floodRisk", label: "Flood Risk / Water Mark Evidence", type: "select", options: ["None Visible", "Minor Marks", "Clear Evidence", "High Risk Area"] },
      { id: "hazardousMaterials", label: "Hazardous Materials On Site", type: "select", options: ["None", "Asbestos", "Chemical Waste", "Construction Debris", "Multiple"] },
      { id: "safetyHazards", label: "Safety Hazards", type: "select", options: ["None", "Open Pits", "Unstable Structures", "Sharp Debris", "Multiple Hazards"] },
      { id: "additionalObservations", label: "Additional Observations", type: "input", placeholder: "Enter Any Additional Observations Or Notes" },
    ]
  },
];

function generateId() { return Math.random().toString(36).slice(2, 8); }

// docs shape: Record<sectionId, string[]>  — array of base64 strings
export default function SiteSurvey() {
  const saved = loadSaved();
  const [formValues, setFormValues] = useState<Record<string, string>>(saved.formValues);
  const [docs, setDocs] = useState<Record<string, string[]>>(saved.docs);
  const [customSections, setCustomSections] = useState<any[]>(saved.customSections);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [showAddField, setShowAddField] = useState<string | null>(null);
  const [newField, setNewField] = useState({ label: "", type: "input", placeholder: "", options: "", required: false });
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const updateValue = (k: string, v: string) => setFormValues(p => ({ ...p, [k]: v }));

  // Convert each selected file to base64 and APPEND to existing images for that section
  const handleDoc = (sectionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setDocs(p => ({
          ...p,
          [sectionId]: [...(p[sectionId] ?? []), reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same files can be re-selected if needed
    e.target.value = "";
  };

  // Remove a single image by index from a section
  const removeDoc = (sectionId: string, index: number) => {
    setDocs(p => {
      const updated = (p[sectionId] ?? []).filter((_, i) => i !== index);
      if (updated.length === 0) {
        const n = { ...p };
        delete n[sectionId];
        return n;
      }
      return { ...p, [sectionId]: updated };
    });
  };

  const addCustomSection = () => {
    if (!newSectionName.trim()) return;
    setCustomSections(p => [...p, { id: generateId(), title: newSectionName.trim(), fixed: false, fields: [] }]);
    setNewSectionName("");
    setShowAddSection(false);
    showToast("Section added!");
  };

  const deleteCustomSection = (id: string) => {
    setCustomSections(p => p.filter(s => s.id !== id));
    setDeleteConfirm(null);
    showToast("Section removed", "error");
  };

  const addFieldToSection = (sectionId: string) => {
    if (!newField.label.trim()) return;
    const field = {
      id: generateId(),
      label: newField.label.trim(),
      type: newField.type,
      placeholder: newField.placeholder,
      options: newField.type === "select" ? newField.options.split(",").map(o => o.trim()).filter(Boolean) : [],
      required: newField.required,
    };
    setCustomSections(p => p.map(s => s.id === sectionId ? { ...s, fields: [...s.fields, field] } : s));
    setNewField({ label: "", type: "input", placeholder: "", options: "", required: false });
    setShowAddField(null);
    showToast("Field added!");
  };

  const deleteFieldFromSection = (sectionId: string, fieldId: string) => {
    setCustomSections(p => p.map(s => s.id === sectionId ? { ...s, fields: s.fields.filter((f: any) => f.id !== fieldId) } : s));
  };

  const handleSubmit = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formValues, docs, customSections, savedAt: Date.now() }));
      showToast("Site survey saved successfully!");
    } catch (e) {
      showToast("Save failed — images may be too large", "error");
      console.error(e);
    }
  };

  const allSections = [...FIXED_SECTIONS, ...customSections];

  return (
    <div className="w-full" style={{ fontFamily: "inherit" }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999, animation: "ti 0.3s ease" }}>
          <style>{`@keyframes ti{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
          <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium ${toast.type === "success" ? "bg-slate-900 text-white" : "bg-red-500 text-white"}`}>
            {toast.type === "success" ? "✓" : "⚠"} {toast.msg}
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
              <span className="text-red-500 text-xl">🗑</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 text-center mb-1">Delete Section</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Are you sure you want to delete <span className="font-semibold text-gray-800">"{deleteConfirm.title}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteCustomSection(deleteConfirm.id)} className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SECTION MODAL */}
      {showAddSection && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAddSection(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Add Custom Section</h3>
              <button onClick={() => setShowAddSection(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <label className="text-sm font-medium block mb-1">Section Name</label>
            <input
              autoFocus
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCustomSection()}
              placeholder="e.g. Soil Testing, Special Notes..."
              className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none text-sm mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddSection(false)} className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={addCustomSection} className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg">Add Section</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FIELD MODAL */}
      {showAddField && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAddField(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Add Field</h3>
              <button onClick={() => setShowAddField(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Field Label</label>
                <input autoFocus value={newField.label} onChange={e => setNewField(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Soil pH Level" className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Field Type</label>
                <select value={newField.type} onChange={e => setNewField(p => ({ ...p, type: e.target.value }))} className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none text-sm">
                  <option value="input">Text Input</option>
                  <option value="select">Dropdown</option>
                  <option value="textarea">Text Area</option>
                </select>
              </div>
              {newField.type === "input" && (
                <div>
                  <label className="text-sm font-medium block mb-1">Placeholder</label>
                  <input value={newField.placeholder} onChange={e => setNewField(p => ({ ...p, placeholder: e.target.value }))} placeholder="Enter placeholder text" className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none text-sm" />
                </div>
              )}
              {newField.type === "select" && (
                <div>
                  <label className="text-sm font-medium block mb-1">Options (comma separated)</label>
                  <input value={newField.options} onChange={e => setNewField(p => ({ ...p, options: e.target.value }))} placeholder="e.g. Good, Average, Poor" className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none text-sm" />
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-gray-900" checked={newField.required} onChange={e => setNewField(p => ({ ...p, required: e.target.checked }))} />
                Mark as Required
              </label>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setShowAddField(null)} className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => addFieldToSection(showAddField!)} className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg">Add Field</button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-lg text-black mb-4 font-semibold">Site Survey</h2>

      <div className="bg-white text-black w-full rounded-2xl border p-6 space-y-8">

        {allSections.map((section) => (
          <div key={section.id} className="border rounded-xl p-5">

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{section.title}</h3>
              {!section.fixed && (
                <button onClick={() => setDeleteConfirm(section)} className="text-xs text-red-400 hover:text-red-600">✕ Remove Section</button>
              )}
            </div>

            <div className="space-y-4">
              {section.fixed
                ? <FixedSectionFields section={section} values={formValues} onChange={updateValue} />
                : <CustomSectionFields section={section} values={formValues} onChange={updateValue} onDeleteField={deleteFieldFromSection} />
              }

              {!section.fixed && (
                <button
                  onClick={() => { setShowAddField(section.id); setNewField({ label: "", type: "input", placeholder: "", options: "", required: false }); }}
                  className="text-sm font-medium text-gray-500 hover:text-gray-800"
                >
                  + Add Field
                </button>
              )}

              <UploadBox
                sectionId={section.id}
                images={docs[section.id] ?? []}
                onChange={e => handleDoc(section.id, e)}
                onRemove={(idx) => removeDoc(section.id, idx)}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <button
            onClick={() => setShowAddSection(true)}
            className="px-5 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            + Add Custom Section
          </button>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button className="px-6 py-2 rounded-lg border">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-slate-800 text-white">Submit</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FixedSectionFields({ section, values, onChange }: any) {
  const twoColIds = section.twoCol || [];
  const rendered: React.ReactNode[] = [];
  const fields = section.fields;
  let i = 0;
  while (i < fields.length) {
    const f = fields[i];
    if (twoColIds.includes(f.id) && i + 1 < fields.length && twoColIds.includes(fields[i + 1].id)) {
      rendered.push(
        <div key={f.id + fields[i+1].id} className="grid grid-cols-2 gap-6">
          <FieldItem field={f} value={values[f.id] || ""} onChange={onChange} />
          <FieldItem field={fields[i+1]} value={values[fields[i+1].id] || ""} onChange={onChange} />
        </div>
      );
      i += 2;
    } else {
      rendered.push(<FieldItem key={f.id} field={f} value={values[f.id] || ""} onChange={onChange} />);
      i++;
    }
  }
  return <div className="space-y-4">{rendered}</div>;
}

function CustomSectionFields({ section, values, onChange, onDeleteField }: any) {
  if (section.fields.length === 0) {
    return <p className="text-sm text-gray-400">No fields yet. Click "+ Add Field" below.</p>;
  }
  return (
    <div className="space-y-4">
      {section.fields.map((f: any) => (
        <div key={f.id} className="relative">
          <button onClick={() => onDeleteField(section.id, f.id)} className="absolute right-0 top-0 text-xs text-red-300 hover:text-red-500">✕</button>
          <FieldItem field={f} value={values[f.id] || ""} onChange={onChange} />
        </div>
      ))}
    </div>
  );
}

function FieldItem({ field, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">
        {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {field.type === "select" ? (
        <select value={value} onChange={e => onChange(field.id, e.target.value)} className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none text-sm">
          <option value="">Select {field.label}</option>
          {(field.options || []).map((o: string) => <option key={o}>{o}</option>)}
        </select>
      ) : field.type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(field.id, e.target.value)} placeholder={field.placeholder} rows={3} className="w-full px-3 py-2 rounded-md bg-gray-100 outline-none text-sm resize-none" />
      ) : (
        <input type={field.inputType || "text"} value={value} onChange={e => onChange(field.id, e.target.value)} placeholder={field.placeholder} className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none text-sm" />
      )}
    </div>
  );
}

function UploadBox({ sectionId, images: rawImages, onChange, onRemove }: {
  sectionId: string;
  images: string[] | string | null | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}) {
  // Normalize: always work with an array regardless of what's stored
  const images: string[] = Array.isArray(rawImages)
    ? rawImages
    : rawImages ? [rawImages] : [];

  return (
    <div className="space-y-3">
      {/* Existing images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((src, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200" style={{ aspectRatio: "4/3" }}>
              <img src={src} alt={`upload-${idx}`} className="w-full h-full object-cover" />
              <button
                onClick={() => onRemove(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/80"
              >✕</button>
              <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                {idx + 1}/{images.length}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload button — always visible so more images can be added */}
      <label className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={onChange}
        />
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-sm text-gray-500">
          {images.length > 0 ? `Add more images (${images.length} uploaded)` : "Upload Images"}
        </span>
      </label>
    </div>
  );
}