"use client";

export interface MetricTableRow {
  id: number;
  name: string;
}

interface MetricTableProps {
  data: MetricTableRow[];
  onChange: (id: number, field: keyof MetricTableRow, value: string | number) => void;
}

const MetricTable: React.FC<MetricTableProps> = ({ data, onChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 divide-y divide-gray-300 text-m">
        {/* Table Head */}
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="px-1 py-1 text-left border border-gray-300">Name</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={row.id}>
              {/* Name Input */}
              <td className="border border-gray-300">
                <input
                  type="text"
                  value={row.name}
                  placeholder="Metric name"
                  onChange={(e) => onChange(row.id, "name", e.target.value)}
                  className="w-full px-1 text-l bg-transparent border-none focus:bg-gray-200 hover:bg-gray-100 outline-none placeholder-gray-400"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "Metric name")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetricTable;
