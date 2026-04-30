import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { Categories } from "../pages/Categories";
import { Dashboard } from "../pages/Dashboard";
import { ForgotPassword } from "../pages/ForgotPassword";
import { Help } from "../pages/Help";
import { Login } from "../pages/Login";
import { Profile } from "../pages/Profile";
import { Register } from "../pages/Register";
import { ResetPassword } from "../pages/ResetPassword";
import { Settings } from "../pages/Settings";
import { Transactions } from "../pages/Transactions";
import { ProtectedRoute } from "./ProtectedRoute";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedPage>
              <Transactions />
            </ProtectedPage>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedPage>
              <Categories />
            </ProtectedPage>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedPage>
              <Profile />
            </ProtectedPage>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedPage>
              <Settings />
            </ProtectedPage>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedPage>
              <Help />
            </ProtectedPage>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
