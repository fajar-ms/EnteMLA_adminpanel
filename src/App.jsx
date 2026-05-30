import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/ProtectedRoute";
import CreateEmployee from "./pages/CreateEmployee";
import CreateMla from "./pages/CreateMla";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateCitizen from "./pages/CreateCitizen";

export default function App() {
  return (

    <BrowserRouter>
      <ToastContainer />

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-employee"
          element={
            <ProtectedRoute>
              <CreateEmployee />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-mla"
          element={
            <ProtectedRoute>
              <CreateMla />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-citizen"
          element={
            <ProtectedRoute>
              <CreateCitizen />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}