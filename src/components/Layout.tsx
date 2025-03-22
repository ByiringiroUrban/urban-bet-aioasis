
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BettingSlip from "./BettingSlip";

interface LayoutProps {
  children: React.ReactNode;
  hideBettingSlip?: boolean;
}

const Layout = ({ children, hideBettingSlip = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {!hideBettingSlip && <BettingSlip />}
      <Footer />
    </div>
  );
};

export default Layout;
