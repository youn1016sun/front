import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import Chatbot from "./Chatbot"; // ✅ 챗봇 컴포넌트 추가

interface FeedbackProps {
  reviewResult: { review_id: number; title: string; comments: string }[];
}

const Feedback: React.FC<FeedbackProps> = ({ reviewResult }) => {
  const [activeChat, setActiveChat] = useState<number | null>(null); // ✅ 현재 활성화된 챗봇 인덱스

  // ✅ 특정 리뷰의 챗봇을 열고 닫는 함수
  const toggleChatbot = (reviewId: number) => {
    setActiveChat(activeChat === reviewId ? null : reviewId);
  };

  return (
    <div className="card">
      <TabView>
        <TabPanel header="리뷰 상세">
          <div className="card">
            <Accordion>
              {reviewResult.length > 0 ? (
                reviewResult.map((review) => (
                  <AccordionTab
                    key={review.review_id}
                    header={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {review.title}
                        <Button
                          icon="pi pi-comments"
                          className="p-button-rounded p-button-outlined"
                          onClick={() => toggleChatbot(review.review_id)}
                        />
                      </div>
                    }
                  >
                    <p dangerouslySetInnerHTML={{ __html: review.comments.replace(/\n/g, "<br />") }}></p>

                    {/* ✅ 챗봇이 활성화된 경우에만 렌더링 (왼쪽 상단) */}
                    {activeChat === review.review_id && <Chatbot onClose={() => setActiveChat(null)} />}
                  </AccordionTab>
                ))
              ) : (
                <p>리뷰 결과가 없습니다.</p>
              )}
            </Accordion>
          </div>
        </TabPanel>

        <TabPanel header="모범답안">
          <p className="m-0">solution</p>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Feedback;