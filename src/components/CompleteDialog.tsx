import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, Decoration } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import BaseApi from "../api/BaseApi";

interface CompleteReviewDialogProps {
  visible: boolean;
  onHide: () => void;
  problemId: number | null;
  sourceCode: string;
  highlightedLines: { start: number; end: number }[];
}

// ✅ GET 요청 함수: First History 가져오기
const fetchFirstHistory = async (problemId: number) => {
  try {
    const response = await BaseApi.get(`/v1/histories/${problemId}/first-review`);
    console.log("✅ Before code 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Before code 요청 실패:", error);
    return null;
  }
};

const CompleteReviewDialog: React.FC<CompleteReviewDialogProps> = ({ visible, onHide, problemId, sourceCode, highlightedLines }) => {
  const [beforeCode, setBeforeCode] = useState<string | null>(null);
  const [beforeHighlights, setBeforeHighlights] = useState<{ start: number; end: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [beforeHighlightExtension, setBeforeHighlightExtension] = useState<any>([]);

  // ✅ Dialog가 열릴 때 첫 리뷰 코드 가져오기 : start_line_number값을 start로 변경
  useEffect(() => {
    if (visible && problemId) {
      setIsLoading(true);
      fetchFirstHistory(problemId).then((data) => {
        if (data) {
          setBeforeCode(data.first_code);
          setBeforeHighlights(
            data.lines.map((line: { start_line_number: number; end_line_number: number }) => ({
              start: line.start_line_number,
              end: line.end_line_number,
            }))
          );
        }
        setIsLoading(false);
      });
    }
  }, [visible, problemId]);

  // before 코드에 대한 하이라이트 색상 지정 : #FFEBEE
  useEffect(() => {
    if (beforeHighlights.length > 0) {
      console.log("🎨 Before 코드 하이라이트 적용:", beforeHighlights);
      setBeforeHighlightExtension(highlightWithOpacity(beforeHighlights, "#FFEBEE"));
    }
  }, [beforeHighlights]);

  // ✅ 하이라이트 적용 함수 - 겹치는 부분에 대한 고려 없이 같은 색상으로 적용됨
  const highlightWithOpacity = (highlights: { start: number; end: number }[], color: string) => {
    return EditorView.decorations.compute(["doc"], (state) => {
      const builder = new RangeSetBuilder<Decoration>();

      for (let line = 1; line <= state.doc.lines; line++) {
        const isHighlighted = highlights.some(({ start, end }) => line >= start && line <= end);
        if (isHighlighted) {
          const linePos = state.doc.line(line);
          builder.add(
            linePos.from,
            linePos.from,
            Decoration.line({ attributes: { style: `background-color: ${color}` } })
          );
        }
      }

      return builder.finish();
    });
  };
  const cardDesign= { 
    width: "100%", 
    padding: "1rem", 
    boxShadow: "none",
    border: "1px solid #b1b1fd",
  };
  const codeMirrorDesign = {
    height: "100%",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
    textAlign: "left" as const ,
  };
  return (
    <Dialog
      header="🎉 모든 리뷰 사항이 수정되었어요! 🎉"
      visible={visible}
      onHide={onHide}
      style={{ width: "99vw", height: "100vh", position: "relative", textAlign: "center"}}
      blockScroll={false}
    >
      <p>회원님의 첫 리뷰에서<br></br>얼마나 바뀌었는지 확인해보세요.</p>

      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          {/* ✅ Before Code */}
          <Card title="Before" style={ cardDesign }>
            <CodeMirror
              value={beforeCode || "첫 리뷰 코드가 없습니다."}
              extensions={[javascript(), beforeHighlightExtension]}
              readOnly
              style={ codeMirrorDesign }
            />
          </Card>

          {/* ✅ After Code */}
          <Card title="After" style={ cardDesign }>
            <CodeMirror
              value={sourceCode}
              extensions={[javascript(), highlightWithOpacity(highlightedLines, "#E8F5E9")]}
              readOnly
              style={codeMirrorDesign}
            />
          </Card>
        </div>
      )}
    </Dialog>
  );
};

export default CompleteReviewDialog;