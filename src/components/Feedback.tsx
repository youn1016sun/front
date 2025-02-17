import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import Chatbot from "./Chatbot";
import SolutionCode from "./SolutionCode";

interface FeedbackProps {
  reviewResult: { review_id: number; title: string; comments: string }[];
  historyId: number | null;
}

const Feedback: React.FC<FeedbackProps> = ({ reviewResult = [], historyId }) => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [reviews, setReviews] = useState(reviewResult);

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

  const toggleChatbot = (reviewId: number) => {
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
                        <Button
                          icon="pi pi-comments"
                          className="p-button-rounded p-button-outlined"
                          onClick={() => toggleChatbot(review.review_id)}
                        />
                      </div>
                    }
                  >
                    <p dangerouslySetInnerHTML={{ __html: review.comments.replace(/\n/g, "<br />") }}></p>

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
          <SolutionCode historyId={historyId} />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Feedback;