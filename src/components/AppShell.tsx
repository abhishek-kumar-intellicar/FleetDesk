import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden">
      <Sidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
