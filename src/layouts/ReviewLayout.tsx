import React, { ReactNode } from 'react';
import Header from '../components/Header';
import '../styles/global.css';
import CustomSidebar from '../components/CustomSidebar';
import HistoryTab from '../components/HistoryTab';
import { useLocation } from "react-router-dom";

interface ReviewLayoutProps {
  children: ReactNode;
}

const ReviewLayout: React.FC<ReviewLayoutProps> = ({ children }) => {
  const location = useLocation();
  const dataList = location.state?.histories;
  console.log(dataList);
  return (
    <div className="review-layout">
      <Header>
        <CustomSidebar><HistoryTab data={dataList} /></CustomSidebar>
      </Header>
      <main className="review-content">
        {children}
      </main>
    </div>
  );
};

export default ReviewLayout;
