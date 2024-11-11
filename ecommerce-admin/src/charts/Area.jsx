import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Client } from "../pages/api-client"; // Import NSwag API client

const AreaChart = () => {
  const apiClient = new Client();
  const [orderData, setOrderData] = useState([]);
  const [dates, setDates] = useState([]);

  // Fetch and process order data
  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const orders = await apiClient.orderGET();
      const { last30DaysDates, last30DaysOrderCounts } =
        processOrderData(orders);
      setDates(last30DaysDates);
      setOrderData(last30DaysOrderCounts);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const processOrderData = (orders) => {
    const today = new Date();
    const last30DaysDates = [];
    const last30DaysOrderCounts = Array(30).fill(0);

    // Generate dates for the last 30 days
    for (let i = 30; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
      last30DaysDates.push(formattedDate);
    }

    // Count orders per day
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      const dayIndex = last30DaysDates.indexOf(orderDate);
      if (dayIndex !== -1) {
        last30DaysOrderCounts[dayIndex] += 1; // Increment order count for the day
      }
    });

    return { last30DaysDates, last30DaysOrderCounts };
  };

  const options = {
    chart: {
      type: "area",
      width: "100%",
      fontFamily: "Inter, sans-serif",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#4CAF50"],
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        opacityFrom: 0.6,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    dataLabels: { enabled: false },
    grid: { borderColor: "#f1f1f1" },
    xaxis: {
      categories: dates,
      labels: { style: { colors: "#888" } },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (value) => `${value}`,
        style: { colors: "#888" },
      },
    },
    tooltip: {
      x: { show: true },
      y: {
        formatter: (val) => `${val} orders`,
      },
      marker: { show: true },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "13px",
      fontWeight: 500,
      labels: { colors: "#888" },
    },
  };

  const series = [
    {
      name: "Orders",
      data: orderData,
    },
  ];

  return (
    <div className="chart">
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default AreaChart;
