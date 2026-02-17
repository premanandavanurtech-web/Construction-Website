"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { create } from "domain";

export type TaskInput = {
  
  project: string;
  location: string;
image?: string | null; 
};

export type Task = {
  id: string;
  project: string;
  location: string;
 image?: string | null;
 createdAt: number;   // ✅ ADD
  expiresAt: number;   
};

type Props = {
  onClose: () => void;
  onCreate: (task: TaskInput) => void;
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-gray-600">
      {label}
    </label>
    {children}
  </div>
);

const CreateProjectModal = ({ onClose, onCreate }: Props) => {
  const [task, setTask] = React.useState<TaskInput>({
    project: "",
    location: "",
    image: null,

  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.project.trim()) return;
   
//      const ONE_WEEK = 7*24*60*60*1000
    
//       const taskToStore = {
//         id:crypto.randomUUID(),
//         project:task.project,
//         location:task.location,
//         image:task.image ? URL.createObjectURL(task.image) : null ,
//         createdAt:Date.now(),
//         expiresAt:Date.now() + ONE_WEEK
//       } 

//       const existing  = JSON.parse(localStorage.getItem("task") || "[]")
     
// //save update list 
//       localStorage.setItem(
//         "tasks",
//         JSON.stringify([...existing, taskToStore])
//       )
    onCreate(task);
    onClose();
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]")

    const now  = Date.now ();
    const validtasks = stored.filter(
      (task:any) => task.expiresAt  > now
     )

     localStorage.setItem('tasks' , JSON.stringify(validtasks))
  },[])

  const [preview, setPreview] = React.useState<string | null>(null);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if(file.size > 300 * 1024){
    alert("image must be under 300kb");
    return ;
  }

  const reader = new FileReader();

  reader.onload = () => {
    setTask((prev) => ({
      ...prev, 
      image:reader.result as string, //BASE64
    }))
  }

  reader.readAsDataURL(file);

};



  return (
    <div className="fixed inset-0 text-black bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Create New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Field label="Project Name">
            <input
              name="project"
              value={task.project}
              onChange={handleChange}
              required
              className="w-full h-9 px-3 bg-[#e6e6e6] rounded-md text-sm"
            />
          </Field>

          <Field label="Location / Floor / Room">
            <input
              name="location"
              value={task.location}
              onChange={handleChange}
              required
              className="w-full h-9 px-3 bg-[#e6e6e6] rounded-md text-sm"
            />
          </Field>

          <Field label="Project Image">
  <input
    type="file"
    accept="image/*"
    required
    onChange={handleImageChange}
    className="w-full text-sm"
  />

  {preview && (
    <img
      src={preview}
      alt="Preview"
      className="mt-2 h-28 w-full object-cover rounded-md"
    />
  )}
</Field>


          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-9 border rounded-md text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full h-9 bg-slate-800 text-white rounded-md text-xs"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;





