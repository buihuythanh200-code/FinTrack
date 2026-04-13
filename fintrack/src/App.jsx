import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/auth";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import MainLayout from "./layouts/MainLayout/MainLayout.jsx";

// Component bảo vệ Route: Nếu chưa có token thì bắt quay về Login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang Login công khai */}
        <Route path="/login" element={<Login />} />

        {/* Trang Dashboard cần bảo vệ và dùng Layout chung */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Mặc định vào web sẽ tự chuyển sang dashboard (nếu có token) hoặc login */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
