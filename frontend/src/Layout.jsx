import React from "react";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
