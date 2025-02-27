import React, { useState } from "react"; 
import { generateSolutionCode } from "../api/SolutionApi";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { EditorView, Decoration } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

interface SolutionHighLightedLine{
  start: number;
  end: number;
}

interface SolutionCodeProps {
  problemId: number | null;
  problemInfo: string | null;
  sourceCode: string;
  reviews: any[];
  setTabDisabled: (state: boolean) => void;
  isSolutionGenerated: boolean;
  setIsSolutionGenerated: (state: boolean) => void;
  solutionCode: string | null;
  setSolutionCode: (state: string | null) => void;
  solutionHighLightedLines: SolutionHighLightedLine[];
  setSolutionHighLightedLines: (state: SolutionHighLightedLine[]) => void;
}

const SolutionCode: React.FC<SolutionCodeProps> = ({ 
  problemId, 
  problemInfo, 
  sourceCode, 
  reviews, 
  setTabDisabled,
  setIsSolutionGenerated,
  solutionCode,
  setSolutionCode,
  solutionHighLightedLines,
  setSolutionHighLightedLines,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // POST 요청: 모범답안 생성
  const handleGenerateSolution = async () => {
    if (!problemId || !problemInfo) {
      console.error(`🚨 POST 요청 실패: problemId=${problemId}, problemInfo=${problemInfo}`);
      setError("문제 정보를 찾을 수 없어요. 리뷰생성 버튼을 먼저 눌러주세요.");
      return;
    }

    setIsLoading(true);
    setTabDisabled(true);

    const requestData = {
      problem_id: problemId,
      problem_info: problemInfo,
      source_code: sourceCode,
      reviews: reviews.map((review, index) => ({
        review_id: index + 1, // review_id는 1부터 시작
        title: review.title,
        comments: review.comments,
        start_line_number: 0,
        end_line_number: 0,
        is_passed: true,
      })),
    };

    try {
      const response = await generateSolutionCode(problemId, requestData);
      console.log(`📡 모범답안 POST 요청: /api/v1/solution/${problemId}`, requestData);
      console.log("✅ 모범답안 POST 응답:", response);
      console.log("✅ 모범답안 response.lines의 값:",response.lines);
      setSolutionCode(response.solution_code);
      setIsSolutionGenerated(true); // POST 요청 후 즉시 뱃지 업데이트

      // 응답에서 lines 데이터 추출하여 하이라이트 설정
      if (response.lines) {
        setSolutionHighLightedLines(
          response.lines.map((line: { start_line_number: number; end_line_number: number }) => ({
            start: line.start_line_number,
            end: line.end_line_number,
          }))
        );
      }
    } catch (error) {
      console.error(`❌ POST 요청 실패: problemId=${problemId}`, error);
      setError("솔루션 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setTabDisabled(false);
    }
  };

// CodeMirror 하이라이트 적용 함수
const applyHighlight = (solutionHighLightedLines: { start: number; end: number }[]) => {
  console.log("🔍 applyHighlight 실행됨 - solutionHighLightedLines:", JSON.stringify(solutionHighLightedLines));
  return EditorView.decorations.compute(["doc"], (state) => {
    const builder = new RangeSetBuilder<Decoration>();

    for (let line = 1; line <= state.doc.lines; line++) {
      const isHighlighted = solutionHighLightedLines.some(({ start, end }) => line >= start && line <= end);
      if (isHighlighted) {
        console.log(line);
        const linePos = state.doc.line(line);
        builder.add(
          linePos.from,
          linePos.from,
          Decoration.line({ attributes: { style: `background-color: #E8F5E9` } }) // 고정 색상 적용
        );
      }
    }

    return builder.finish();
  });
};

  return (
    <Card className="solution-container">
      {isLoading ? (
      <ProgressSpinner/>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : solutionCode ? (
        <CodeMirror
          value={solutionCode}
          extensions={[javascript(), applyHighlight(solutionHighLightedLines)]} // 하이라이트 적용
          readOnly={true}
          style={{
            padding: "0",
            minWidth: "100px",
            maxWidth: "37vw",
            height: "70vh",
            fontSize: "0.9vw",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
          }}
        />
      ) : (
        <div className="center-btn">
          <Button label="모범답안 생성" icon="pi pi-cog" onClick={handleGenerateSolution} className="p-button-primary p-button-lg" />
        </div>
      )}
    </Card>
  );
};

export default SolutionCode;