import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import Chatbot from "./Chatbot";
import { fetchSolutionCode } from "../api/SolutionApi";
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
  problemInfo: string | null;
  problemId: number | null;
  sourceCode: string | null;
  revision: number;
  setHighlightedLines: React.Dispatch<
    React.SetStateAction<{ start: number; end: number; is_passed: boolean }[]>
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
  const [solutionCode, setSolutionCode] = useState<string | null>(null);
  const [solutionHighLightedLines, setSolutionHighLightedLines] = useState<{ start: number; end: number;}[]>([]);

  useEffect(() => {
    console.log("🔄 Feedback component received new reviewResult:", reviewResult);
  }, [reviewResult]);

  // GET 요청: 모범답안이 이미 존재하는지 확인
  useEffect(() => {
    if (problemId) {
      console.log(`📡 GET 요청 시작: /api/v1/solution/${problemId}`);
      setIsTabDisabled(true);

      fetchSolutionCode(problemId)
        .then((data) => {
          console.log("GET 응답:", data);
          if (data.is_created) {
            setIsSolutionGenerated(true); // 모범답안이 존재하면 즉시 뱃지 업데이트
            setSolutionCode(data.solution_code);
            setSolutionHighLightedLines(
              data.lines.map((line: { start_line_number: number; end_line_number: number }) => ({
                start: line.start_line_number,
                end: line.end_line_number,
              }))
            );
            console.log(JSON.stringify(solutionHighLightedLines));
          } else {
            setIsSolutionGenerated(false);
            setSolutionCode(null);
          }
        })
        .catch((error) => {
          console.error("❌ GET 요청 실패:", error);
        })
        .finally(() => {
          setIsTabDisabled(false);
        });
    } else {
      console.warn("⚠ GET 요청 실패: problemId가 없음");
    }
  }, [problemId]);//setTabDisabled, setIsSolutionGenerated]);

  // Title 클릭 시 하이라이트 적용/해제 (닫기 기능 수정)
  const handleAccordionToggle = (index: number) => {
    if (index === null || index === undefined || !reviewResult[index]) {
      console.error("❌ 유효하지 않은 index 접근", index);
      return; // 유효하지 않은 index는 실행하지 않음
    }

    console.log(`🔄 handleAccordionToggle 실행됨 | 현재 activeIndex: ${activeIndex}, 클릭된 index: ${index}`);

    if (activeIndex === index) {
      console.log("✅ 기존 선택된 항목을 다시 클릭 → 닫기 & 하이라이트 제거");
      setHighlightedLines([]);
      setActiveIndex(null);
    } else {
      console.log(`✅ 새로운 항목 클릭 → 하이라이트 적용 (start: ${reviewResult[index].start_line_number}, end: ${reviewResult[index].end_line_number})`);
      setHighlightedLines([{ start: reviewResult[index].start_line_number, end: reviewResult[index].end_line_number, is_passed: reviewResult[index].is_passed}]);
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
        <TabPanel header="리뷰 상세" className="tab-name">
        
          <div className="card">
            <Accordion
              activeIndex={activeIndex ?? undefined} // Primereact의 undefined 처리 방식
              onTabChange={(e) => {
                const index = e.index as number;

                // index가 null 또는 undefined일 때 처리
                if (index === null || index === undefined) {
                  console.warn("⚠️ onTabChange 이벤트에서 null 또는 undefined index 반환됨", index);
                  setActiveIndex(null);
                  setHighlightedLines([]); // 닫을 때 하이라이트 제거
                  return;
                }

                // reviewResult 범위를 벗어나는 index인지 체크
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
                    style={{ borderRadius: "0.7vh", backgroundColor: review.is_passed ? "#E8F5E9" : "#FFEBEE"}} // True(연두) / False(빨강)
                    header={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px", 
                          borderRadius: "8px", 
                          fontWeight: "bold",
                          width: "100%",
                        }}
                      >
                        {review.title}
                        {/* 챗봇 버튼을 다시 추가하여 사라지는 문제 해결 */}
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

        {/* 모범답안 탭 - 생성 버튼 유지 개선 */}
        <TabPanel
          header={<span>모범답안 {isSolutionGenerated && <Badge value="✔" severity="success" className="check-badge"/>}</span>}
          disabled={isTabDisabled}
          className="tab-name"
        >
          <SolutionCode
            problemId={problemId ?? null}
            problemInfo={problemInfo ?? ""}
            sourceCode={sourceCode ?? ""}
            reviews={reviewResult}
            isSolutionGenerated={isSolutionGenerated}
            setIsSolutionGenerated={setIsSolutionGenerated}
            solutionCode={solutionCode}
            setSolutionCode={setSolutionCode}
            solutionHighLightedLines={solutionHighLightedLines}
            setSolutionHighLightedLines={setSolutionHighLightedLines}
            setTabDisabled={setIsTabDisabled}
          />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Feedback;