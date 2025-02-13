import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { getHighlightDecorations, generateHighlightTheme } from "../components/HighLight"; // ✅ HighlightManager 사용

interface HighlightedLine {
  start: number;
  end: number;
  colorIndex: number;
}

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  highlights?: HighlightedLine[];
}

 // ✅ HighlightManager 사용

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, highlights = [] }) => {
  return (
    <CodeMirror
      value={code}
      onChange={(value) => setCode(value)}
      extensions={[
        generateHighlightTheme, // ✅ 스타일 적용을 먼저
        getHighlightDecorations(highlights), // ✅ 그 후 Decoration 추가
        javascript(), // ✅ JavaScript 문법 적용
      ]}
      basicSetup={{ lineNumbers: true }}
      style={{
        height: "350px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#ffffff",
        padding: "10px",
      }}
    />
  );
};

export default CodeEditor;