// app/components/ModuleCard.tsx

type Row = {
  label: string;
  value: string | number;
  valueColor?: string;
  labelColor?: string;
};

type ModuleCardProps = {
  title: string;
  progress?: number;
  rows: Row[];
};

const ModuleCard = ({ title, progress, rows }: ModuleCardProps) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm ">

      {/* Title */}
      <h4 className="text-base font-medium text-black mb-5">
        {title}
      </h4>

      {/* First row */}
      {rows[0] && (
        <div className="flex justify-between items-center text-xs mb-3">
          <span className={rows[0].labelColor ?? "text-gray-500"}>
            {rows[0].label}
          </span>
          <span className={`font-medium ${rows[0].valueColor ?? "text-black"}`}>
            {rows[0].value}
          </span>
        </div>
      )}

      {/* Progress bar (IMMEDIATELY after first row) */}
      {progress !== undefined && (
        <div className="mb-2">
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #0B1F3A 0%, #2F6FDB 50%, #0B1F3A 100%)",
              }}
            />
          </div>
        </div>
      )}

      {/* Remaining rows */}
      {rows.slice(1).map((row, index) => (
        <div
          key={index}
          className="flex justify-between items-center text-xs mb-2"
        >
          <span className={row.labelColor ?? "text-gray-500"}>
            {row.label}
          </span>
          <span className={`font-medium ${row.valueColor ?? "text-black"} mt-3`}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ModuleCard;