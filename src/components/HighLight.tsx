import { EditorView, Decoration } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

// ✅ 네온 느낌을 주는 그라데이션 + 글로우 효과
const highlightColors = [
  "linear-gradient(90deg, rgba(255, 0, 102, 0.4) 0%, rgba(255, 100, 200, 0.4) 100%)", // ❤️ 네온 핑크
  "linear-gradient(90deg, rgba(0, 122, 255, 0.4) 0%, rgba(100, 200, 255, 0.4) 100%)", // 💙 네온 블루
  "linear-gradient(90deg, rgba(50, 255, 131, 0.4) 0%, rgba(150, 255, 200, 0.4) 100%)", // 💚 네온 그린
  "linear-gradient(90deg, rgba(255, 220, 50, 0.4) 0%, rgba(255, 255, 150, 0.4) 100%)", // 💛 네온 옐로우
];

// ✅ Highlight할 라인 정보 인터페이스
interface HighlightedLine {
  start: number;
  end: number;
  colorIndex: number;
}

// ✅ Highlight를 적용하는 함수 (각 영역마다 다른 색상 적용)
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

// ✅ 네온 스타일 적용 (그라데이션 + 테두리 + 글로우 효과)
export const generateHighlightTheme = EditorView.baseTheme({
  ".cm-highlight-0": {
    background: highlightColors[0],
    borderLeft: "4px solid rgba(255, 0, 102, 0.8)", // ✅ 네온 핑크 테두리
    boxShadow: "0 0 10px rgba(255, 0, 102, 0.6)", // ✅ 네온 빛 효과
    borderRadius: "4px",
    color: "#fff", // ✅ 텍스트 색상 (화이트)
    fontWeight: "bold",
  },
  ".cm-highlight-1": {
    background: highlightColors[1],
    borderLeft: "4px solid rgba(0, 122, 255, 0.8)", // ✅ 네온 블루 테두리
    boxShadow: "0 0 10px rgba(0, 122, 255, 0.6)", // ✅ 네온 빛 효과
    borderRadius: "4px",
    color: "#fff",
    fontWeight: "bold",
  },
  ".cm-highlight-2": {
    background: highlightColors[2],
    borderLeft: "4px solid rgba(50, 255, 131, 0.8)", // ✅ 네온 그린 테두리
    boxShadow: "0 0 10px rgba(50, 255, 131, 0.6)", // ✅ 네온 빛 효과
    borderRadius: "4px",
    color: "#fff",
    fontWeight: "bold",
  },
  ".cm-highlight-3": {
    background: highlightColors[3],
    borderLeft: "4px solid rgba(255, 220, 50, 0.8)", // ✅ 네온 옐로우 테두리
    boxShadow: "0 0 10px rgba(255, 220, 50, 0.6)", // ✅ 네온 빛 효과
    borderRadius: "4px",
    color: "#fff",
    fontWeight: "bold",
  },
});