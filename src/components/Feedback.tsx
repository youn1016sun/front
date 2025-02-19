import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import Chatbot from "./Chatbot";
import SolutionCode from "./SolutionCode";
import { motion } from "framer-motion";
import { Badge } from "primereact/badge";
import ReactMarkdown from "react-markdown";

interface Review {
  id: number;
  title: string;
  comments: string;
  start_line_number: number;
  end_line_number: number;
}

interface FeedbackProps {
  reviewResult: Review[];
  problemInfo: string | null;
  problemId: number | null;
  sourceCode: string | null;
  setHighlightedLines: React.Dispatch<React.SetStateAction<{ start: number; end: number; colorIndex: number }[]>>;
}

const Feedback: React.FC<FeedbackProps> = ({ reviewResult, problemInfo, problemId, sourceCode, setHighlightedLines }) => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isSolutionGenerated, setIsSolutionGenerated] = useState<boolean>(false);
  const [isTabDisabled, setIsTabDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log("🔄 Feedback component received new reviewResult:", reviewResult);
  }, [reviewResult]);

  // ✅ Title 클릭 시 하이라이트 적용/해제
  const handleAccordionToggle = (index: number, review?: Review) => {
    if (activeIndex === index) {
      setHighlightedLines([]);
      setActiveIndex(null);
    } else if (review) {
      setHighlightedLines([{ start: review.start_line_number, end: review.end_line_number, colorIndex: index % 3 }]);
      setActiveIndex(index);
    }
  };

  const toggleChatbot = (reviewId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveChat(activeChat === reviewId ? null : reviewId);
  };

  return (
    <div className="card">
      <TabView>
        <TabPanel header="리뷰 상세">
          <div className="card">
            <Accordion
              activeIndex={activeIndex ?? undefined}
              onTabChange={(e) => {
                const index = e.index as number;
                if (index !== undefined && reviewResult[index]) {
                  handleAccordionToggle(index, reviewResult[index]);
                }
              }}
            >
              {reviewResult.length > 0 ? (
                reviewResult.map((review, index) => (
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
                          problemInfo={problemInfo ?? ""}
                          sourceCode={sourceCode ?? ""}
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
            problemInfo={problemInfo ?? ""}
            sourceCode={sourceCode ?? ""}
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