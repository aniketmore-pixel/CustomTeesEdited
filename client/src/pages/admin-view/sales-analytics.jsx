import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState([]); // Ensure it's an array
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
  const [totalConfirmedOrders, setTotalConfirmedOrders] = useState(0);
  const [totalPendingPayments, setTotalPendingPayments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get('/api/sales-analytics'); // Use the endpoint for analytics
        console.log('Analytics Response:', response.data); // Log the response

        const {
          totalSales,
          totalOrders,
          totalConfirmedOrders,
          totalPendingOrders,
          totalPendingPayments,
          totalUsers,
          totalProducts,
        } = response.data; // Destructure the response data

        setTotalSales(totalSales);
        setTotalOrders(totalOrders);
        setTotalConfirmedOrders(totalConfirmedOrders);
        setTotalPendingOrders(totalPendingOrders);
        setTotalPendingPayments(totalPendingPayments);
        setTotalUsers(totalUsers);
        setTotalProducts(totalProducts);

        // Fetch sales data for the line chart separately
        const salesResponse = await axios.get('/api/sales'); // Endpoint for sales data
        console.log('Sales Response:', salesResponse.data); // Log the sales data
        setSalesData(salesResponse.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchAnalyticsData();
  }, []);

  // Check if salesData is an array before mapping
  const chartData = {
    labels: Array.isArray(salesData)
      ? salesData.map(sale => new Date(sale.orderDate).toLocaleDateString())
      : [], // Fallback to an empty array if salesData is not an array
    datasets: [
      {
        label: 'Sales Amount',
        data: Array.isArray(salesData)
          ? salesData.map(sale => sale.totalAmount) // Sales data
          : [], // Fallback to an empty array
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  if (loading) return <div>Loading...</div>; // Show loading state while fetching data

  return (
    <div className="analytics-container">
      <h2>Sales Analytics</h2>
      <div className="stats">
        <div>Total Sales: ${totalSales}</div>
        <div>Total Orders: {totalOrders}</div>
        <div>Confirmed Orders: {totalConfirmedOrders}</div>
        <div>Pending Orders: {totalPendingOrders}</div>
        <div>Pending Payments: {totalPendingPayments}</div>
        <div>Total Users: {totalUsers}</div>
        <div>Total Products: {totalProducts}</div>
      </div>
      <Line data={chartData} />
    </div>
  );
};

export default SalesAnalytics;
