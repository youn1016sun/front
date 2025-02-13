import React, { useState, useEffect } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { fetchUserHistory } from "../api/HistoriesApi"; // ✅ API 호출 함수
import { ProgressSpinner } from "primereact/progressspinner";

interface UserHistoryProps {
  userId: number | null;
}

const UserHistory: React.FC<UserHistoryProps> = ({ userId }) => {
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
        .catch((err) => {
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
          <ul>
            {problem.history_names.map((history: string, index: number) => (
              <li key={index}>{history}</li>
            ))}
          </ul>
        </AccordionTab>
      ))}
    </Accordion>
  );
};

export default UserHistory;


// import { Divider } from 'primereact/divider';
// import "../styles/history.css"

// interface Props {
//     type: Number;
//     name: String;
// }

// function History({name="history"}: Props){
//     var tagName = "history "
//     return (
//         <>
//             <p className={tagName}>{ name }</p>
//         </>
//     );
// }

// export default History;