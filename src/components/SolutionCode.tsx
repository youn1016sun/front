import React, { useState, useEffect } from "react";
import { fetchSolutionCode } from "../api/SolutionApi"; // ✅ API 호출 함수

interface SolutionCodeProps {
  historyId: number | null;
}

const SolutionCode: React.FC<SolutionCodeProps> = ({ historyId }) => {
  const [solutionCode, setSolutionCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (historyId && !solutionCode) { // ✅ historyId가 있고, 이전에 요청한 데이터가 없을 때만 실행
      setIsLoading(true);
      fetchSolutionCode(historyId)
        .then((data) => {
          setSolutionCode(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError("솔루션을 가져오는 중 오류가 발생했습니다.");
          setIsLoading(false);
        });
    }
  }, [historyId]); // ✅ historyId가 변경될 때마다 실행

  if (isLoading) return <p>모범답안을 불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!solutionCode) return <p>모범답안이 없습니다.</p>;

  return (
    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px", whiteSpace: "pre-wrap" }}>
      {solutionCode}
    </pre>
  );
};

export default SolutionCode;
