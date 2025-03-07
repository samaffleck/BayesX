"use client";

export interface TableRow {
  id: number;
  name: string;
  min: number;
  max: number;
}

interface TableProps {
  data: TableRow[];
  onChange: (id: number, field: keyof TableRow, value: string | number) => void;
}

const ParamTable: React.FC<TableProps> = ({ data, onChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 divide-y divide-gray-300 text-m">
        {/* Table Head */}
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="px-1 py-1 text-left border border-gray-300">Name</th>
            <th className="px-1 py-1 text-left border border-gray-300">Minimum</th>
            <th className="px-1 py-1 text-left border border-gray-300">Maximum</th>
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
                  placeholder="Parameter name"
                  onChange={(e) => onChange(row.id, "name", e.target.value)}
                  className="w-full px-1 text-l bg-transparent border-none focus:bg-gray-200 hover:bg-gray-100 outline-none placeholder-gray-400"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "Parameter name")}
                />
              </td>

              {/* Min Input */}
              <td className="border border-gray-300">
                <input
                  type="number"
                  step="0.01"
                  value={row.min || ""}
                  placeholder="-5.0"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    onChange(row.id, "min", !isNaN(value) ? value : "");
                  }}
                  className="w-full px-1 text-l bg-transparent border-none focus:bg-gray-200 hover:bg-gray-100 outline-none appearance-none placeholder-gray-400 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "-5.0")}
                />
              </td>

              {/* Max Input */}
              <td className="py-0 border border-gray-300">
                <input
                  type="number"
                  step="0.01"
                  value={row.max || ""}
                  placeholder="5.0"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    onChange(row.id, "max", !isNaN(value) ? value : "");
                  }}
                  className="w-full px-1 text-l bg-transparent border-none focus:bg-gray-200 hover:bg-gray-100 outline-none appearance-none placeholder-gray-400 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "5.0")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParamTable;
