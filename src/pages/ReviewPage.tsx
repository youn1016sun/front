import React, { useState, useEffect } from "react";
import "../styles/review.css";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import UrlOrFileUploader from "../components/UrlOrFileUploader";
import CodeEditor from "../components/CodeEditor";
import Feedback from "../components/Feedback";
import { useLocation } from "react-router-dom";
import { fetchHistoryDetails } from "../api/HistoriesApi";
import { sendReviewRequest } from "../api/ReviewRequestApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog"; // ✅ 모달(팝업) 추가

interface ReviewPageProps {
  selectedProblemId?: number | null;
  selectedHistoryId?: number | null;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ selectedHistoryId = null }) => {
  const [sourceCode, setSourceCode] = useState<string>("");
  const [solutionCode, setSolutionCode] = useState<string | null>(null); // ✅ 모범답안 저장
  const [reviewResult, setReviewResult] = useState<any[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<{ start: number; end: number; is_passed: boolean }[]>([]);
  const [inputSource, setInputSource] = useState<string | null>(null);
  const [inputData, setInputData] = useState<string | null>(null);
  const [reviewButtonLabel, setReviewButtonLabel] = useState<string>("Run Review");
  const [problemId, setProblemId] = useState<number | null>(null);
  const [problemInfo, setProblemInfo] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ✅ "모두 완료되었습니다" 팝업 상태
  const [isReviewComplete, setIsReviewComplete] = useState<boolean>(false);

  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("user_id");

  useEffect(() => {
    if (selectedHistoryId) {
      console.log(`🔄 Fetching details for historyId: ${selectedHistoryId}`);
      fetchHistoryDetails(selectedHistoryId)
        .then((data) => {
          console.log("✅ Received history details:", data);
          setReviewResult(data.reviews || []);
          setHistoryId(selectedHistoryId);
          setProblemId(data.problem_id);
          setProblemInfo(data.problem_info);
          setInputSource(data.input_source);
          setInputData(data.input_data);
          setSourceCode(data.source_code);
        })
        .catch((error) => {
          console.error("❌ Error fetching history details:", error);
        });
    }
  }, [selectedHistoryId]);

  useEffect(() => {
    if (reviewResult.length > 0) {
      setReviewButtonLabel("Review Again");
    } else {
      setReviewButtonLabel("Run Review");
    }
  }, [reviewResult]);



  // ✅ 모든 리뷰가 `is_passed: true`이면 팝업 표시
  useEffect(() => {
    if (reviewResult.length > 0 && reviewResult.every((review) => review.is_passed)) {
      console.log("✅ 모든 리뷰 통과! 팝업 표시");
      setIsReviewComplete(true);
    }
  }, [reviewResult]);

  const handleReview = async () => {
    if (!sourceCode.trim()) {
      alert("코드를 입력해주세요");
      return;
    }

    setIsLoading(true);

    const requestData = {
      input_source: inputSource,
      input_data: inputData,
      problem_id: problemId,
      problem_info: problemInfo,
      source_code: sourceCode,
      reviews: reviewResult,
      user_id: userId,
    };

    console.log("📡 Sending Review Request:", requestData);

    try {
      const response = await sendReviewRequest(requestData);
      console.log("✅ Review API Response:", response);
      
      setHistoryId(response.history_id);
      setProblemId(response.problem_id);
      setProblemInfo(response.problem_info);
      setReviewResult(response.reviews || []);

      // ✅ 리뷰가 통과되었을 경우 자동으로 팝업 띄우기
      if (response.reviews.every((review: any) => review.is_passed)) {
        console.log("🎉 모든 리뷰 통과! 팝업 열기");
        setIsReviewComplete(true);
      }
    } catch (error) {
      console.error("❌ Error sending review request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const newReview = () => {
    setSourceCode("");
    setReviewResult([]);
    setHighlightedLines([]);
    setInputSource(null);
    setInputData(null);
    setProblemId(null);
    setProblemInfo(null);
    setHistoryId(null);
  };

  return (
    <div className="review-page">
      <div className="review-input1">
        <div className="url-input">
          <Button label="New Review" icon="pi pi-plus" onClick={newReview} />
          <UrlOrFileUploader setInputSource={setInputSource} setInputData={setInputData} inputData={inputData} />
        </div>
      </div>

      <div className="code-container" style={{ display: "flex" }}>
        <Card className="code-input" style={{ flex: 1, minWidth: "400px" }}>
          <h3>Enter Your Code</h3>
          <CodeEditor code={sourceCode} setCode={setSourceCode} highlights={highlightedLines} />
        </Card>

        <Card className="code-output">
          {isLoading ? (
            <div className="loading-overlay">
              <ProgressSpinner />
              <p>리뷰를 생성 중입니다...</p>
            </div>
          ) : (
            <Feedback 
              reviewResult={reviewResult} 
              problemInfo={problemInfo} 
              sourceCode={sourceCode}
              problemId={problemId} 
              setHighlightedLines={setHighlightedLines} 
            />
          )}
        </Card>
      </div>

      <div className="review-button">
        <Button 
          label={reviewButtonLabel} 
          icon="pi pi-search" 
          className="p-button-lg p-button-primary review-button" 
          onClick={handleReview} 
          disabled={isLoading} 
        />
      </div>

      {/* ✅ "모두 완료되었습니다" 팝업 */}
     
      <Dialog header="🎉 리뷰 완료! 축하드립니다! 🎉" visible={isReviewComplete} onHide={() => setIsReviewComplete(false)} style={{ width: "1000px", height: "700px", textAlign: "center", position: "relative" }}>
        <p>알고리뷰가 생성한 모범답안과 비교해보세요</p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <Card title="현재코드" style={{ width: "48%", padding: "1rem", boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" }}>
            <pre>{sourceCode}</pre>
          </Card>
          <Card title="AI모범답안" style={{ width: "48%", padding: "1rem", boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" }}>
          <pre>{solutionCode || "모범답안이 없습니다."}</pre>
          </Card>
        </div>
      </Dialog>
      </div>
  );
};

export default ReviewPage;


// import React, { useState, useEffect } from "react";
// import "../styles/review.css";
// import { Card } from "primereact/card";
// import { Button } from "primereact/button";
// import UrlOrFileUploader from "../components/UrlOrFileUploader";
// import CodeEditor from "../components/CodeEditor";
// import Feedback from "../components/Feedback";
// import { useLocation } from "react-router-dom";
// import { fetchHistoryDetails } from "../api/HistoriesApi";
// import { sendReviewRequest } from "../api/ReviewRequestApi";
// import { ProgressSpinner } from "primereact/progressspinner"; // ✅ 로딩 UI 추가

// interface ReviewPageProps {
//   selectedProblemId?: number | null;
//   selectedHistoryId?: number | null;
// }

// const ReviewPage: React.FC<ReviewPageProps> = ({ selectedHistoryId = null }) => {
//   const [sourceCode, setSourceCode] = useState<string>("");
//   const [reviewResult, setReviewResult] = useState<any[]>([]);
//   const [highlightedLines, setHighlightedLines] = useState<{ start: number; end: number; is_passed: boolean }[]>([]); // ✅ 하이라이트 상태 추가
//   const [inputSource, setInputSource] = useState<string | null>(null);
//   const [inputData, setInputData] = useState<string | null>(null);
//   const [reviewButtonLabel, setReviewButtonLabel] = useState<string>("Run Review");
//   const [problemId, setProblemId] = useState<number | null>(null);
//   const [problemInfo, setProblemInfo] = useState<string | null>(null);
//   const [historyId, setHistoryId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false); // ✅ 로딩 상태 추가

//   const location = useLocation();
//   const userId = location.state?.userId || localStorage.getItem("user_id");

//   useEffect(() => {
//     if (selectedHistoryId) {
//       console.log(`🔄 Fetching details for historyId: ${selectedHistoryId}`);
//       fetchHistoryDetails(selectedHistoryId)
//         .then((data) => {
//           console.log("✅ Received history details:", data);

//           if (data.reviews && Array.isArray(data.reviews)) {
//             console.log("🔄 Setting reviewResult with reviews array:", data.reviews);
//             setReviewResult([...data.reviews]);
//           } else {
//             console.error("❌ API returned empty or invalid reviews:", data.reviews);
//             setReviewResult([]);
//           }
//           setHistoryId(selectedHistoryId);
//           setProblemId(data.problem_id);
//           setProblemInfo(data.problem_info);
//           setInputSource(data.input_source);
//           setInputData(data.input_data);
//           setReviewResult(data.reviews);
//           setSourceCode(data.source_code);
//         })
//         .catch((error) => {
//           console.error("❌ Error fetching history details:", error);
//         });
//     }
//   }, [selectedHistoryId]);

//   useEffect(() => {
//     if (reviewResult.length > 0) {
//       setReviewButtonLabel("Review Again");
//     } else {
//       setReviewButtonLabel("Run Review");
//     }
//   }, [reviewResult]);

//   const handleReview = async () => {
//     if (!sourceCode.trim()) {
//       alert("코드를 입력해주세요");
//       return;
//     }

//     // ✅ 로딩 시작
//     setIsLoading(true);

//     const requestData = {
//       input_source: inputSource,
//       input_data: inputData,
//       problem_id: problemId,
//       problem_info: problemInfo,
//       source_code: sourceCode,
//       reviews: reviewResult,
//       user_id: userId,
//     };

//     console.log("📡 Sending Review Request:", requestData);

//     try {
//       const response = await sendReviewRequest(requestData);
//       console.log("✅ Review API Response:", response);
      
//       setHistoryId(response.history_id);
//       setProblemId(response.problem_id);
//       setProblemInfo(response.problem_info);

//       if (response.reviews && Array.isArray(response.reviews)) {
//         console.log("🔄 Setting reviewResult with reviews array:", response.reviews);
//         setReviewResult([...response.reviews]);
//       } else {
//         console.error("❌ API returned invalid review data:", response.reviews);
//         setReviewResult([]);
//       }
//     } catch (error) {
//       console.error("❌ Error sending review request:", error);
//     } finally {
//       setIsLoading(false); // ✅ 로딩 종료
//     }
//   };

//   const newReview = () => {
//     setSourceCode("");
//     setReviewResult([]);
//     setHighlightedLines([]); // ✅ 하이라이트 초기화
//     setInputSource(null);
//     setInputData(null);
//     setProblemId(null);
//     setProblemInfo(null);
//     setHistoryId(null);
//   };

//   return (
//     <div className="review-page">
//       <div className="review-input1">
//         <div className="url-input">
//           <Button label="New Review" icon="pi pi-plus" onClick={newReview} />
//           <p>로그인한 사용자 ID: {userId}</p>
//           <UrlOrFileUploader setInputSource={setInputSource} setInputData={setInputData} inputData={inputData} />
//         </div>
//       </div>

//       <div className="code-container" style={{ display: "flex" }}>
//         <Card className="code-input" style={{ flex: 1, minWidth: "400px" }}>
//           <h3>Enter Your Code</h3>
//           {/* ✅ 하이라이트 적용 */}
//           <CodeEditor code={sourceCode} setCode={setSourceCode} highlights={highlightedLines} />
//         </Card>

//         <Card className="code-output">
//           {isLoading ? (
//             <div className="loading-overlay">
//               <ProgressSpinner />
//               <p>리뷰를 생성 중입니다...</p>
//             </div>
//           ) : (
//             <Feedback 
//               reviewResult={reviewResult} 
//               problemInfo={problemInfo} 
//               sourceCode={sourceCode}
//               problemId={problemId} 
//               setHighlightedLines={setHighlightedLines} // ✅ 하이라이트 변경 함수 전달
//             />
//           )}
//         </Card>
//       </div>

//       <div className="review-button">
//         <Button 
//           label={reviewButtonLabel} 
//           icon="pi pi-search" 
//           className="p-button-lg p-button-primary review-button" 
//           onClick={handleReview} 
//           disabled={isLoading} // ✅ 로딩 중이면 버튼 비활성화
//         />
//       </div>
//     </div>
//   );
// };

// export default ReviewPage;