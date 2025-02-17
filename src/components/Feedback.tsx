import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import Chatbot from "./Chatbot";
import SolutionCode from "./SolutionCode";
import { motion } from "framer-motion";

interface FeedbackProps {
  reviewResult: { review_id: number; title: string; comments: string }[];
  historyId: number | null;
  sourceCode: string;
  // 아마 reviewResult에서 넘어오는 review_id =! reviewId 달라서 생기는 문제일 확률이 높음.
}

const Feedback: React.FC<FeedbackProps> = ({ reviewResult = [], historyId, sourceCode }) => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [reviews, setReviews] = useState(reviewResult);

  // review세부 리뷰를 가져오는 함수. 여러개의 리뷰를 배열형으로 하여 정렬
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

  // ✅ 챗봇 버튼 클릭 시 활성화/비활성화 (토글)
  const toggleChatbot = (reviewId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // ✅ 챗봇 버튼 클릭 시 AccordionTab이 열리지 않도록 방지
    setActiveChat(activeChat === reviewId ? null : reviewId);
  };

  return (
    <div className="card">
      <TabView>
        <TabPanel header="리뷰 상세">
          <div className="card">
            <Accordion>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <AccordionTab
                    key={review.review_id}
                    header={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {review.title}
                        {/* ✅ 버튼 색상 변경 + 이벤트 전파 방지 추가 */}
                        <Button
                          icon="pi pi-comments"
                          className={`p-button-rounded ${activeChat === review.review_id ? "p-button-primary" : "p-button-outlined"}`}
                          onClick={(event) => toggleChatbot(review.review_id, event)} // ✅ event 추가
                        />
                      </div>
                    }
                  >
                    <p dangerouslySetInnerHTML={{ __html: review.comments.replace(/\n/g, "<br />") }}></p>

                    {/* ✅ 애니메이션 추가하여 부드럽게 챗봇이 열리도록 */}
                    <motion.div
                      initial={{ maxHeight: 0, opacity: 0 }}
                      animate={{ maxHeight: activeChat === review.review_id ? 400 : 0, opacity: activeChat === review.review_id ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      {activeChat === review.review_id && (
                        <Chatbot
                          onClose={() => setActiveChat(null)}
                          problemInfo="" // ✅ 문제 정보 (추후 업데이트 가능)
                          sourceCode={sourceCode} // ✅ 챗봇에 코드 전달
                          reviewTitle={review.title} // ✅ 해당 리뷰 제목 전달
                          reviewComments={review.comments} // ✅ 해당 리뷰 내용 전달
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