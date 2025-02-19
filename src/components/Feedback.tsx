import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import Chatbot from "./Chatbot";
import SolutionCode from "./SolutionCode";
import { motion } from "framer-motion";
import { Badge } from "primereact/badge";
import ReactMarkdown from "react-markdown";

interface FeedbackProps {
  reviewResult: { id: number; title: string; comments: string; start_line_number: number; end_line_number: number }[];
  historyId: number | null;
  sourceCode: string | null;
  problemInfo: string | null;
  problemId: number | null;
  setHighlightedLines: React.Dispatch<React.SetStateAction<{ start: number; end: number; colorIndex: number }[]>>;
}

const Feedback: React.FC<FeedbackProps> = ({ reviewResult = [], historyId, sourceCode, problemInfo, problemId, setHighlightedLines }) => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [reviews, setReviews] = useState(reviewResult);
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // ✅ 현재 열린 아코디언 탭 상태
  const [isSolutionGenerated, setIsSolutionGenerated] = useState<boolean>(false);
  const [isTabDisabled, setIsTabDisabled] = useState<boolean>(false); // ✅ 모범답안 탭 비활성화 여부 
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔄 Feedback component received new reviewResult:", reviewResult);
    if (Array.isArray(reviewResult)) {
      console.log("✅ Updating state with reviewResult:", reviewResult);
      setReviews([...reviewResult]);
    } else {
      console.error("❌ reviewResult is empty or not an array:", reviewResult);
      setReviews([]);
    }
  }, [reviewResult]);

  // ✅ Title 클릭 시 하이라이트 적용/해제
  const handleAccordionToggle = (index: number, review: any) => {
    if (activeIndex === index) {
      // ✅ 현재 선택된 항목을 다시 클릭하면 하이라이트 해제
      setHighlightedLines([]);
      setActiveIndex(null);
    } else {
      // ✅ 새로운 항목을 클릭하면 해당 코드만 하이라이트 적용
      setHighlightedLines([{ start: review.start_line_number, end: review.end_line_number, colorIndex: index % 3 }]);
      setActiveIndex(index);
    }
  };

  // 모범답안 생성 완료 이펙트
  useEffect(() => {
    console.log("🔄 Solution Generation Status Updated:", isSolutionGenerated);
  }, [isSolutionGenerated]);

  const toggleChatbot = (reviewId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveChat(activeChat === reviewId ? null : reviewId);
  };

  return (
    <div className="card">
      <TabView>
        <TabPanel header="리뷰 상세">
          <div className="card">
            <Accordion activeIndex={activeIndex} onTabChange={(e) => handleAccordionToggle(e.index, reviewResult[e.index])}>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <AccordionTab
                    key={review.id}
                    header={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {review.title}
                        {activeIndex === index && (
                          <Button
                            icon="pi pi-comments"
                            className={`p-button-rounded ${activeChat === review.id ? "p-button-primary" : "p-button-outlined"}`}
                            onClick={(event) => toggleChatbot(review.id, event)}
                          />
                        )}
                      </div>
                    }
                  >
                    <ReactMarkdown>{review.comments}</ReactMarkdown>
                    <motion.div
                      initial={{ maxHeight: 0, opacity: 0 }}
                      animate={{ maxHeight: activeChat === review.id ? 400 : 0, opacity: activeChat === review.id ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      {activeChat === review.id && (
                        <Chatbot
                          onClose={() => setActiveChat(null)}
                          problemInfo={problemInfo}
                          sourceCode={sourceCode}
                          reviewTitle={review.title}
                          reviewComments={review.comments}
                        />
                      )}
                    </motion.div>
                  </AccordionTab>
                ))
              ) : (
                <p>리뷰 결과가 없습니다.</p>
              )}
            </Accordion>
          </div>
        </TabPanel>

        {/* ✅ 모범답안 탭 - 생성 버튼 유지 개선 */}
        <TabPanel
          header={<span>모범답안 {isSolutionGenerated && <Badge value="✔" severity="success" />}</span>}
          disabled={isTabDisabled} 
        >
          <SolutionCode
            problemId={problemId}
            problemInfo={problemInfo}
            sourceCode={sourceCode}
            reviews={reviewResult}
            isSolutionGenerated={isSolutionGenerated}
            setIsSolutionGenerated={setIsSolutionGenerated}
            setTabDisabled={setIsTabDisabled} // ✅ 이 부분 추가
          />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Feedback;