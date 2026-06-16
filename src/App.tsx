import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import QueryProvider from "@/components/QueryProvider";
import AppShell from "@/components/AppShell";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ClientsPage from "@/pages/ClientsPage";
import NewClientPage from "@/pages/NewClientPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
import PipelinePage from "@/pages/PipelinePage";
import DevicesPage from "@/pages/DevicesPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { customers } from "@/lib/routes";

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={<Navigate to={customers.dashboard} replace />}
          />
          <Route
            path="/customers"
            element={
              <AppShell>
                <DashboardPage />
              </AppShell>
            }
          />
          <Route
            path="/customers/clients"
            element={
              <AppShell>
                <ClientsPage />
              </AppShell>
            }
          />
          <Route
            path="/customers/clients/new"
            element={
              <AppShell>
                <NewClientPage />
              </AppShell>
            }
          />
          <Route
            path="/customers/clients/:id"
            element={
              <AppShell>
                <ClientDetailPage />
              </AppShell>
            }
          />
          <Route
            path="/customers/pipeline"
            element={
              <AppShell>
                <PipelinePage />
              </AppShell>
            }
          />
          <Route
            path="/customers/devices"
            element={
              <AppShell>
                <DevicesPage />
              </AppShell>
            }
          />
          {/* <Route
            path="*"
            element={
              <AppShell>
                <NotFoundPage />
              </AppShell>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}
