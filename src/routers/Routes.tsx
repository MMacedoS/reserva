import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import Login from "@/pages/Register/Login";
import { ProfilePage } from "@/pages/Profile/ProfilePage";
import { SettingsPage } from "@/pages/Settings/SettingsPage";
import { EmployeesPage } from "@/pages/Employees/EmployeesPage";
import { PermissionsPage } from "@/pages/Permissions/PermissionsPage";
import FinancePage from "@/pages/Finance/FinancePage";
import ReleasesPage from "@/pages/Finance/Releases/Releases";
import ProductsPage from "@/pages/Products/ProductsPage";
import { ReportTransactionsPage } from "@/pages/Reports/TransactionsReportPage";
import ReservationsPage from "@/pages/Reservations/ReservationsPage";
import ReservationsReportPage from "@/pages/Reports/ReservationsReportPage";
import TransactionsPage from "@/pages/Finance/Transactions/TransactionsPage";
import CustomerPage from "@/pages/Customer/CustomerPage";
import { ApartmentPage } from "@/pages/Apartments/ApartmentPage";
import SalesPage from "@/pages/Sales/SalesPage";
import AccommodationPage from "@/pages/Reservations/Accommodation/AccommodationPage";
import ConfirmationPage from "@/pages/Reservations/Confirmation/ConfirmationPage";
import MapPage from "@/pages/Reservations/Map/MapPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route
        path="/apartments"
        element={
          <RequireAuth>
            <ApartmentPage />
          </RequireAuth>
        }
      />
      <Route
        path="/customers"
        element={
          <RequireAuth>
            <CustomerPage />
          </RequireAuth>
        }
      />
      <Route
        path="/reservations"
        element={
          <RequireAuth>
            <ReservationsPage />
          </RequireAuth>
        }
      />

      <Route
        path="/reservations/accommodation"
        element={
          <RequireAuth>
            <AccommodationPage />
          </RequireAuth>
        }
      />

      <Route
        path="/reservations/confirmations"
        element={
          <RequireAuth>
            <ConfirmationPage />
          </RequireAuth>
        }
      />

      <Route
        path="/reservations/map"
        element={
          <RequireAuth>
            <MapPage />
          </RequireAuth>
        }
      />

      <Route
        path="/sales"
        element={
          <RequireAuth>
            <SalesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/products"
        element={
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <SettingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/employees"
        element={
          <RequireAuth>
            <EmployeesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/permissions"
        element={
          <RequireAuth>
            <PermissionsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/finance"
        element={
          <RequireAuth>
            <FinancePage />
          </RequireAuth>
        }
      />
      <Route
        path="/finance/releases"
        element={
          <RequireAuth>
            <ReleasesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/finance/transactions"
        element={
          <RequireAuth>
            <TransactionsPage />
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
            <ReportTransactionsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/report-reservations"
        element={
          <RequireAuth>
            <ReservationsReportPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Login />} />
    </Routes>
  );
}
