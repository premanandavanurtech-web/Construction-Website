"use client";

export default function ContractRenewalAlerts() {
  const alerts = [
    {
      id: 1,
      title: "Elite Construction Subcon - Contract CT003",
      subtitle: "Expires in 70 days (Dec 31, 2024)",
    },
    {
      id: 2,
      title: "Elite Construction Subcon - Contract CT003",
      subtitle: "Expires in 70 days (Dec 31, 2024)",
    },
    {
      id: 3,
      title: "Elite Construction Subcon - Contract CT003",
      subtitle: "Expires in 70 days (Dec 31, 2024)",
    },
  ];

  return (
    <div className="bg-white border mt-5 border-gray-200 rounded-xl p-6">
      
      {/* Header */}
      <h2 className="text-sm font-semibold text-gray-900">
        Contract & Renewal Alerts
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Upcoming contract expirations and renewals
      </p>

      {/* Alert Items */}
      <div className="space-y-3">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {item.subtitle}
              </p>
            </div>

            <button className="px-4 py-1.5 text-sm border border-slate-700 text-slate-700 rounded-md hover:bg-slate-50">
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}