import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const Reports = () => {
    const [reportData, setReportData] = useState([]);

    // Fetch report data from the backend
    const fetchReportData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/reports/kpi-averages', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    // Process the data for Chart.js
    const labels = reportData.map((item) => {
        // Convert the "month" value to a readable format (assuming it's a date string)
        const date = new Date(item.month);
        return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
    });
    const avgScores = reportData.map((item) => parseFloat(item.avgScore).toFixed(2));

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Average KPI Score',
                data: avgScores,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Average KPI Score Per Month' },
        },
    };

    return (
        <div>
            <h2>Reports</h2>
            <div>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default Reports;
