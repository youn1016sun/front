import React, { ReactNode } from "react";
import Footer from "../components/Footer";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="home-layout">
      {children} {/* ✅ children 사용 */}
      <Footer />
    </div>
  );
};

export default HomeLayout;
