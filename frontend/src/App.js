import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import AdminDashboard from './components/AdminDashboard';
import EmployeesDashboard from './components/EmployeesDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import KPIs from './components/KPIs';
import EmployeeKPIs from './components/EmployeeKPIs';
import Feedback from './components/Feedback';
import Reports from './components/Reports';
import { useParams } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* General dashboard for all authenticated users */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />

        {/* Employee-only route */}
        <Route
          path="/employee"
          element={
            <RoleBasedRoute allowedRoles={['employee']}>
              <EmployeesDashboard />
            </RoleBasedRoute>
          }
        />

        {/* Manager-only route */}
        <Route
          path="/manager"
          element={
            <RoleBasedRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'manager']}>
              <Feedback />
            </RoleBasedRoute>
          }
        />

        {/* KPI input and display route (for example, for managers) */}
        <Route
          path="/kpis"
          element={
            <RoleBasedRoute allowedRoles={['manager', 'admin']}>
              <KPIs />
            </RoleBasedRoute>
          }
        />
        {/* Individual Employee KPI view, example: /employee-kpis/3 */}
        <Route
          path="/employee-kpis/:employeeId"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'manager']}>
              <EmployeeKPIsWrapper />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'manager']}>
              <Reports />
            </RoleBasedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

// A wrapper component to extract the employeeId param and pass it to EmployeeKPIs

const EmployeeKPIsWrapper = () => {
  const { employeeId } = useParams();
  return <EmployeeKPIs employeeId={employeeId} />;
};

export default App;
