import React from "react";

type AlertItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  tag: string;
};

const alerts: AlertItem[] = [
  {
    id: 1,
    title: "Critical Stock Alert",
    description:
      "3 items below critical level - Steel TMT bars, Cement OPC 53",
    time: "10 Mins Ago",
    tag: "Stocks",
  },
  {
    id: 2,
    title: "Critical Stock Alert",
    description:
      "3 items below critical level - Steel TMT bars, Cement OPC 53",
    time: "10 Mins Ago",
    tag: "Stocks",
  },
  {
    id: 3,
    title: "Critical Stock Alert",
    description:
      "3 items below critical level - Steel TMT bars, Cement OPC 53",
    time: "10 Mins Ago",
    tag: "Stocks",
  },
  {
    id: 4,
    title: "Critical Stock Alert",
    description:
      "3 items below critical level - Steel TMT bars, Cement OPC 53",
    time: "10 Mins Ago",
    tag: "Stocks",
  },
];

const Alerts = () => {
  return (
    <div className="bg-white border rounded-xl p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-medium text-black ">Alerts & Notification</h2>
        <p className="text-sm text-gray-500">
          Critical updates requiring attention
        </p>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border rounded-lg p-4 flex items-start justify-between"
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                {alert.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {alert.description}
              </p>
              <span className="text-xs text-gray-400 mt-2 block">
                {alert.time}
              </span>
            </div>

            <span className="text-xs border border-yellow-400 text-yellow-600 px-3 py-1 rounded-md">
              {alert.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;