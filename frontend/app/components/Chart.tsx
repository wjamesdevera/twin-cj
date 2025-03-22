import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import styles from "./chart.module.scss";
import { Loading } from "./loading";

Chart.register(...registerables);

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
  const [chartData, setChartData] = useState<any>(null);
  const [filter, setFilter] = useState("monthly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/bookings/${filter}?timestamp=${new Date().getTime()}`,
          {
            headers: {
              "Cache-Control": "no-store",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        // Log the response data to inspect its structure
        console.log("Fetched data:", data);

        if (!data.bookings) {
          throw new Error("Invalid data format");
        }

        // Process the data to create labels and values
        const labels: string[] = [];
        const values: number[] = [];

        // Aggregate the bookings by service
        data.bookings.forEach((booking: any) => {
          const serviceIndex = labels.indexOf(booking.service);
          if (serviceIndex === -1) {
            labels.push(booking.service);
            values.push(booking.total);
          } else {
            values[serviceIndex] += booking.total;
          }
        });

        const newData = {
          labels: labels,
          datasets: [
            {
              label: `${
                filter.charAt(0).toUpperCase() + filter.slice(1)
              } Bookings`,
              data: values,
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
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className={styles.chartTitle}>Bookings</div>
      <div className={styles.chartWrapper}>
        {chartData ? <Bar data={chartData} options={options} /> : <Loading />}
      </div>
    </div>
  );
};

export default BookingsChart;
