"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "roomEvaluation";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

function createRoom(name = "New Room") {
  return {
    id: crypto.randomUUID(),
    name,
    floor: { material: "", condition: "", notes: "" },
    ceiling: { height: "", material: "", condition: "", notes: "" },
    utilities: { electrical: "", plumbing: "", ventilation: "", notes: "" },
    document: null,
    completed: false,
  };
}

export default function RoomByRoomEvaluation() {
  const [rooms, setRooms] = useState([createRoom("Living Room")]);

  /* ---------------- LOAD FROM STORAGE ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const parsed = JSON.parse(stored);
    if (Date.now() - parsed.savedAt > ONE_WEEK) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    setRooms(parsed.rooms);
  }, []);

  /* ---------------- STATS ---------------- */
  const total = rooms.length;
  const completed = rooms.filter((r) => r.completed).length;
  const inProgress = total - completed;
  const progress = Math.round((completed / total) * 100) || 0;

  /* ---------------- HELPERS ---------------- */
  const updateRoom = (id, updater) =>
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? updater(r) : r))
    );

  const handleFile = (e, id) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      updateRoom(id, (r) => ({ ...r, document: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rooms,
        savedAt: Date.now(),
      })
    );
    alert("Room evaluation saved (valid for 1 week)");
  };

  return (
    <div className="w-full bg- min-h-screen">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Room By Room Evaluations
      </h2>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 h-30 gap-3 mb-5">
        <StatCard label="Total Rooms" value={total} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="In Progress" value={inProgress} />
        <StatCard label="Progress" value={`${progress}%`} />
      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        {rooms.map((room, idx) => (
          <div key={room.id}>
            {idx > 0 && <hr className="border-gray-100 mb-5" />}

            <p className="text-sm font-medium text-gray-900 mb-3">
              {room.name}
            </p>

            {/* FLOOR */}
            <Section title="Floor Evaluation">
              <TwoCol>
                <Field label="Material">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        floor: { ...r.floor, material: v },
                      }))
                    }
                  />
                </Field>
                <Field label="Condition">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        floor: { ...r.floor, condition: v },
                      }))
                    }
                  />
                </Field>
              </TwoCol>

              <Field label="Notes">
                <Input
                  placeholder="Select Road Condition"
                  onChange={(v) =>
                    updateRoom(room.id, (r) => ({
                      ...r,
                      floor: { ...r.floor, notes: v },
                    }))
                  }
                />
              </Field>
            </Section>

            {/* CEILING */}
            <Section title="Ceiling Evaluation">
              <TwoCol>
                <Field label="Height">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        ceiling: { ...r.ceiling, height: v },
                      }))
                    }
                  />
                </Field>
                <Field label="Material">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        ceiling: { ...r.ceiling, material: v },
                      }))
                    }
                  />
                </Field>
              </TwoCol>

              <TwoCol>
                <Field label="Condition">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        ceiling: { ...r.ceiling, condition: v },
                      }))
                    }
                  />
                </Field>
                <Field label="Notes">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        ceiling: { ...r.ceiling, notes: v },
                      }))
                    }
                  />
                </Field>
              </TwoCol>
            </Section>

            {/* UTILITIES */}
            <Section title="Utilities Assessment">
              <TwoCol>
                <Field label="Electrical Points">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        utilities: {
                          ...r.utilities,
                          electrical: v,
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Plumbing">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        utilities: {
                          ...r.utilities,
                          plumbing: v,
                        },
                      }))
                    }
                  />
                </Field>
              </TwoCol>

              <TwoCol>
                <Field label="Ventilation">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        utilities: {
                          ...r.utilities,
                          ventilation: v,
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Notes">
                  <Input
                    onChange={(v) =>
                      updateRoom(room.id, (r) => ({
                        ...r,
                        utilities: { ...r.utilities, notes: v },
                      }))
                    }
                  />
                </Field>
              </TwoCol>
            </Section>

            {/* UPLOAD */}
            <UploadBox
              uploaded={!!room.document}
              onChange={(e) => handleFile(e, room.id)}
            />

            {/* CHECKBOX */}
            <label className="flex items-center gap-2 text-sm text-gray-600 mt-3">
              <input
                type="checkbox"
                className="accent-gray-900"
                checked={room.completed}
                onChange={(e) =>
                  updateRoom(room.id, (r) => ({
                    ...r,
                    completed: e.target.checked,
                  }))
                }
              />
              Mark as Completed
            </label>
          </div>
        ))}

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() =>
              setRooms((r) => [...r, createRoom()])
            }
            className="px-4 py-2 border rounded-xl text-sm bg-white hover:bg-gray-50"
          >
            + Add Room / Space
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-slate-800 text-white text-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL UI COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-4">
      <p className="text-sm font-medium text-gray-600 mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function TwoCol({ children }) {
  return <div className="grid grid-cols-2 gap-4 mb-3">{children}</div>;
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">
        {label}
      </span>
      {children}
    </div>
  );
}

function Input({ placeholder, onChange }) {
  return (
    <input
      className="w-full h-10 bg-gray-100 rounded-lg px-3 text-sm text-gray-700 outline-none focus:bg-gray-200"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function UploadBox({ uploaded, onChange }) {
  return (
    <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer mt-3 gap-2">
      <input type="file" className="hidden" onChange={onChange} />
      {uploaded ? (
        <span className="text-green-600 text-sm font-medium">
          ✓ File uploaded
        </span>
      ) : (
        <>
          <span className="text-sm font-medium text-gray-700">
            Upload A File Or Drag And Drop
          </span>
          <span className="text-xs text-gray-400">
            Png, Jpg, Gif Upto 50MB
          </span>
        </>
      )}
    </label>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}