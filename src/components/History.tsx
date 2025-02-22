import React, { useState, useEffect } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { fetchUserHistory, updateHistoryName, deleteHistory } from "../api/HistoriesApi"; // ✅ API 호출 함수
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { MenuItem } from "primereact/menuitem";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";

interface HistoryId {
  history_id: number;
}

interface HistoryName{
  history_name: string;
}

interface HistoryItem {
  id: number;
  name: string;
  history_ids: HistoryId[];
  history_names: HistoryName[];
}


interface HistoryProps {
  userId: number | null;
  onSelectHistory: (historyId: number) => void; // ✅ 선택한 historyId를 부모 컴포넌트로 전달
  histories: HistoryItem[] ;
  setHistories: (newHistories: HistoryItem[] ) => void;
}

const History: React.FC<HistoryProps> = ({ userId, onSelectHistory, histories, setHistories }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingHistory, setEditingHistory] = useState<{ problemId: number; index: number } | null>(null);
  const [newHistoryName, setNewHistoryName] = useState<string>("");
  const toast = React.useRef<Toast>(null);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      fetchUserHistory(userId)
        .then((data) => {
          setHistories(data);
          setIsLoading(false);
        })
        .catch(() => {
          setError("히스토리를 가져오는 중 오류가 발생했습니다.");
          setIsLoading(false);
        });
    }
    
  }, [userId]);

  // ✅ 히스토리 이름 변경 함수 (API 요청 포함)
  const handleUpdateHistoryName = async (problemId: number, index: number, historyId: number) => {
    if (!newHistoryName.trim()) return;

    const success = await updateHistoryName(historyId, newHistoryName);
    if (success) {
      setHistories((prevHistories) =>
        prevHistories.map((problem) =>
          problem.problem_id === problemId
            ? {
                ...problem,
                history_names: problem.history_names.map((name: string, i: number) =>
                  i === index ? newHistoryName : name
                ),
              }
            : problem
        )
      );
      toast.current?.show({ severity: "success", summary: "성공", detail: "이름 변경을 완료했어요" });
    } else {
      toast.current?.show({ severity: "error", summary: "실패", detail: "이름 변경 실패했어요" });
    }
    setEditingHistory(null);
  };

  // ✅ 히스토리 삭제 함수 (API 요청 포함)
  const handleDeleteHistory = async (problemId: number, index: number, historyId: number) => {
    const success = await deleteHistory(historyId);
    if (success) {
      setHistories((prevHistories) =>
        prevHistories
          .map((problem) =>
            problem.problem_id === problemId
              ? {
                  ...problem,
                  history_names: problem.history_names.filter((_: any, i: number) => i !== index),
                  history_ids: problem.history_ids.filter((_: any, i: number) => i !== index),
                }
              : problem
          )
          .filter((problem) => problem.history_names.length > 0)
      );
      toast.current?.show({ severity: "success", summary: "성공", detail: "히스토리 삭제 완료" });
    } else {
      toast.current?.show({ severity: "error", summary: "실패", detail: "히스토리 삭제 실패" });
    }
  };

  if (isLoading) return <ProgressSpinner />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!histories.length) return <p>저장된 히스토리가 없습니다.</p>;

  return (
    <>
      <Toast ref={toast} />
      <Accordion>
        {histories.map((problem) => (
          <AccordionTab key={problem.problem_id} header={problem.problem_name}>
            {problem.history_names.map((history: string, index: number) => {
              const historyId = problem.history_ids[index];

              const items: MenuItem[] = [
                {
                  label: "이름 변경",
                  icon: "pi pi-pencil",
                  command: () => setEditingHistory({ problemId: problem.problem_id, index }),
                },
                {
                  label: "삭제",
                  icon: "pi pi-trash",
                  command: () => handleDeleteHistory(problem.problem_id, index, historyId),
                },
              ];

              return (
                <div key={index} className="flex align-items-center gap-2 my-2">
                  {editingHistory && editingHistory.problemId === problem.problem_id && editingHistory.index === index ? (
                    <>
                      <InputText value={newHistoryName} onChange={(e) => setNewHistoryName(e.target.value)} />
                      <Button label="확인" onClick={() => handleUpdateHistoryName(problem.problem_id, index, historyId)} />
                    </>
                  ) : (
                    <SplitButton label={history} icon="pi pi-clock" className="p-button-text p-button-sm" model={items} onClick={() => onSelectHistory(historyId)} />
                  )}
                </div>
              );
            })}
          </AccordionTab>
        ))}
      </Accordion>
    </>
  );
};

export default History;