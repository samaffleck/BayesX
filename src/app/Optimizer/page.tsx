"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import ParamTable, { TableRow } from "@/components/ParamTable";
import BoGrah from "@/components/BoGraph";
import ExperimentsTable from "@/components/ExperimentsTable";

export default function Optimizer() {
  const [tableData, setTableData] = useState<TableRow[]>([
    { id: 1, name: "", min: 0, max: 0 },
  ]);
  
  // Use a single state for the metric name.
  const [metricName, setMetricName] = useState<string>("Metric");

  // Initially, no experiments have been recorded.
  const [experiments, setExperiments] = useState<{ id: number; values: Record<string, string> }[]>([]);
  const [nextValues, setNextValues] = useState<Record<string, number> | null>(null);

  const [plotData, setPlotData] = useState<any>(null);

  // State to toggle dropdowns
  const [isParamTableOpen, setIsParamTableOpen] = useState(true);
  const [isExperimentsTableOpen, setIsExperimentsTableOpen] = useState(true);

  const sendExperimentDataToServer = async (): Promise<void> => {
    const filteredExperiments = experiments.filter(exp =>
      Object.values(exp.values).some(val => val !== "")
    );
  
    const payload = {
      // Send your parameter definitions
      parameters: tableData
        .filter((param) => param.name.trim() !== "")
        .map((param) => ({
          name: param.name,
          min: param.min,
          max: param.max,
        })),
      // Send the metric definition as an array with one metric object.
      metrics: [{ name: metricName }],
      // Convert experiment values to numbers.
      experiments: filteredExperiments.map(exp => ({
        id: exp.id,
        values: Object.fromEntries(
          Object.entries(exp.values).map(([key, value]) => [key, parseFloat(value)])
        )
      })),
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/process_experiments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log("Server Response:", result);
      
      if (result.plot_data) {
        console.log("Data Available!")
        setPlotData(result.plot_data);
      }

      if (result.next_values) {
        const newExperiment = {
          id: experiments.length + 1,
          values: result.next_values,
        };
      
        setExperiments([newExperiment, ...experiments]);
      }      
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };
  
  // Handle changes for the Parameter Table.
  const handleTableChange = (id: number, field: keyof TableRow, value: string | number) => {
    setTableData((prevData) => {
      const updatedData = prevData.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      );
      const lastRow = updatedData[updatedData.length - 1];
      if (lastRow.name || (!isNaN(lastRow.min) && lastRow.min !== 0) || (!isNaN(lastRow.max) && lastRow.max !== 0)) {
        updatedData.push({ id: updatedData.length + 1, name: "", min: 0, max: 0 });
      }
      return updatedData;
    });
  };

  // Handle changes for the Experiments Table.
  const handleExperimentChange = (id: number, key: string, value: string) => {
    setExperiments((prevExperiments) =>
      prevExperiments.map((exp) =>
        exp.id === id
          ? { ...exp, values: { ...exp.values, [key]: value } }
          : exp
      )
    );
  };  

  return (
    <div className="flex h-screen">
      {/* Left Panel - Table Section */}
      <div className="w-1/3 p-4 border-r border-gray-300">
        {/* Parameter Data Dropdown */}
        <div className="border-b border-gray-300 pb-2 mb-4">
          <button
            onClick={() => setIsParamTableOpen(!isParamTableOpen)}
            className="flex items-center justify-between w-full text-xl font-bold py-2"
          >
            Parameter Data
            {isParamTableOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>
          {isParamTableOpen && <ParamTable data={tableData} onChange={handleTableChange} />}
        </div>

        {/* Metric Name Input */}
        <div className="border-b border-gray-300 pb-2 mb-4">
          <label className="block text-xl font-bold py-2">Metric Name</label>
          <input
            type="text"
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            className="w-full px-2 py-1 text-sm bg-transparent border border-gray-300 rounded"
          />
        </div>

        {/* Experiments Dropdown */}
        <div className="border-b border-gray-300 pb-2 mb-4">
          <button 
            onClick={() => setIsExperimentsTableOpen(!isExperimentsTableOpen)} 
            className="flex items-center justify-between w-full text-xl font-bold py-2"
          >
            Experiments
            {isExperimentsTableOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>
          {isExperimentsTableOpen && (
            <ExperimentsTable 
              parameters={tableData} 
              metric={metricName}
              experiments={experiments} 
              onExperimentChange={handleExperimentChange} 
              onProcessExperiments={sendExperimentDataToServer} 
            />
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 p-4">
        <h2 className="text-xl font-bold mb-4">BayesX</h2>
        <div className="p-4 border-b border-gray-300">
          <BoGrah plotData={plotData}/>
        </div>
      </div>
    </div>
  );
}
