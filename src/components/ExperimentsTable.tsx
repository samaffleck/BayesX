"use client";

import { useState } from "react";
import { TableRow } from "@/components/ParamTable";

interface ExperimentsTableProps {
  parameters: TableRow[];
  metric: string; // single metric name
  experiments: { id: number; values: Record<string, string> }[];
  onExperimentChange: (id: number, key: string, value: string) => void;  
  onProcessExperiments: () => Promise<void>; // Make async to properly handle loading state
}

export default function ExperimentsTable({
  parameters,
  metric,
  experiments,
  onExperimentChange,
  onProcessExperiments,
}: ExperimentsTableProps) {
  const [loading, setLoading] = useState(false); // State to track API call status

  // Function to handle API request with loading state
  const handleProcessExperiments = async () => {
    setLoading(true);
    try {
      await onProcessExperiments();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Generate Next Experiment Button */}
      <button
        onClick={handleProcessExperiments}
        disabled={loading} // Disable button while computing
        className={`mb-2 px-6 py-2 text-white text-sm rounded-lg shadow transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"
        }`}
      >
        {loading ? "Computing..." : "Generate Next Experiment"}
      </button>

      <table className="min-w-full border border-gray-300 divide-y divide-gray-300 text-sm">
        {/* Table Header */}
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="px-2 py-2 text-left border border-gray-300">ID</th>
            {parameters.map((param) =>
              param.name.trim() ? (
                <th key={param.id} className="px-2 py-2 text-left border border-gray-300">
                  {param.name}
                </th>
              ) : null
            )}
            <th className="px-2 py-2 text-left border border-gray-300">{metric}</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {experiments.map((exp) => (
            <tr key={exp.id}>
              <td className="px-2 py-2 border border-gray-300">{exp.id}</td>
              {/* Parameter Values (Read-Only) */}
              {parameters.map((param) =>
                param.name.trim() ? (
                  <td key={param.id} className="px-2 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={exp.values[param.name] ?? ""}
                      readOnly
                      className="w-full px-2 py-1 text-sm bg-gray-100 border-none outline-none placeholder-gray-400"
                      placeholder="-"
                    />
                  </td>
                ) : null
              )}
              {/* Metric Input (User Editable) */}
              <td className="px-2 py-2 border border-gray-300">
                <input
                  type="number"
                  step="any"
                  value={exp.values[metric] ?? ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    onExperimentChange(exp.id, metric, newValue);
                  }}
                  className="w-full px-2 py-1 text-sm bg-transparent border-none focus:bg-gray-200 hover:bg-gray-100 outline-none placeholder-gray-400"
                  placeholder="1.0"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
