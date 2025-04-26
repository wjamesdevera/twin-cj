import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import styles from "./chart.module.scss";
import { Loading } from "./loading";
import { options } from "../api";

Chart.register(...registerables);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
  scales: {
    x: {
      grid: {
        display: true,
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
  const [chartData, setChartData] = useState<any>(null);
  const [filter, setFilter] = useState("monthly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${options.baseURL}/api/bookings/${filter}`,
          {
            headers: {
              "Cache-Control": "no-store",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const { monthlyBookingCount, yearlyBookingCount } =
          await response.json();

        const newData = {
          labels: Object.keys(monthlyBookingCount || yearlyBookingCount),
          datasets: [
            {
              label: `${
                filter.charAt(0).toUpperCase() + filter.slice(1)
              } Bookings`,
              data: Object.values(monthlyBookingCount || yearlyBookingCount),
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
        setChartData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.filterContainer}>
        <select
          value={filter}
          onChange={handleFilterChange}
          className={styles.filterDropdown}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className={styles.chartTitle}>Bookings</div>
      <div className={styles.chartWrapper}>
        {chartData ? <Bar data={chartData} options={chartOptions} /> : <Loading />}
      </div>
    </div>
  );
};

export default BookingsChart;
