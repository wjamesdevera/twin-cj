import React from "react";
import AdminNavbar from "../components/admin_navbar"; 

const TestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <AdminNavbar /> 
      <main>{children}</main>
    </section>
  );
};

export default TestLayout;