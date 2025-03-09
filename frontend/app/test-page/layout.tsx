import React from "react";
import Sidebar from "../components/sidebar";

const TestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <Sidebar />
      <main>{children}</main>
    </section>
  );
};

export default TestLayout;
