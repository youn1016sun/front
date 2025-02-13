import { EditorView, Decoration, DecorationSet } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

// ✅ 미리 정의된 색상 리스트 (필요하면 더 추가 가능)
const highlightColors = ["#fffa90", "#ffb6c1", "#90ee90", "#87ceeb", "#dda0dd", "#f0e68c"];

// ✅ Highlight할 라인 정보 인터페이스
interface HighlightedLine {
  start: number;
  end: number;
  colorIndex: number; // ✅ 색상 인덱스 추가
}

// ✅ Highlight를 적용하는 함수 (각 영역마다 색상 다르게 설정)
export const getHighlightDecorations = (highlights: HighlightedLine[]) => {
    return EditorView.decorations.compute(["doc"], (state) => {
      const builder = new RangeSetBuilder<Decoration>();
  
      highlights.forEach(({ start, end, colorIndex }) => {
        const colorClass = `cm-highlight-${colorIndex % highlightColors.length}`; // ✅ 색상 순환 적용
        for (let line = start; line <= end; line++) {
          const linePos = state.doc.line(line);
          builder.add(linePos.from, linePos.from, Decoration.line({ class: colorClass }));
        }
      });
  
      return builder.finish();
    });
  };
  

// ✅ 동적으로 색상을 적용하는 테마 - 현재 가능 색상 6개
export const generateHighlightTheme = EditorView.baseTheme({
    ".cm-highlight-0": { backgroundColor: "#fffa90", borderRadius: "3px" },
    ".cm-highlight-1": { backgroundColor: "#ffb6c1", borderRadius: "3px" },
    ".cm-highlight-2": { backgroundColor: "#90ee90", borderRadius: "3px" },
    ".cm-highlight-3": { backgroundColor: "#87ceeb", borderRadius: "3px" },
    ".cm-highlight-4": { backgroundColor: "#dda0dd", borderRadius: "3px" },
    ".cm-highlight-5": { backgroundColor: "#f0e68c", borderRadius: "3px" },
  });
  

