import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Login from "@/pages/Register/Login";
import { Profile } from "@/pages/Profile/Profile";
import { Settings } from "@/pages/Settings/Settings";
import { Apartments } from "@/pages/Apartments/Apartments";
import { Employees } from "@/pages/Employees/Employees";
import { Permissions } from "@/pages/Permissions/Permissions";
import Finance from "@/pages/Finance/Finance";
import Releases from "@/pages/Finance/Releases/Releases";
import Products from "@/pages/Products/Products";
import Tables from "@/pages/Tables/Tables";
import Payments from "@/pages/Payments/Payments";
import { ReportTransactions } from "@/pages/Reports/TransactionsReport";
import Sales from "@/pages/Sales";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rotas principais com RequireAuth */}
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
        path="/clients"
        element={
          <RequireAuth>
            <div>Página de Hospedes</div>
          </RequireAuth>
        }
      />
      <Route
        path="/reservations"
        element={
          <RequireAuth>
            <div>Página de Reservas</div>
          </RequireAuth>
        }
      />
      <Route
        path="/sales"
        element={
          <RequireAuth>
            <Sales />
          </RequireAuth>
        }
      />
      <Route
        path="/products"
        element={
          <RequireAuth>
            <Products />
          </RequireAuth>
        }
      />
      <Route
        path="/tables"
        element={
          <RequireAuth>
            <Tables />
          </RequireAuth>
        }
      />
      <Route
        path="/payments"
        element={
          <RequireAuth>
            <Payments />
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
      <Route
        path="/permissions"
        element={
          <RequireAuth>
            <Permissions />
          </RequireAuth>
        }
      />

      <Route
        path="/finance"
        element={
          <RequireAuth>
            <Finance />
          </RequireAuth>
        }
      />
      <Route
        path="/finance/releases"
        element={
          <RequireAuth>
            <Releases />
          </RequireAuth>
        }
      />
      <Route
        path="/finance/income"
        element={
          <RequireAuth>
            <div>Página de Receitas</div>
          </RequireAuth>
        }
      />
      <Route
        path="/finance/reports"
        element={
          <RequireAuth>
            <div>Página de Relatórios Financeiros</div>
          </RequireAuth>
        }
      />
      <Route
        path="/report-transactions"
        element={
          <RequireAuth>
            <ReportTransactions />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Login />} />
    </Routes>
  );
}
