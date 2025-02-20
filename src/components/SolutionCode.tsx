import React, { useState } from "react";
import { generateSolutionCode } from "../api/SolutionApi";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";

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
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ POST 요청: 모범답안 생성
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
        review_id: index + 1, // ✅ review_id는 1부터 시작
        title: review.title,
        comments: review.comments,
        start_line_number: 0,
        end_line_number: 0,
        is_passed: true,
      })),
    };

    console.log(`📡 POST 요청: /api/v1/solution/${problemId}`, requestData);

    try {
      const response = await generateSolutionCode(problemId, requestData);
      console.log("✅ POST 응답:", response);

      setSolutionCode(response.solution_code);
      setIsSolutionGenerated(true); // ✅ POST 요청 후 즉시 뱃지 업데이트

    } catch (error) {
      console.error(`❌ POST 요청 실패: problemId=${problemId}`, error);
      setError("솔루션 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setTabDisabled(false);
    }
  };

  return (
    <Card className="solution-container">
      {isLoading ? (
        <ProgressSpinner />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : solutionCode ? (
        <CodeMirror
          value={solutionCode}
          extensions={[javascript()]}
          readOnly={true}
          style={{
            height: "350px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            padding: "10px",
            overflow: "scroll",
          }}
        />
      ) : (
        <Button label="모범답안 생성" icon="pi pi-cog" onClick={handleGenerateSolution} className="p-button-primary p-button-lg" style={{ display: "block", margin: "0 auto" }} />
      )}
    </Card>
  );
};

export default SolutionCode;


// import React, { useState, useEffect } from "react";
// import { fetchSolutionCode, generateSolutionCode } from "../api/SolutionApi";
// import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
// import { Card } from "primereact/card";
// import { ProgressSpinner } from "primereact/progressspinner";
// import { Button } from "primereact/button";

// interface SolutionCodeProps {
//   problemId: number | null;
//   problemInfo: string | null;
//   sourceCode: string;
//   reviews: any[];
//   setTabDisabled: (state: boolean) => void; // ✅ 모범답안 탭 비활성화 여부 설정
//   isSolutionGenerated: boolean;
//   setIsSolutionGenerated: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const SolutionCode: React.FC<SolutionCodeProps> = ({ problemId, problemInfo, sourceCode, reviews, setTabDisabled }) => {
//   const [solutionCode, setSolutionCode] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isCreated, setIsCreated] = useState<boolean>(false);
//   const [isSolutionGenerated, setIsSolutionGenerated] = useState<boolean>(false);

//   useEffect(() => {
//     if (problemId) {
//       console.log(`📡 GET 요청 시작: /api/v1/solution/${problemId}`); // ✅ GET 요청 시작 로그
//       setIsLoading(true);
//       setTabDisabled(true); // ✅ 요청 중에는 탭 비활성화

//       fetchSolutionCode(problemId)
//         .then((data) => {
//           console.log("✅ GET 응답:", data); // ✅ 응답 로그
//           setIsCreated(data.is_created);
//           if (data.is_created) {
//             setSolutionCode(data.solution_code);
//           }
//         })
//         .catch((error) => {
//           console.error("❌ GET 요청 실패:", error);
//         })
//         .finally(() => {
//           setIsLoading(false);
//           setTabDisabled(false); // ✅ 응답 완료 후 탭 활성화
//         });
//     } else {
//       console.warn("⚠ GET 요청 실패: problemId가 없음");
//     }
// }, [problemId, setTabDisabled]);


// const handleGenerateSolution = async () => {
//   if (!problemId || !problemInfo) {
//     console.error(`🚨 POST 요청 실패: problemId=${problemId}, problemInfo=${problemInfo}`);
//     setError("문제 정보를 찾을 수 없어요. 리뷰생성 버튼을 먼저 눌러주세요.");
//     return;
//   }

//   setIsLoading(true);
//   setTabDisabled(true); // ✅ 생성 중에는 탭 비활성화

//   const requestData = {
//     problem_id: problemId,
//     problem_info: problemInfo,
//     source_code: sourceCode,
//     reviews: reviews.map((review, index) => ({
//       review_id: index + 1, // ✅ review_id를 1부터 시작하는 숫자로 설정
//       title: review.title,
//       comments: review.comments,
//       start_line_number: 0,
//       end_line_number: 0,
//       is_passed: true,
//     })),
//   };

//   console.log(`📡 POST 요청: /api/v1/solution/${problemId}`, requestData);

//   try {
//     const response = await generateSolutionCode(problemId, requestData);
//     console.log("✅ POST 응답:", response);

//     setSolutionCode(response.solution_code);
//     setIsCreated(true);
//     setIsSolutionGenerated(true); // ✅ Success 아이콘 반영

//     // ✅ 모범답안 탭 버튼을 즉시 업데이트하기 위해 Feedback.tsx의 상태도 업데이트
//     setTimeout(() => {
//       setIsSolutionGenerated(true);
//     }, 100);
    
//   } catch (error) {
//     console.error(`❌ POST 요청 실패: problemId=${problemId}`, error);
//     setError("솔루션 생성 중 오류가 발생했습니다.");
//   } finally {
//     setIsLoading(false);
//     setTabDisabled(false); // ✅ 응답 완료 후 탭 활성화
//   }
// };

//   return (
//     <Card className="solution-container">
//       {isLoading ? (
//         <ProgressSpinner />
//       ) : error ? (
//         <p style={{ color: "red" }}>{error}</p>
//       ) : solutionCode ? (
//         <CodeMirror
//           value={solutionCode}
//           extensions={[javascript()]}
//           readOnly={true}
//           style={{
//             height: "350px",
//             fontSize: "14px",
//             border: "1px solid #ddd",
//             borderRadius: "5px",
//             backgroundColor: "#ffffff",
//             padding: "10px",
//             overflow: "scroll",
//           }}
//         />
//       ) : (
//         <Button label="모범답안 생성" icon="pi pi-cog" onClick={handleGenerateSolution} className="p-button-primary p-button-lg" />
//       )}
//     </Card>
//   );
// };

// export default SolutionCode;