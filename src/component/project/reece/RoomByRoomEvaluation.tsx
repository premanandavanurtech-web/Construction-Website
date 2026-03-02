"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "roomEvaluationData";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

function generateId() {
  return Math.random().toString(36).slice(2);
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Expire after 1 week
    if (parsed.savedAt && Date.now() - parsed.savedAt > ONE_WEEK) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed.rooms || [];
  } catch {
    return [];
  }
}

function saveToStorage(rooms) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rooms, savedAt: Date.now() }));
  } catch (e) {
    console.error("Storage save failed", e);
  }
}

function createEmptyRoom() {
  return { id: generateId(), name: "", categories: [], image: null, completed: false };
}

function createEmptyCategory() {
  return { id: generateId(), name: "", fields: [] };
}

function createEmptyField() {
  return { id: generateId(), label: "", value: "" };
}

export default function RoomEvaluation() {
  const [rooms, setRooms] = useState(() => loadFromStorage());
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [draft, setDraft] = useState(createEmptyRoom());
  const [projectInfo, setProjectInfo] = useState(null);

  // Load project info from URL + localStorage
  useEffect(() => {
    try {
      const path = window.location.pathname;
      const match = path.match(/\/projects\/([^\/]+)/);
      if (!match) return;
      const projectId = match[1];
      const stored = localStorage.getItem("projects");
      if (!stored) return;
      const projects = JSON.parse(stored);
      const current = projects.find((p) => p.id === projectId);
      if (current) {
        const name = current.name ?? current.title ?? current.project ?? "Unknown";
        setProjectInfo({ name });
      }
    } catch (e) {
      console.error("Could not load project info", e);
    }
  }, []);

  // Auto-save rooms + images to localStorage on every change
  useEffect(() => {
    saveToStorage(rooms);
  }, [rooms]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const openNewRoom = () => {
    setDraft(createEmptyRoom());
    setEditingRoom(null);
    setModalOpen(true);
  };

  const openEditRoom = (room) => {
    setDraft(JSON.parse(JSON.stringify(room)));
    setEditingRoom(room.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRoom(null);
  };

  const submitModal = () => {
    if (!draft.name.trim()) { showToast("Please enter a room name", "error"); return; }
    if (editingRoom) {
      setRooms((prev) => prev.map((r) => (r.id === editingRoom ? { ...draft, project: projectInfo } : r)));
      showToast("Room updated successfully!");
    } else {
      setRooms((prev) => [...prev, { ...draft, id: generateId(), project: projectInfo }]);
      showToast("Room added successfully!");
    }
    closeModal();
  };

  const confirmDelete = (room) => setDeleteConfirm({ roomId: room.id, roomName: room.name });

  const executeDelete = () => {
    setRooms((prev) => prev.filter((r) => r.id !== deleteConfirm.roomId));
    showToast("Room deleted", "error");
    setDeleteConfirm(null);
  };

  const toggleComplete = (roomId) =>
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, completed: !r.completed } : r)));

  // Draft helpers
  const setDraftName = (name) => setDraft((d) => ({ ...d, name }));
  const addDraftCategory = () => setDraft((d) => ({ ...d, categories: [...d.categories, createEmptyCategory()] }));
  const updateDraftCatName = (catId, name) => setDraft((d) => ({ ...d, categories: d.categories.map((c) => c.id === catId ? { ...c, name } : c) }));
  const deleteDraftCat = (catId) => setDraft((d) => ({ ...d, categories: d.categories.filter((c) => c.id !== catId) }));
  const addDraftField = (catId) => setDraft((d) => ({ ...d, categories: d.categories.map((c) => c.id === catId ? { ...c, fields: [...c.fields, createEmptyField()] } : c) }));
  const updateDraftField = (catId, fieldId, key, value) => setDraft((d) => ({ ...d, categories: d.categories.map((c) => c.id === catId ? { ...c, fields: c.fields.map((f) => f.id === fieldId ? { ...f, [key]: value } : f) } : c) }));
  const deleteDraftField = (catId, fieldId) => setDraft((d) => ({ ...d, categories: d.categories.map((c) => c.id === catId ? { ...c, fields: c.fields.filter((f) => f.id !== fieldId) } : c) }));

  // Image upload in modal
  const handleDraftImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const completed = rooms.filter((r) => r.completed).length;
  const inProgress = rooms.length - completed;
  const progress = rooms.length ? Math.round((completed / rooms.length) * 100) : 0;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="w-full min-h-screen bg-gray-50 p-6">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999, animation: "slideDown 0.3s ease" }}>
          <style>{`@keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
          <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium ${toast.type === "success" ? "bg-slate-900 text-white" : "bg-red-500 text-white"}`}>
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Room By Room Evaluations</h2>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[{ label: "Total Rooms", value: rooms.length }, { label: "Completed", value: completed }, { label: "In Progress", value: inProgress }, { label: "Progress", value: `${progress}%` }].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ROOM CARDS */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        {rooms.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">No rooms yet. Click "+ Add Room" to get started.</p>
        )}

        <div className="space-y-4 mb-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onEdit={() => openEditRoom(room)} onDelete={() => confirmDelete(room)} onToggleComplete={() => toggleComplete(room.id)} />
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button onClick={openNewRoom} className="px-4 py-2 border rounded-xl text-sm bg-white hover:bg-gray-50 text-gray-700">
            + Add Room
          </button>
          <button
            onClick={() => {
              saveToStorage(rooms);
              showToast("All data saved successfully!");
            }}
            className="px-6 py-2 rounded-xl bg-slate-800 text-white text-sm hover:bg-slate-700"
          >
            Submit
          </button>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()} style={{ animation: "modalIn 0.2s ease" }}>
            <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}`}</style>
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
              <span className="text-red-500 text-xl">🗑</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 text-center mb-1">Delete Room</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-700">"{deleteConfirm.roomName}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={executeDelete} className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT ROOM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()} style={{ animation: "modalIn 0.2s ease" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">{editingRoom ? "Edit Room" : "Add New Room"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5 flex-1 space-y-5">

              {/* Project Badge */}
              {projectInfo && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{projectInfo.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 leading-none mb-0.5">Current Project</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">{projectInfo.name}</p>
                  </div>
                </div>
              )}

              {/* Room Name */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Room Name *</label>
                <input
                  autoFocus
                  value={draft.name}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g. Living Room, Kitchen, Bedroom..."
                  className="w-full h-10 bg-gray-100 rounded-lg px-3 text-sm text-gray-700 outline-none focus:bg-gray-200"
                />
              </div>

              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categories</p>
                  <button onClick={addDraftCategory} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 font-medium">
                    + Add Category
                  </button>
                </div>

                {draft.categories.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-5 border-2 border-dashed border-gray-200 rounded-xl">
                    No categories yet. Click "+ Add Category".
                  </div>
                )}

                <div className="space-y-3">
                  {draft.categories.map((cat) => (
                    <div key={cat.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          value={cat.name}
                          onChange={(e) => updateDraftCatName(cat.id, e.target.value)}
                          placeholder="Category name (e.g. Floor Evaluation)"
                          className="flex-1 h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-700 outline-none focus:border-gray-400 font-medium"
                        />
                        <button onClick={() => deleteDraftCat(cat.id)} className="text-red-300 hover:text-red-500 text-sm w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50">✕</button>
                      </div>

                      <div className="space-y-2">
                        {cat.fields.map((field) => (
                          <div key={field.id} className="flex items-center gap-2">
                            <input
                              value={field.label}
                              onChange={(e) => updateDraftField(cat.id, field.id, "label", e.target.value)}
                              placeholder="Field name"
                              className="w-32 h-8 bg-white border border-gray-200 rounded-lg px-2.5 text-xs text-gray-600 outline-none focus:border-gray-400"
                            />
                            <input
                              value={field.value}
                              onChange={(e) => updateDraftField(cat.id, field.id, "value", e.target.value)}
                              placeholder="Value (optional)"
                              className="flex-1 h-8 bg-white border border-gray-200 rounded-lg px-2.5 text-xs text-gray-600 outline-none focus:border-gray-400"
                            />
                            <button onClick={() => deleteDraftField(cat.id, field.id)} className="text-red-200 hover:text-red-400 text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-red-50">✕</button>
                          </div>
                        ))}
                      </div>

                      <button onClick={() => addDraftField(cat.id)} className="mt-2.5 text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1">
                        <span className="text-base leading-none">+</span> Add Field
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Image Upload */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Room Image</p>
                <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors overflow-hidden" style={{ minHeight: "7rem" }}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={handleDraftImage}
                  />
                  {draft.image ? (
                    <div className="relative w-full">
                      <img src={draft.image} alt="Room" className="w-full h-36 object-cover" />
                      <button
                        onClick={(e) => { e.preventDefault(); setDraft((d) => ({ ...d, image: null })); }}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/70"
                      >✕</button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6">
                      <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Upload A File Or Drag And Drop</span>
                      <span className="text-xs text-gray-400 mt-0.5">Png, Jpg, Gif Upto 50MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button onClick={closeModal} className="px-4 py-2 text-sm border rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={submitModal} className="px-5 py-2 text-sm bg-slate-800 text-white rounded-xl hover:bg-slate-700">
                {editingRoom ? "Save Changes" : "Add Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoomCard({ room, onEdit, onDelete, onToggleComplete }) {
  return (
    <div className={`border rounded-2xl p-5 transition-all ${room.completed ? "border-green-200 bg-green-50/20" : "border-gray-200"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {room.completed && <span className="text-green-500 text-sm">✓</span>}
          <div>
            <p className="text-sm font-semibold text-gray-900">{room.name}</p>
            {room.project && (
              <p className="text-xs text-gray-400 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mr-1 align-middle"></span>
                <span className="capitalize">{room.project.name}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium flex items-center gap-1">
            <span>✎</span> Edit
          </button>
          <button onClick={onDelete} className="text-xs px-2.5 py-1.5 border border-red-100 rounded-lg hover:bg-red-50 text-red-400">✕</button>
        </div>
      </div>

      {/* Room Image */}
      {room.image && (
        <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
          <img src={room.image} alt={room.name} className="w-full h-36 object-cover" />
        </div>
      )}

      {room.categories.length === 0 ? (
        <p className="text-xs text-gray-400 mb-3">No categories added.</p>
      ) : (
        <div className="space-y-3">
          {room.categories.map((cat) => (
            <div key={cat.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{cat.name || "Unnamed Category"}</p>
              {cat.fields.length === 0 ? (
                <p className="text-xs text-gray-300">No fields</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {cat.fields.map((field) => (
                    <div key={field.id}>
                      <p className="text-xs text-gray-400 mb-1">{field.label || "—"}</p>
                      <div className="h-9 bg-white border border-gray-200 rounded-lg px-3 flex items-center">
                        <span className="text-sm text-gray-700">{field.value || <span className="text-gray-300 text-xs italic">Empty</span>}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <label className="flex items-center gap-2 text-xs text-gray-500 mt-4 cursor-pointer select-none">
        <input type="checkbox" className="accent-gray-900" checked={room.completed} onChange={onToggleComplete} />
        Mark as Completed
      </label>
    </div>
  );
}