import React, { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="home-layout">
      {children}
    </div>
  );
};

export default HomeLayout;
