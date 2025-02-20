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
  is_passed : boolean;
}

interface FeedbackProps {
  reviewResult: Review[];
  historyId: number | null;
  problemInfo: string | null;
  problemId: number | null;
  sourceCode: string | null;
  setHighlightedLines: React.Dispatch<
    React.SetStateAction<{ start: number; end: number; colorIndex: number }[]>
  >;
}

const Feedback: React.FC<FeedbackProps> = ({
  reviewResult,
  problemInfo,
  problemId,
  sourceCode,
  setHighlightedLines,
}) => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isSolutionGenerated, setIsSolutionGenerated] = useState<boolean>(false);
  const [isTabDisabled, setIsTabDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log("🔄 Feedback component received new reviewResult:", reviewResult);
    setIsSolutionGenerated(false);
  }, [reviewResult]);

  // ✅ Title 클릭 시 하이라이트 적용/해제 (닫기 기능 수정)
  const handleAccordionToggle = (index: number) => {
    if (index === null || index === undefined || !reviewResult[index]) {
      console.error("❌ 유효하지 않은 index 접근", index);
      return; // ❗ 유효하지 않은 index는 실행하지 않음
    }

    console.log(`🔄 handleAccordionToggle 실행됨 | 현재 activeIndex: ${activeIndex}, 클릭된 index: ${index}`);

    if (activeIndex === index) {
      console.log("✅ 기존 선택된 항목을 다시 클릭 → 닫기 & 하이라이트 제거");
      setHighlightedLines([]);
      setActiveIndex(null);
    } else {
      console.log(`✅ 새로운 항목 클릭 → 하이라이트 적용 (start: ${reviewResult[index].start_line_number}, end: ${reviewResult[index].end_line_number})`);
      setHighlightedLines([{ start: reviewResult[index].start_line_number, end: reviewResult[index].end_line_number, colorIndex: index % 3 }]);
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
              activeIndex={activeIndex ?? undefined} // ✅ Primereact의 undefined 처리 방식 활용
              onTabChange={(e) => {
                const index = e.index as number;

                // ❗ index가 null 또는 undefined일 때 처리
                if (index === null || index === undefined) {
                  console.warn("⚠️ onTabChange 이벤트에서 null 또는 undefined index 반환됨", index);
                  setActiveIndex(null);
                  setHighlightedLines([]); // ✅ 닫을 때 하이라이트 제거
                  return;
                }

                // ❗ reviewResult 범위를 벗어나는 index인지 체크
                if (!reviewResult[index]) {
                  console.error("❌ 유효하지 않은 index 접근", index);
                  return;
                }

                console.log("🔄 onTabChange 이벤트 발생 | index:", index);
                handleAccordionToggle(index);
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
            problemId={problemId ?? null}
            problemInfo={problemInfo ?? ""}
            sourceCode={sourceCode ?? ""}
            reviews={reviewResult}
            isSolutionGenerated={isSolutionGenerated}
            setIsSolutionGenerated={setIsSolutionGenerated}
            setTabDisabled={setIsTabDisabled}
          />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Feedback;