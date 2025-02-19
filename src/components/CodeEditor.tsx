import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { getHighlightDecorations, generateHighlightTheme } from "../components/HighLight"; // ✅ Highlight 기능 적용

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

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, readOnly = false, highlights = [] }) => {
  return (
    <CodeMirror
      value={code}
      onChange={readOnly ? () => {} : (value) => setCode(value)}
      extensions={[
        javascript(), // ✅ JavaScript 문법 적용
        generateHighlightTheme, // ✅ 하이라이트 테마 적용
        getHighlightDecorations(highlights), // ✅ 하이라이트 적용
      ]}
      style={{
        height: "350px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: readOnly ? "#f4f4f4" : "#ffffff",
        padding: "10px",
        overflow: "scroll",
      }}
    />
  );
};

export default CodeEditor;