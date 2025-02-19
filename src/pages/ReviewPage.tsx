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
import { ProgressSpinner } from "primereact/progressspinner"; // ✅ 로딩 UI 추가

interface ReviewPageProps {
  selectedHistoryId?: number | null;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ selectedHistoryId = null }) => {
  const [sourceCode, setSourceCode] = useState<string>("");
  const [reviewResult, setReviewResult] = useState<any[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<{ start: number; end: number; colorIndex: number }[]>([]); // ✅ 하이라이트 상태 추가
  const [inputSource, setInputSource] = useState<string | null>(null);
  const [inputData, setInputData] = useState<string | null>(null);
  const [reviewButtonLabel, setReviewButtonLabel] = useState<string>("Run Review");
  const [problemId, setProblemId] = useState<number | null>(null);
  const [problemInfo, setProblemInfo] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // ✅ 로딩 상태 추가

  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("user_id");

  useEffect(() => {
    if (selectedHistoryId) {
      console.log(`🔄 Fetching details for historyId: ${selectedHistoryId}`);
      fetchHistoryDetails(selectedHistoryId)
        .then((data) => {
          console.log("✅ Received history details:", data);

          if (data.reviews && Array.isArray(data.reviews)) {
            console.log("🔄 Setting reviewResult with reviews array:", data.reviews);
            setReviewResult([...data.reviews]);
          } else {
            console.error("❌ API returned empty or invalid reviews:", data.reviews);
            setReviewResult([]);
          }

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

  const handleReview = async () => {
    if (!inputSource || !inputData || !sourceCode.trim()) {
      alert("필수 입력값을 입력하세요!");
      return;
    }

    // ✅ 로딩 시작
    setIsLoading(true);

    const requestData = {
      history_id: historyId,
      input_source: inputSource,
      input_data: inputData,
      problem_id: problemId,
      problem_info: problemInfo,
      source_code: sourceCode,
      reviews: [],
      user_id: userId,
    };

    console.log("📡 Sending Review Request:", requestData);

    try {
      const response = await sendReviewRequest(requestData);
      console.log("✅ Review API Response:", response);
      
      setHistoryId(response.history_id);
      setProblemId(response.problem_id);
      setProblemInfo(response.problem_info);

      if (response.reviews && Array.isArray(response.reviews)) {
        console.log("🔄 Setting reviewResult with reviews array:", response.reviews);
        setReviewResult([...response.reviews]);
      } else {
        console.error("❌ API returned invalid review data:", response.reviews);
        setReviewResult([]);
      }
    } catch (error) {
      console.error("❌ Error sending review request:", error);
    } finally {
      setIsLoading(false); // ✅ 로딩 종료
    }
  };

  const newReview = () => {
    setSourceCode("");
    setReviewResult([]);
    setHighlightedLines([]); // ✅ 하이라이트 초기화
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
          <p>로그인한 사용자 ID: {userId}</p>
          <UrlOrFileUploader setInputSource={setInputSource} setInputData={setInputData} inputData={inputData} />
        </div>
      </div>

      <div className="code-container" style={{ display: "flex" }}>
        <Card className="code-input" style={{ flex: 1, minWidth: "400px" }}>
          <h3>Enter Your Code</h3>
          {/* ✅ 하이라이트 적용 */}
          <CodeEditor code={sourceCode} setCode={setSourceCode} highlights={highlightedLines} />
        </Card>

        <Card className="code-output">
          {/* ✅ 로딩 중이면 스피너 표시 (정가운데 정렬) */}
          {isLoading ? (
            <div className="loading-overlay">
              <ProgressSpinner />
              <p>리뷰를 생성 중입니다...</p>
            </div>
          ) : (
            <Feedback 
              reviewResult={reviewResult} 
              historyId={selectedHistoryId} 
              problemInfo={problemInfo} 
              sourceCode={sourceCode} 
              setHighlightedLines={setHighlightedLines} // ✅ 하이라이트 변경 함수 전달
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
          disabled={isLoading} // ✅ 로딩 중이면 버튼 비활성화
        />
      </div>
    </div>
  );
};

export default ReviewPage;