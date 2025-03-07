// src/components/KPIs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KPIChart from './KPIChart';

const KPIs = () => {
    // Form state for KPI input
    const [manualEmployeeId, setManualEmployeeId] = useState('');
    const [kpiName, setKpiName] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    // State for KPI entries
    const [metrics, setMetrics] = useState([]);
    // State for list of employees and selected employee ID (from dropdown)
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

    // Fetch the list of employees for the dropdown
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/employees', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // Fetch KPI data; if an employee is selected, filter by that employee_id
    const fetchMetrics = async () => {
        try {
            let url = 'http://localhost:5000/performance-metrics';
            if (selectedEmployeeId) {
                url += `?employee_id=${selectedEmployeeId}`;
            }
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching KPI data:', error);
        }
    };

    // Fetch employees once when the component mounts
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Re-fetch KPI data whenever the selected employee changes
    useEffect(() => {
        fetchMetrics();
    }, [selectedEmployeeId]);

    // Handle KPI form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Determine the employee ID to use:
        // Use the dropdown value if selected; otherwise, use the manual entry.
        const chosenEmployeeId =
            selectedEmployeeId !== ''
                ? parseInt(selectedEmployeeId, 10)
                : manualEmployeeId !== ''
                    ? parseInt(manualEmployeeId, 10)
                    : null;

        if (!chosenEmployeeId) {
            alert("Please select an employee from the dropdown or enter a valid employee ID.");
            return;
        }

        try {
            const payload = {
                employee_id: chosenEmployeeId,
                kpi_name: kpiName,
                value: parseInt(value, 10),
                date,
            };

            const response = await axios.post('http://localhost:5000/performance-metrics', payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            console.log('KPI submitted:', response.data);

            // Reset form fields
            setManualEmployeeId('');
            setKpiName('');
            setValue('');
            setDate('');
            // Refresh KPI list
            fetchMetrics();
        } catch (error) {
            console.error('Error submitting KPI:', error);
        }
    };

    return (
        <div>
            <h2>Input KPI Score</h2>
            {/* Dropdown to select an employee */}
            <div>
                <label>
                    Select Employee:
                    <select
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    >
                        <option value="">-- Select Employee --</option>
                        {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} (ID: {emp.id})
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            {/* Manual entry for employee ID (optional) */}
            <div>
                <label>
                    Or Enter Employee ID:
                    <input
                        type="number"
                        value={manualEmployeeId}
                        onChange={(e) => {
                            console.log('Manual Employee ID:', e.target.value);
                            setManualEmployeeId(e.target.value);
                        }}
                    />
                </label>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        KPI Name:
                        <input
                            type="text"
                            value={kpiName}
                            onChange={(e) => setKpiName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Score (1-5):
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            required
                            min="1"
                            max="5"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Date:
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Submit KPI</button>
            </form>

            <h3>KPI Scores</h3>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Employee ID</th>
                        <th>KPI Name</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.map((metric) => (
                        <tr key={metric.id}>
                            <td>{metric.id}</td>
                            <td>{metric.employee_id}</td>
                            <td>{metric.kpi_name}</td>
                            <td>{metric.value}</td>
                            <td>{new Date(metric.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pass the selectedEmployeeId to the KPIChart */}
            <KPIChart employeeId={selectedEmployeeId} />
        </div>
    );
};

export default KPIs;
