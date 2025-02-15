import React, { useState, useEffect } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { fetchUserHistory } from "../api/HistoriesApi"; // ✅ API 호출 함수
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

interface HistoryProps {
  userId: number | null;
  onSelectHistory: (historyId: number) => void; // ✅ 선택한 historyId를 부모 컴포넌트로 전달
}

const History: React.FC<HistoryProps> = ({ userId, onSelectHistory }) => {
  const [histories, setHistories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) return <ProgressSpinner />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!histories.length) return <p>저장된 히스토리가 없습니다.</p>;

  return (
    <Accordion>
      {histories.map((problem) => (
        <AccordionTab key={problem.problem_id} header={problem.problem_name}>
          {problem.history_names.map((history: string, index: number) => (
            <Button
              key={index}
              label={history}
              className="p-button-text p-button-sm p-m-1"
              onClick={() => onSelectHistory(problem.history_ids[index])} // ✅ historyId 전달
            />
          ))}
        </AccordionTab>
      ))}
    </Accordion>
  );
};

export default History;
