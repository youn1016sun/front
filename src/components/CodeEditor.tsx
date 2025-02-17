import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
// import { getHighlightDecorations, generateHighlightTheme } from "../components/HighLight"; // ✅ HighlightManager 사용

interface HighlightedLine {
  start: number;
  end: number;
  colorIndex: number;
}

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  readOnly?: boolean;
  highlights?: HighlightedLine[];
}

 // ✅ HighlightManager 사용

 const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, readOnly = false, highlights = [] }) => {
  return (
    <CodeMirror
      value={code}
      onChange={readOnly ? () => {} : (value) => setCode(value)} // ✅ readOnly이면 변경 불가능하게 설정
      extensions={[
        javascript(), // ✅ JavaScript 문법 적용
      ]}
      style={{
        height: "350px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: readOnly ? "#f4f4f4" : "#ffffff", // ✅ 읽기 전용이면 회색 배경 적용
        padding: "10px",
        overflow: "scroll",
      }}
    />
  );
};

export default CodeEditor;