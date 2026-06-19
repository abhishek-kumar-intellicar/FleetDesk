import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "@/components/Sidebar";
import { selectUser } from "@/store";

export default function AppShell({ children }: { children: ReactNode }) {
  const user = useSelector(selectUser);
  const location = useLocation();

  // if (!user) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return (
    <div className="flex h-screen min-h-0 overflow-hidden">
      <Sidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
