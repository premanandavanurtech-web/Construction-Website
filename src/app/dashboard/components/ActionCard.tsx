"use client";

import { Plus, Box, AlertTriangle } from "lucide-react";
import Action from "./Action";

type Props = {
  onCreateTask: () => void;
};

const ActionCards = ({ onCreateTask }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <Action
        icon={<Plus size={20} />}
        label="Create New Project"
        onClick={onCreateTask}
      />

      <Action
        icon={<Box size={20} />}
        label="New Order"
        onClick={() => {}}
      />

      <Action
        icon={<AlertTriangle size={20} />}
        label="Report Issue"
        onClick={() => {}}
      />
    </div>
  );
};

export default ActionCards;
