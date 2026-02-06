"use client";

import React from "react";

type ActionProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

const Action = ({ icon, label, onClick }: ActionProps) => {
  return (
    <div
      onClick={onClick}
      className="h-[72px] w-full bg-white border rounded-xl px-5 flex items-center gap-4 cursor-pointer hover:shadow-sm transition"
    >
      <div className="w-10 h-10 border rounded-lg flex items-center justify-center text-gray-700">
        {icon}
      </div>
      <p className="font-medium text-sm text-gray-800">{label}</p>
    </div>
  );
};

export default Action;