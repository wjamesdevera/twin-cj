"use client";

import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import AdminNavbar from "./components/adminNavbar";


const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar isOpen={isSidebarOpen} />
      <div style={{ flex: 1 }}>
        <AdminNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main style={{ marginTop: "60px" }}>
          {/* Test Page */}
        </main>
      </div>
    </div>
  );
};

export default App;
