import React, { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeSection from "../components/HomeSection"; // 왼쪽 컴포넌트
import "../styles/homepage.css";
import "../styles/global.css";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="home-layout">
      <Header />
      <main className="home-main">
        <div className="home-left">
          <HomeSection />
        </div>
        <div className="home-right">     
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;