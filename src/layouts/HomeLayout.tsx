import React, { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="home-layout">
      <Header />
      <main className="home-main">{children}</main> {/* ✅ children 사용 */}
      <Footer />
    </div>
  );
};

export default HomeLayout;
