import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import History from "../components/History";

interface CustomSidebarProps {
  userId: number | null;
  onSelectHistory: (historyId: number) => void;
  setSidebarOpen: (isOpen: boolean) => void; // ✅ 추가: 화면 조정용 상태 전달
}

export default function CustomSidebar({ userId, onSelectHistory, setSidebarOpen }: CustomSidebarProps) {
  const [visible, setVisible] = useState<boolean>(false);

  // ✅ 사이드바 열기
  const openSidebar = () => {
    setVisible(true);
    setSidebarOpen(true); // ✅ 화면 비율 조정
  };

  // ✅ 사이드바 닫기
  const closeSidebar = () => {
    setVisible(false);
    setSidebarOpen(false); // ✅ 화면 원래대로 복귀
  };

  return (
    <div className="sidebar-button">
      <Sidebar
        visible={visible}
        onHide={closeSidebar}
        className="custom-sidebar"
        modal={false} // ✅ 배경 어둡게 변하는 문제 해결
        blockScroll={false} // ✅ 스크롤 막힘 방지
      >
        <h2>히스토리</h2>
        <History userId={userId} onSelectHistory={onSelectHistory} />
      </Sidebar>
      <Button icon="pi pi-arrow-right" onClick={openSidebar} />
    </div>
  );
}