// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [managerId, setManagerId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { username, password, role };
            // If role is employee, include extra fields
            if (role === 'employee') {
                payload.email = email;
                payload.department = department;
                payload.position = position;
                payload.manager_id = managerId;
            }
            const response = await axios.post('http://localhost:5000/auth/register', payload);
            console.log('Registration successful:', response.data);
            navigate('/login'); // Redirect to login after successful registration
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                </select>
                {role === 'employee' && (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Manager ID (optional)"
                            value={managerId}
                            onChange={(e) => setManagerId(e.target.value)}
                        />
                    </>
                )}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
