import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </SettingsProvider>
  );
}
