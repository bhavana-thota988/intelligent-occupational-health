import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

export default function EmployeeLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        role="employee"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div className="main-content-offset">
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="page-wrapper animate-fade">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
