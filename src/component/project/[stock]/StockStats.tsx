type StatCardProps = {
  label: string;
  value: string | number;
};

const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="bg-white border rounded-2xl p-5 w-full">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};

export default function StockStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Items" value="05" />
      <StatCard label="Low Stock Alert" value="02" />
      <StatCard label="Total Stock Value" value="₹45,67,890" />
      <StatCard label="In Stock" value="03" />
    </div>
  );
}