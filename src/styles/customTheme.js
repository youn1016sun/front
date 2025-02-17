import { EditorView } from "@codemirror/view";

const solarizedTheme = EditorView.theme({
  // 배경 및 기본 글씨 색
  "&": { backgroundColor: "#ffffff", color: "#839496" }, 
  // 커서 색상
  ".cm-content": { caretColor: "#839496" }, 
  // 포커스 시 커서 색상
  "&.cm-focused .cm-cursor": { borderLeftColor: "#839496" }, 
  // 라인 넘버 배경 및 색상
  ".cm-gutters": { backgroundColor: "#ffffff", color: "#586e75" }, 
}, { dark: false });

export default solarizedTheme;