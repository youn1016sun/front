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

interface ReviewPageProps {
  selectedHistoryId?: number | null;
}


const ReviewPage: React.FC<ReviewPageProps> = ({ selectedHistoryId = null }) => {
  const [code, setCode] = useState<string>("");
  const [reviewResult, setReviewResult] = useState<any[]>([]); // ✅ reviewResult를 배열로 초기화
  const [highlightedLines, setHighlightedLines] = useState<{ start: number; end: number; colorIndex: number }[]>([]);
  const [inputSource, setInputSource] = useState<string | null>(null);
  const [inputData, setInputData] = useState<string | null>(null);
  const [reviewButtonLabel, setReviewButtonLabel] = useState<string>("Run Review");
  const [problemId, setProblemId] = useState<number | null>(null);
  const [problemInfo, setProblemInfo] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<number | null>(null);

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
            setReviewResult([...data.reviews]); // ✅ 불변성을 유지하며 reviews 배열 설정
          } else {
            console.error("❌ API returned empty or invalid reviews:", data.reviews);
            setReviewResult([]); // ✅ 오류 방지를 위해 빈 배열 설정
          }

          setInputSource(data.input_source);
          setInputData(data.input_data);
          setCode(data.source_code);
        })
        .catch((error) => {
          console.error("❌ Error fetching history details:", error);
        });
    }
  }, [selectedHistoryId]);

  // 리뷰버튼 이름 바꾸기
  useEffect(() => {
    if (reviewResult[0]){
      setReviewButtonLabel("Review Again");
    } else {
      setReviewButtonLabel("Run Review");
    }
  }, [reviewResult]);

  const handleReview = async () => {
    if (!inputSource || !inputData || !code.trim()) {
      alert("필수 입력값을 입력하세요!");
      return;
    }

    const requestData = {
      history_id: historyId,
      input_source: inputSource,
      input_data: inputData,
      problem_id: problemId,
      problem_info: problemInfo,
      source_code: code,
      reviews: [],
      user_id: userId,
    };

    console.log("📡 Sending Review Request:", requestData);

    try {
      const response = await sendReviewRequest(requestData);
      console.log("✅ Review API Response:", response);
      // 히스토리아이디 저장
      setHistoryId(response.history_id);
      // 문제 정보 저장
      setProblemId(response.problem_id);
      setProblemInfo(response.problem_info);

      if (response.reviews && Array.isArray(response.reviews)) {
        console.log("🔄 Setting reviewResult with reviews array:", response.reviews);
        setReviewResult([...response.reviews]); // ✅ reviews 배열만 저장
      } else {
        console.error("❌ API returned invalid review data:", response.reviews);
        setReviewResult([]); // ✅ 오류 방지를 위해 빈 배열 설정
      }

      if (response.reviews) {
        const highlights = response.reviews.map((review: any, index: number) => ({
          start: review.start_line_number,
          end: review.end_line_number,
          colorIndex: index,
        }));
        setHighlightedLines(highlights);
      }
    } catch (error) {
      console.error("❌ Error sending review request:", error);
    }
  };

  // new 버튼, 입력값들 초기화시키기
  const newReview= ()=> {
    setCode("");
    setReviewResult([]);
    setHighlightedLines([]);
    setInputSource(null);
    setInputData(null);
    setProblemId(null);
    setProblemInfo(null);
    setHistoryId(null);
  }
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
          <CodeEditor code={code} setCode={setCode} highlights={highlightedLines} />
        </Card>

        <Card className="code-output">
          <Feedback reviewResult={reviewResult} historyId={selectedHistoryId} sourceCode={code}/>
        </Card>
      </div>

      <div className="review-button">
        <Button label={reviewButtonLabel} icon="pi pi-search" className="p-button-lg p-button-primary review-button" onClick={handleReview} />
      </div>
    </div>
  );
};

export default ReviewPage;