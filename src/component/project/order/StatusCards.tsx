const stats = [
  { label: "Total Orders", value: "04" },
  { label: "In Process", value: "02" },
  { label: "Received", value: "01" },
  { label: "Total Value", value: "₹424,500" },
];

export default function StatusCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((item, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 bg-white"
        >
          <p className="text-sm text-gray-900">{item.label}</p>
          <h2 className="text-2xl text-black font-semibold mt-1">{item.value}</h2>
        </div>
      ))}
    </div>
  );
}