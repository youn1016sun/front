import { EditorView, Decoration } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

// ✅ Title에서 사용한 연두색(성공) & 빨간색(실패) 적용
const passedColor = "#E8F5E9"; // ✅ 연두색 (is_passed: true) //#E8F5E9
const failedColor = "#FFEBEE"; // ✅ 빨간색 (is_passed: false) //#FFEBEE


// ✅ Highlight할 라인 정보 인터페이스
interface HighlightedLine {
  start: number;
  end: number;
  is_passed?: boolean;
}

// ✅ Highlight를 적용하는 함수 (각 라인마다 다른 색상 적용)
export const getHighlightDecorations = (highlights: HighlightedLine[]) => {
  return EditorView.decorations.compute(["doc"], (state) => {
    const builder = new RangeSetBuilder<Decoration>();

    highlights.forEach(({ start, end, is_passed }) => {
      const highlightColor = is_passed ? passedColor : failedColor;
      console.log("trueORfalse:", is_passed);

      for (let line = start; line <= end; line++) {
        const linePos = state.doc.line(line);
        builder.add(
          linePos.from,
          linePos.from,
          Decoration.line({
            attributes: { style: `background-color: ${highlightColor}; border-radius: 4px;` },
          })
        );
      }
    });

    return builder.finish();
  });
};

// ✅ 하이라이트 스타일 적용 (배경 색상만 Title과 동일하게 변경)
export const generateHighlightTheme = EditorView.baseTheme({
  ".cm-highlight-passed": {
    background: passedColor,
    borderLeft: "4px solid #4CAF50", // ✅ 연두색 테두리 //#4CAF50
    borderRadius: "4px",
  },
  ".cm-highlight-failed": {
    background: failedColor,
    borderLeft: "4px solid  #E53935", // ✅ 빨간색 테두리 // #E53935
    borderRadius: "4px",
  },
});