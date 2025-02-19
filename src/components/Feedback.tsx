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
  reviewResult: { id: number; title: string; comments: string }[];
  historyId: number | null;
  sourceCode: string | null;
  problemInfo: string | null;
  problemId: number | null;
  setHighlightedLines: React.Dispatch<React.SetStateAction<{ start: number; end: number; colorIndex: number }[]>>;
}

const Feedback: React.FC<FeedbackProps> = ({ reviewResult = [], historyId, sourceCode, problemInfo, problemId }) => {
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

  // 모범답안 생성 완료 이펙트
  useEffect(() => {
    console.log("🔄 Solution Generation Status Updated:", isSolutionGenerated);
  }, [isSolutionGenerated]);


  const toggleChatbot = (reviewId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // ✅ 아코디언 탭 확장 방지
    setActiveChat(activeChat === reviewId ? null : reviewId);
  };

  return (
    <div className="card">
      <TabView>
        <TabPanel header="리뷰 상세">
          <div className="card">
            <Accordion
              activeIndex={activeIndex} // ✅ 아코디언 상태 반영
              onTabChange={(e) => setActiveIndex(e.index)} // ✅ 클릭한 탭의 인덱스를 추적
            >
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <AccordionTab
                    key={review.id}
                    header={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {review.title}
                        {/* ✅ 아코디언이 열렸을 때만 버튼 표시 */}
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
