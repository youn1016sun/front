import React, { ReactNode } from 'react';
import Header from '../components/Header';
import '../styles/global.css';
import CustomSidebar from '../components/CustomSidebar';
import { useLocation } from "react-router-dom";

interface ReviewLayoutProps {
  children: ReactNode;
}

const ReviewLayout: React.FC<ReviewLayoutProps> = ({ children }) => {
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("user_id");

  return (
    <div className="review-layout">
      <Header>
      <CustomSidebar userId={ userId } /> {/* 사이드바 안에 들어갈 히스토리 조회를 위한 userid를 넘겨줌.*/}
      </Header>
      <main className="review-content">
        {children}
      </main>
    </div>
  );
};

export default ReviewLayout;
