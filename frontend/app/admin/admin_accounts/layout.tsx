import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-container">

      <main className="main-content">{children}</main>

    </div>
  );
}
