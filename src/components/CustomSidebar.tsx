import React from "react";
import History from "../components/History";

interface CustomSidebarProps {
  userId: number | null;
  onSelectHistory: (historyId: number) => void;
}

export default function CustomSidebar({ userId, onSelectHistory }: CustomSidebarProps) {
  return (
    <div className="custom-sidebar"> {/* ✅ 항상 열려 있는 사이드바 */}
      <h2>히스토리</h2>
      <History userId={userId} onSelectHistory={onSelectHistory} />
    </div>
  );
}