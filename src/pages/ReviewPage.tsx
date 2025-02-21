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
import CompleteReviewDialog from "../components/CompleteDialog";

interface ReviewPageProps {
  selectedProblemId?: number | null;
  selectedHistoryId?: number | null;
  histories: any;
  setHistories: any;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ selectedHistoryId = null, histories, setHistories }) => {
  const [sourceCode, setSourceCode] = useState<string>("");
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
      console.log(`histories= ${histories}`);
      if (requestData.problem_id) {
        for (let i = 0; i < histories.length; i++) {
          if (histories[i].problem_id === requestData.problem_id) {
            const [row] = histories.splice(i, 1); // ✅ 배열에서 객체 하나 추출
      
            row.history_ids.unshift(problemId);
            row.history_names.unshift("newData");
      
            histories.unshift(row); // ✅ 배열 맨 앞에 추가
            break;
          }
        }
      } else {
        const row = {
          problem_id: problemId,
          problem_name: "newProblemName", // ✅ 필드명 수정
          history_ids: [historyId], // ✅ 필드명 통일
          history_names: ["newHistoryName"],
        };
        histories.unshift(row);
      }
      setHistories([...histories]);

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
      <CompleteReviewDialog 
        visible={isReviewComplete} 
        onHide={() => setIsReviewComplete(false)} 
        sourceCode={sourceCode} 
        problemId={problemId}
        highlightedLines={reviewResult.map((review) => ({
          start: review.start_line_number,
          end: review.end_line_number
        }))}
      />
      </div>
  );
};

export default ReviewPage;