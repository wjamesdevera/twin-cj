import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import styles from "./chart.module.scss";

Chart.register(...registerables);

const initialData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Monthly Bookings",
      data: [60, 70, 80, 75, 65, 40],
      backgroundColor: [
        "#8d6e63",
        "#a1887f",
        "#bcaaa4",
        "#d7ccc8",
        "#cfa792",
        "#ffccbc",
      ],
      borderRadius: 5,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
    },
  },
};

const BookingsChart: React.FC = () => {
  const [chartData, setChartData] = useState(initialData);

  const handleFilterChange = (filter: string) => {
    let newData;
    switch (filter) {
      case "weekly":
        newData = {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              ...initialData.datasets[0],
              data: [20, 30, 25, 35],
              label: "Weekly Bookings",
            },
          ],
        };
        break;
      case "monthly":
        newData = initialData;
        break;
      case "yearly":
        newData = {
          labels: ["2023", "2024"],
          datasets: [
            {
              ...initialData.datasets[0],
              data: [500, 700],
              label: "Yearly Bookings",
            },
          ],
        };
        break;
      default:
        newData = initialData;
    }
    setChartData(newData);
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.filterContainer}>
        <select
          onChange={(e) => handleFilterChange(e.target.value)}
          className={styles.filterDropdown}
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className={styles.chartTitle}>Bookings</div>
      <div className={styles.chartWrapper}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BookingsChart;
