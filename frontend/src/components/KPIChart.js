// src/components/KPIChart.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Import the Bar chart and necessary Chart.js modules
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const KPIChart = ({ employeeId }) => {
    // State to hold chart data
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'KPI Scores',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    });

    // Function to fetch KPI data from your backend
    const fetchData = useCallback(async () => {
        try {
            // Construct URL; if employeeId is provided, add it as a query parameter
            let url = 'http://localhost:5000/performance-metrics';
            if (employeeId) {
                url += `?employee_id=${employeeId}`;
            }
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // Assuming your response data is an array of KPI objects with kpi_name and value properties
            const data = response.data;
            const labels = data.map((item) => item.kpi_name);
            const values = data.map((item) => item.value);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'KPI Scores',
                        data: values,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching KPI data for chart:', error);
        }
    }, [employeeId]);

    // Re-fetch data when the component mounts or when employeeId changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Chart configuration options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'KPI Scores Chart',
            },
        },
    };

    return (
        <div>
            <h3>KPI Chart</h3>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default KPIChart;
