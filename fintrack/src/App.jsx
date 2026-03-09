import { useState } from "react";
import "./App.css";
import Login from "./pages/auth";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import MainLayout from "./layouts/MainLayout/MainLayout.jsx";

function App() {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
}

export default App;
