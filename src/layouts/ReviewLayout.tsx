import React, { ReactElement, useState, cloneElement } from "react";
import Header from "../components/Header";
import CustomSidebar from "../components/CustomSidebar";
import { useLocation } from "react-router-dom";

interface ReviewLayoutProps {
  children: ReactElement<any>;
}

const ReviewLayout: React.FC<ReviewLayoutProps> = ({ children }) => {
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("user_id");
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
  const [histories, setHistories] = useState<any>([]);

  return (
    //<div className="review-layout">
    <div className="home-layout">
      <Header />
      <div className="review-container">
        <CustomSidebar userId={userId} onSelectHistory={setSelectedHistoryId} histories={histories} setHistories={setHistories} />
        <main className="review-content">
          {React.isValidElement(children)
            ? cloneElement(children as ReactElement<any>, { selectedHistoryId, histories, setHistories })
            : children}
        </main>
      </div>
    </div>
  );
};

export default ReviewLayout;