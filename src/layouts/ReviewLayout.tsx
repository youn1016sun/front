import React, { ReactElement, useState, cloneElement } from "react";
import Header from "../components/Header";
import "../styles/global.css";
import CustomSidebar from "../components/CustomSidebar";
import { useLocation } from "react-router-dom";

interface ReviewLayoutProps {
  children: ReactElement<any>; // ✅ 일반적인 `ReactElement<any>`로 설정하여 유연하게 처리
}

const ReviewLayout: React.FC<ReviewLayoutProps> = ({ children }) => {
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("user_id");
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  // ✅ 사이드바 상태 추가
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className={`review-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Header>
        {/* ✅ CustomSidebar에서 화면 조정 가능하도록 setSidebarOpen 전달 */}
        <CustomSidebar userId={userId} onSelectHistory={setSelectedHistoryId} setSidebarOpen={setIsSidebarOpen} />
      </Header>

      <main className="review-content">
        {/* ✅ children이 ReviewPage인 경우에만 selectedHistoryId 전달 */}
        {React.isValidElement(children)
          ? cloneElement(children as ReactElement<any>, { selectedHistoryId })
          : children}
      </main>
    </div>
  );
};

export default ReviewLayout;