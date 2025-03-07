import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
} from "chart.js";

// Register required components.
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PlotData {
  x: number[];
  y_pred: number[];
  sigma: number[];
  observed_x: number[];
  observed_y: number[];
}

interface BoGraphProps {
  plotData: PlotData | null;
}

export default function BoGraph({ plotData }: BoGraphProps) {
  if (!plotData) {
    return <div>No plot data available</div>;
  }
  
  const { x, y_pred, sigma, observed_x, observed_y } = plotData;
  
  // Create the GP mean data as an array of {x, y} objects.
  const gpMeanData = x.map((xi, i) => ({ x: xi, y: y_pred[i] }));
  
  // Create upper and lower bound data.
  const upperData = x.map((xi, i) => ({ x: xi, y: y_pred[i] + sigma[i] }));
  const lowerData = x.map((xi, i) => ({ x: xi, y: y_pred[i] - sigma[i] }));
  
  // Create a closed polygon for the confidence interval:
  // first the upper bound, then the lower bound in reverse order.
  const confidenceData = [...upperData, ...lowerData.reverse()];
  
  // Observed points dataset.
  const observedData = observed_x.map((ox, i) => ({ x: ox, y: observed_y[i] }));
  
  // Build chart data.
  const data: ChartData<"line", { x: number; y: number }[], number> = {
    // When using per-point x values, no global "labels" array is needed.
    datasets: [
      {
        label: "Confidence Interval",
        data: confidenceData,
        backgroundColor: "rgba(128, 128, 128, 0.3)",
        borderColor: "rgba(128, 128, 128, 0.3)",
        fill: true,
        pointRadius: 1,
        borderWidth: 1,
        order: 3,
      },
      {
        label: "GP Mean",
        data: gpMeanData,
        borderColor: "black",
        fill: false,
        pointRadius: 1,
        borderWidth: 1,
        order: 2,
      },
      {
        label: "Observed Points",
        data: observedData,
        backgroundColor: "red",
        pointRadius: 4,
        showLine: false,
        order: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Gaussian Process Regression" },
    },
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
        title: { display: true, text: "Parameter" },
      },
      y: {
        title: { display: true, text: "Objective Function" },
      },
    },
  };
  
  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
}
