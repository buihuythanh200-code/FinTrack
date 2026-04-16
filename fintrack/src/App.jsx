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
import Transactions from "./pages/transactions/Transactions.jsx";
import Goals from "./pages/goals/Goals.jsx";

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

        {/* Trang Dashboard */}
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

        {/* Trang Transactions*/}
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <MainLayout>
                <Transactions />
              </MainLayout>
            </PrivateRoute>
          }
        />
        {/* Trang Goals */}
        <Route
          path="/goal"
          element={
            <PrivateRoute>
              <MainLayout>
                <Goals />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Mặc định vào web */}
        <Route path="/" element={<Navigate to="/transactions" />} />
      </Routes>
    </Router>
  );
}

export default App;
