import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import Chatbot from "./Chatbot";
import SolutionCode from "./SolutionCode";
import { motion } from "framer-motion";

interface FeedbackProps {
  reviewResult: { id: number; title: string; comments: string }[];
  historyId: number | null;
  sourceCode: string | null;
  problemInfo: string | null;
}

const Feedback: React.FC<FeedbackProps> = ({ reviewResult = [], historyId, sourceCode, problemInfo }) => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [reviews, setReviews] = useState(reviewResult);
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // ✅ 현재 열린 아코디언 탭 상태
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
                    <p dangerouslySetInnerHTML={{ __html: review.comments.replace(/\n/g, "<br />") }}></p>

                    <motion.div
                      initial={{ maxHeight: 0, opacity: 0 }}
                      animate={{ maxHeight: activeChat === review.id ? 400 : 0, opacity: activeChat === review.id ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      exit={{ maxHeight: 0, opacity: 0 }}  // 사라질 때 애니메이션 추가
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

        <TabPanel header="모범답안">
          <SolutionCode historyId={historyId} />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Feedback;
