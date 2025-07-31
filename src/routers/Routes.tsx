// src/routes/Routes.tsx
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Login from "@/pages/Register/Login";
import { Profile } from "@/pages/Profile/Profile";

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
      <Route path="/profile" 
        element={
        <RequireAuth>
          <Profile/>
        </RequireAuth>
      }/>
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
