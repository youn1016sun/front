import History from "../components/History";

interface HistoryItem {
  problem_id: number;
  problem_name: string;
  history_ids: number[];
  history_names: string[];
}

interface CustomSidebarProps {
  userId: number | null;
  onSelectHistory: (historyId: number) => void;
  histories: HistoryItem[];
  setHistories: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

export default function CustomSidebar({ userId, onSelectHistory, histories, setHistories}: CustomSidebarProps) {
  return (
    <div className="custom-sidebar">
      <h2 style={{fontSize:"2.4vh", fontFamily:"sans-serif", fontWeight:"900"}}>히스토리</h2>
      <History userId={userId} onSelectHistory={onSelectHistory} histories={histories} setHistories={setHistories} />
    </div>
  );
}
