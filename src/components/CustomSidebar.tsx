import History from "../components/History";

interface HistoryId {
  id: number;
}

interface HistoryName{
  name: string;
}

interface HistoryItem {
  id: number;
  name: string;
  history_ids: HistoryId[];
  history_names: HistoryName[];
}

interface CustomSidebarProps {
  userId: number | null;
  onSelectHistory: (historyId: number) => void;
  histories: { [key: string]: HistoryItem[] };
  setHistories: (newHistories: { [key: string]: HistoryItem[] }) => void;
}

export default function CustomSidebar({ userId, onSelectHistory, histories, setHistories}: CustomSidebarProps) {
  return (
    <div className="custom-sidebar"> {/* ✅ 항상 열려 있는 사이드바 */}
      <h2 style={{fontSize:"2.4vh", fontFamily:"sans-serif", fontWeight:"900"}}>히스토리</h2>
      <History userId={userId} onSelectHistory={onSelectHistory} histories={histories} setHistories={setHistories} />
    </div>
  );
}