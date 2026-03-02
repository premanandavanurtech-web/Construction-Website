"use client";

import { useState, useEffect, useRef } from "react";

const STORAGE_KEY     = "siteSurveyData";
const COMMENTS_KEY    = "siteSurveyComments"; // separate key for comments

const FIXED_SECTIONS = [
  { id: "site_overview",       title: "Site Overview",                category: "Site",      fields: [{ id: "siteDescription", label: "Site Description" }, { id: "siteCondition", label: "Site Condition" }, { id: "accessDescription", label: "Access Description" }] },
  { id: "boundary_access",     title: "Boundary & Access",            category: "Location",  fields: [{ id: "mainGateCondition", label: "Main Gate Condition" }, { id: "roadCondition", label: "Road Condition" }, { id: "roadWidth", label: "Access Road Width (ft)" }, { id: "wideForVehicles", label: "Wide Enough For Construction Vehicles" }] },
  { id: "site_measurement",    title: "Site Measurement",             category: "Overview",  fields: [{ id: "plotLength", label: "Plot Length (ft)" }, { id: "plotWidth", label: "Plot Width (ft)" }, { id: "terrainType", label: "Terrain Type" }, { id: "soilType", label: "Soil Type" }, { id: "slopeGradient", label: "Slope / Gradient" }, { id: "vegetationPresent", label: "Vegetation Present" }] },
  { id: "existing_structures", title: "Existing Structures",          category: "Interior",  fields: [{ id: "existingStructures", label: "Existing Structures Present" }, { id: "structureCondition", label: "Structure Condition" }, { id: "foundationVisible", label: "Foundation Visible" }, { id: "cracksOrDamage", label: "Cracks Or Structural Damage" }] },
  { id: "utility_connections", title: "Utility Connections",          category: "Utilities", fields: [{ id: "waterSupply", label: "Water Supply Available?" }, { id: "electricityAvailable", label: "Electricity Supply Available?" }, { id: "drainageAvailable", label: "Drainage Available?" }, { id: "sewageConnection", label: "Sewage Connection" }, { id: "gasLine", label: "Gas Pipeline" }, { id: "utilityNotes", label: "Additional Notes" }] },
  { id: "neighbourhood",       title: "Neighbourhood & Surroundings", category: "Exterior",  fields: [{ id: "leftNeighbour", label: "Left Neighbour" }, { id: "rightNeighbour", label: "Right Neighbour" }, { id: "rearNeighbour", label: "Rear Neighbour" }, { id: "overheadObstructions", label: "Overhead Obstructions" }, { id: "waterBodiesNearby", label: "Water Bodies Nearby (Within 50m)" }] },
  { id: "safety_environment",  title: "Safety & Environment",         category: "Safety",    fields: [{ id: "floodRisk", label: "Flood Risk / Water Mark Evidence" }, { id: "hazardousMaterials", label: "Hazardous Materials On Site" }, { id: "safetyHazards", label: "Safety Hazards" }, { id: "additionalObservations", label: "Additional Observations" }] },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Site:      { bg: "bg-blue-100",    text: "text-blue-700"    },
  Location:  { bg: "bg-amber-100",   text: "text-amber-700"   },
  Overview:  { bg: "bg-emerald-100", text: "text-emerald-700" },
  Interior:  { bg: "bg-purple-100",  text: "text-purple-700"  },
  Exterior:  { bg: "bg-rose-100",    text: "text-rose-700"    },
  Utilities: { bg: "bg-cyan-100",    text: "text-cyan-700"    },
  Safety:    { bg: "bg-orange-100",  text: "text-orange-700"  },
  Custom:    { bg: "bg-gray-100",    text: "text-gray-600"    },
};

function clr(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.Custom;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  images: string[];
  fields: { label: string; value: string }[];
}

// ── Comment storage helpers ───────────────────────────────────────────────────
function loadAllComments(): Record<string, Comment[]> {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveAllComments(all: Record<string, Comment[]>) {
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
  } catch (e) { console.error(e); }
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string): string {
  return name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-purple-500",
  "bg-rose-500", "bg-amber-500", "bg-cyan-500", "bg-orange-500"
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

// ── Build gallery items from localStorage ────────────────────────────────────
function buildItems(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const { formValues = {}, docs = {}, customSections = [] } = JSON.parse(raw);
    const allSections = [
      ...FIXED_SECTIONS,
      ...customSections.map((s: any) => ({
        id: s.id, title: s.title, category: "Custom",
        fields: (s.fields ?? []).map((f: any) => ({ id: f.id, label: f.label })),
      })),
    ];
    return allSections.map((section) => {
      const rawDoc = docs[section.id];
      const images: string[] = Array.isArray(rawDoc) ? rawDoc : rawDoc ? [rawDoc] : [];
      const fields = section.fields
        .map((f) => ({ label: f.label, value: (formValues[f.id] ?? "").toString().trim() }))
        .filter((f) => f.value !== "");
      if (images.length === 0 && fields.length === 0) return null;
      return { id: section.id, title: section.title, category: section.category, images, fields };
    }).filter(Boolean) as GalleryItem[];
  } catch { return []; }
}

// ── Image slider ─────────────────────────────────────────────────────────────
function ImageSlider({ images, onZoom }: { images: string[]; onZoom: (src: string) => void }) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-xl gap-2">
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs text-gray-400">No image</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden group">
      <img src={images[idx]} alt="section" onClick={() => onZoom(images[idx])}
        className="w-full h-full object-cover cursor-zoom-in transition-transform duration-200 group-hover:scale-[1.02]" />
      <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition pointer-events-none">
        Click to zoom
      </div>
      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xs transition">‹</button>
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xs transition">›</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white scale-125" : "bg-white/50"}`} />
            ))}
          </div>
          <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
            {idx + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}

// ── Comment modal ─────────────────────────────────────────────────────────────
function CommentModal({
  sectionId, sectionTitle, onClose
}: {
  sectionId: string;
  sectionTitle: string;
  onClose: () => void;
}) {
  const [allComments, setAllComments] = useState<Record<string, Comment[]>>(loadAllComments);
  const [text, setText]       = useState("");
  const [author, setAuthor]   = useState(() => localStorage.getItem("surveyUserName") || "");
  const [nameInput, setNameInput] = useState(!localStorage.getItem("surveyUserName"));
  const bottomRef = useRef<HTMLDivElement>(null);

  const comments = allComments[sectionId] ?? [];

  // Scroll to bottom when comments load or new one added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const saveName = () => {
    if (!author.trim()) return;
    localStorage.setItem("surveyUserName", author.trim());
    setNameInput(false);
  };

  const addComment = () => {
    if (!text.trim() || !author.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).slice(2),
      author: author.trim(),
      text: text.trim(),
      timestamp: Date.now(),
    };
    const updated = { ...allComments, [sectionId]: [...comments, newComment] };
    setAllComments(updated);
    saveAllComments(updated);
    setText("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "85vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Comments</h3>
            <p className="text-xs text-gray-400 mt-0.5">{sectionTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {comments.length}
            </span>
            <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">✕</button>
          </div>
        </div>

        {/* Name setup (first time) */}
        {nameInput ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">👤</div>
            <p className="text-sm font-medium text-gray-700 text-center">What's your name?</p>
            <p className="text-xs text-gray-400 text-center">So others know who commented</p>
            <input
              autoFocus
              value={author}
              onChange={e => setAuthor(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveName()}
              placeholder="Enter your name..."
              className="w-full h-10 px-3 rounded-xl bg-gray-100 outline-none text-sm text-center"
            />
            <button onClick={saveName} disabled={!author.trim()}
              className="w-full h-10 bg-gray-900 text-white text-sm rounded-xl disabled:opacity-40 hover:bg-gray-700 transition">
              Continue
            </button>
          </div>
        ) : (
          <>
            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">💬</div>
                  <p className="text-sm text-gray-500 font-medium">No comments yet</p>
                  <p className="text-xs text-gray-400">Be the first to add one</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${avatarColor(c.author)}`}>
                      {getInitials(c.author)}
                    </div>
                    {/* Bubble */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-800">{c.author}</span>
                        <span className="text-[10px] text-gray-400">{formatTime(c.timestamp)}</span>
                      </div>
                      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3 py-2">
                        <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="flex-shrink-0 px-4 pb-4 pt-3 border-t border-gray-100">
              {/* Posting as */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${avatarColor(author)}`}>
                  {getInitials(author)}
                </div>
                <span className="text-[11px] text-gray-400">Posting as <span className="font-medium text-gray-600">{author}</span></span>
                <button onClick={() => setNameInput(true)} className="ml-1 text-[10px] text-blue-500 hover:text-blue-700 underline">change</button>
              </div>

              <div className="flex gap-2">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); } }}
                  placeholder="Write a comment... (Enter to send)"
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm rounded-xl bg-gray-100 outline-none resize-none focus:ring-2 focus:ring-gray-200 transition"
                />
                <button
                  onClick={addComment}
                  disabled={!text.trim()}
                  className="w-10 h-10 mt-auto bg-gray-900 text-white rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-gray-700 transition flex-shrink-0"
                >
                  <svg className="w-4 h-4 rotate-45" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ item, onZoom }: { item: GalleryItem; onZoom: (src: string) => void }) {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const c = clr(item.category);

  // Load comment count on mount and keep in sync
  useEffect(() => {
    const count = () => {
      const all = loadAllComments();
      setCommentCount((all[item.id] ?? []).length);
    };
    count();
    window.addEventListener("storage", count);
    return () => window.removeEventListener("storage", count);
  }, [item.id]);

  // Refresh count after modal closes
  const handleClose = () => {
    setShowComments(false);
    const all = loadAllComments();
    setCommentCount((all[item.id] ?? []).length);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex" style={{ minHeight: "180px" }}>
        {/* LEFT — image slider */}
        <div className="flex-shrink-0 w-52 p-3">
          <ImageSlider images={item.images} onZoom={onZoom} />
        </div>

        {/* RIGHT — details + comment button */}
        <div className="flex-1 flex flex-col p-4 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
              {item.category}
            </span>
            <h3 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h3>
            {item.images.length > 1 && (
              <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">{item.images.length} photos</span>
            )}
          </div>

          {/* All field details */}
          {item.fields.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 flex-1">
              {item.fields.map((f) => (
                <div key={f.label} className="flex flex-col min-w-0">
                  <span className="text-[10px] text-gray-400 truncate">{f.label}</span>
                  <span className="text-xs font-medium text-gray-800 truncate">{f.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 flex-1">No field data recorded.</p>
          )}

          {/* Comment button */}
          <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-2 h-8 px-3 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comments
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold ${commentCount > 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>
                {commentCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment modal */}
      {showComments && (
        <CommentModal
          sectionId={item.id}
          sectionTitle={item.title}
          onClose={handleClose}
        />
      )}
    </>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function SiteMediaGallery() {
  const [items, setItems]     = useState<GalleryItem[]>([]);
  const [filter, setFilter]   = useState("All");
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  const refresh = () => setItems(buildItems());

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];
  const visible    = filter === "All" ? items : items.filter(i => i.category === filter);

  if (items.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-sm font-medium text-gray-900 mb-3">Site Media Gallery</h2>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">🏗️</div>
          <p className="text-sm font-medium text-gray-700">No survey data yet</p>
          <p className="text-xs text-gray-400 max-w-xs">Fill in the <strong>Site Survey</strong> and click <strong>Submit</strong>.</p>
          <button onClick={refresh} className="text-xs px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">↻ Check again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-900">Site Media Gallery</h2>
        <button onClick={refresh} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition">↻ Refresh</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === cat ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map(item => (
          <SectionCard key={item.id} item={item} onZoom={setZoomSrc} />
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">{visible.length} of {items.length} sections</p>

      {/* Zoom modal */}
      {zoomSrc && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setZoomSrc(null)}>
          <button onClick={() => setZoomSrc(null)}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-lg transition">✕</button>
          <img src={zoomSrc} alt="Zoomed" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}