// src/components/Feedback.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // If your jwt-decode exports named "jwtDecode"
// If not, adjust accordingly (see your package version)

const Feedback = () => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    let currentUserName = '';
    try {
        const decoded = jwtDecode(token);
        currentUserName = decoded.username; // Extract the username from the token
    } catch (error) {
        console.error('Error decoding token', error);
    }

    // Form state (from_user is auto-filled, so only to_employee, comment, rating, date)
    const [toEmployee, setToEmployee] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState('');
    const [date, setDate] = useState('');
    // State for list of feedback entries
    const [feedbacks, setFeedbacks] = useState([]);
    // State for employee dropdown
    const [employees, setEmployees] = useState([]);

    // Fetch the list of employees to populate the dropdown.
    // You might filter this list based on role (manager, admin) if needed.
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/employees', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // Fetch feedback entries.
    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/feedback', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchFeedbacks();
    }, []);

    // Handle feedback submission.
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                from_user: jwtDecode(token).id, // Automatically set from logged in user
                to_employee: parseInt(toEmployee, 10),
                comment,
                rating: parseInt(rating, 10),
                date,
            };

            const response = await axios.post('http://localhost:5000/feedback', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Feedback submitted:', response.data);
            // Reset the form
            setToEmployee('');
            setComment('');
            setRating('');
            setDate('');
            // Refresh the feedback list
            fetchFeedbacks();
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div>
            <h2>Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
                {/* Automatically display the logged-in user ID */}
                <div>
                    <label>
                        From User (Auto-selected): {' '}
                        <strong>{currentUserName || 'Not logged in'}</strong>
                    </label>
                </div>
                <div>
                    <label>
                        To Employee:
                        <select
                            value={toEmployee}
                            onChange={(e) => setToEmployee(e.target.value)}
                            required
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
                <div>
                    <label>
                        Comment:
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </label>
                </div>
                <div>
                    <label>
                        Rating (1-5):
                        <input
                            type="number"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
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
                <button type="submit">Submit Feedback</button>
            </form>

            <h3>Feedback Entries</h3>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>From User</th>
                        <th>To Employee</th>
                        <th>Comment</th>
                        <th>Rating</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((fb) => (
                        <tr key={fb.id}>
                            <td>{fb.id}</td>
                            <td>{fb.from_user}</td>
                            <td>{fb.to_employee}</td>
                            <td>{fb.comment}</td>
                            <td>{fb.rating}</td>
                            <td>{new Date(fb.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Feedback;
