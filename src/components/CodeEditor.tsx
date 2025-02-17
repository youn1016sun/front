import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { getHighlightDecorations, generateHighlightTheme } from "../components/HighLight"; // ✅ HighlightManager 사용
import solarizedTheme from "../styles/customTheme.js";


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
        // generateHighlightTheme, // ✅ 스타일 적용을 먼저
        // getHighlightDecorations(highlights), // ✅ 그 후 Decoration 추가
        python(), // ✅ JavaScript 문법 적용
      ]}
       // basicSetup={{ lineNumbers: true }}
      theme={solarizedTheme}
      style={{
        height: "350px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#ffffff",
        padding: "10px",
        overflow:"scroll",
      }}
    />
  );
};

export default CodeEditor;