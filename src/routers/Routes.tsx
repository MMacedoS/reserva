// src/routes/Routes.tsx
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Login from "@/pages/Register/Login";
import { Profile } from "@/pages/Profile/Profile";
import { Settings } from "@/pages/Settings/Settings";
import { Apartments } from "@/pages/Apartments/Apartments";
import { Employees } from "@/pages/Employees/Employees";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/apartments"
        element={
          <RequireAuth>
            <Apartments />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route
        path="/employees"
        element={
          <RequireAuth>
            <Employees />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
