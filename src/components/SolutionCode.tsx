import React, { useState, useEffect } from "react";
import { fetchSolutionCode } from "../api/SolutionApi"; // ✅ API 호출 함수
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark"; // ✅ 다크 테마 적용 가능
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";

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
        .catch(() => {
          setError("솔루션을 가져오는 중 오류가 발생했습니다.");
          setIsLoading(false);
        });
    }
  }, [historyId]); // ✅ historyId가 변경될 때마다 실행

  return (
    <Card className="solution-container">
      {isLoading ? (
        <ProgressSpinner /> // ✅ 로딩 중일 때 스피너 표시
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : solutionCode ? (
        <CodeMirror
          value={solutionCode}
          extensions={[javascript()]} // ✅ JavaScript 문법 적용
          readOnly={true} // ✅ 읽기 전용 적용
          style={{
            height: "350px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#ffffff", // ✅ 읽기 전용이라 회색 배경
            padding: "10px",
            overflow: "scroll",
          }}
        />
      ) : (
        <p>모범답안이 없습니다.</p>
      )}
    </Card>
  );
};

export default SolutionCode;