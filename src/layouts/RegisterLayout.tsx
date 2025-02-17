import React, { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/homepage.css";
import "../styles/global.css";

interface HomeLayoutProps {
  children: ReactNode;
}

const LoginLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="home-layout">
      <Header />
        <main>
            {children}
        </main>
      <Footer />
    </div>
  );
};

export default LoginLayout;
