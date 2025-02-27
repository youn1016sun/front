import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import "../styles/tutorial.css";
import LoadingLogo from "../components/LoadingLogo";
import { useNavigate } from "react-router-dom";  // React Router용

const TutorialPage: React.FC = () => {
const [activeIndex, setActiveIndex] = useState<number | null>(null);
const [isTutorialStart, setIsTutorialStart] = useState(false);
const [tutorialStep, setTutorialStep] = useState<number>(0);
const [showOverlay, setShowOverlay] = useState<boolean>(false);
const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
const navigate = useNavigate();  // React Router 사용 시
// 새로운 코드 입력 상태 추가
const [optimizedCodeTyped, setOptimizedCodeTyped] = useState(false);
const [codeOptimizedInput, setCodeOptimizedInput] = useState("");
// URL 자동 입력 상태 (한 번만 입력되도록)
const [urlInput, setUrlInput] = useState<string>("");
const [isUrlTyped, setIsUrlTyped] = useState(false);
const urlExample = "https://algoreview/problem1";
// 코드 자동 입력 상태 (한 번만 입력되도록)
const [codeInput, setCodeInput] = useState<string>("");
const [isCodeTyped, setIsCodeTyped] = useState(false);
const exampleCode = `import sys
def solution(nums: list, length: int, target: int) -> int:
    answer = 0
    for i in range(length):   
        for j in range(i + 1, length):
            if (nums[i] + nums[j]) == target:
                answer += 1
    
return answer
input_data = sys.stdin.read().strip().split('\n')
length = int(input_data[0])
nums = list(map(int, input_data[1].split()))
target = int(input_data[2])

print(solution(nums, length, target))`;

const optimizedCode = `import sys

def solution(nums: list, length: int, target: int) 
-> int:
    seen = set()
    answer = 0

    for num in nums:
        if (target - num) in seen:
            answer += 1
        seen.add(num)

    return answer

input_data=sys.stdin.read().strip().split('\\n')
length=int(input_data[0])
nums=list(map(int, input_data[1].split()))
target=int(input_data[2])
print(solution(nums, length, target))`;

// 리뷰 버튼 클릭 시 로딩 상태 추가
const [isLoading, setIsLoading] = useState<boolean>(false);
const [showReviewDetails, setShowReviewDetails] = useState<boolean>(false);
const [reviewButtonLabel, setReviewButtonLabel] = useState<string>("리뷰받기");

    // Url 자동 입력 함수
    useEffect(() => {
      if (tutorialStep === 0 && !isUrlTyped && isTutorialStart) {
        let i = 0;
        const typeEffect = setInterval(() => {
          if (i < urlExample.length) {
            setUrlInput((prev) => prev + urlExample[i]);
            i++;
          } else {
            clearInterval(typeEffect);
            setIsUrlTyped(true); // 한 번 입력 후 다시 실행되지 않도록 설정
          }
        }, 50);
        return () => clearInterval(typeEffect);
      }
    }, [tutorialStep, isTutorialStart, isUrlTyped]); // 한 번만 실행되도록 의존성 추가

    useEffect(() => {
        // 튜토리얼이 "코드 입력 안내" 단계(1)일 때만 실행
        if (tutorialStep === 1 && !isCodeTyped && isTutorialStart) {
          let i = 0;
          setCodeInput(""); // ✅ 초기화 후 입력 시작
          const typeEffect = setInterval(() => {
            if (i < exampleCode.length) {
              setCodeInput((prev) => prev + exampleCode[i]);
              i++;
            } else {
              clearInterval(typeEffect);
              setIsCodeTyped(true); // 한 번 실행 후 다시 실행되지 않도록 설정
            }
          }, 5);
          return () => clearInterval(typeEffect);
        }
      }, [tutorialStep, isTutorialStart, isCodeTyped]);


      // 재리뷰 코드 변경 스텝 실행 (튜토리얼 특정 스텝)
useEffect(() => {
    if (tutorialStep === 7 && !optimizedCodeTyped && isTutorialStart) {
      let i = 0;
      setCodeInput(""); // 기존 코드 삭제
      setCodeOptimizedInput(""); // 새로운 코드 초기화
      const typeEffect = setInterval(() => {
        if (i < optimizedCode.length) {
          setCodeOptimizedInput((prev) => prev + optimizedCode[i]);
          i++;
        } else {
          clearInterval(typeEffect);
          setOptimizedCodeTyped(true);
        }
      }, 3);
      return () => clearInterval(typeEffect);
    }
  }, [tutorialStep, isTutorialStart, optimizedCodeTyped]);
    

  // 튜토리얼 단계별 설정
  const tutorialSteps = [
    {
      message: "문제의 출처 URL이나 사진을 넣어주세요. 알고리뷰가 가상 주소를 넣어둘게요.",
      target: ".tutorial-input-box",
    },
    {
      message: "이제 자신의 코드를 입력해주세요. 두수의 합을 구하는 코드를 넣어볼까요?",
      target: ".tutorial-code-input",
    },
    {
      message: "이제 리뷰를 받아볼까요? 버튼을 눌러주세요!",
      target: ".tutorial-button",
    },
    {
      message: "이제 리뷰 결과를 확인할 수 있어요!",
      target: ".tutorial-review-output",
    },
    {
        message: "클릭하여 리뷰의 세부사항을 확인해보세요.",
        target: ".tutorial-accordion1.p-accordion-header",
      },
    // {
    //     message: "이곳에서 알고리뷰 챗봇과 대화도 할 수 있어요.",
    //     target: ".tutorial-review-output",
    // },
    {
        message: "모범답안을 누르면 해당 리뷰에 대한 알고리뷰의 정답코드를 볼 수 있어요.",
        target: ".tutorial-review-output",
      },
    // {
    //     message: "피드백을 바탕으로 코드를 바꿔볼까요? 알고리뷰가 수정해줄게요.",
    //     target: ".tutorial-code-input",
    // },
    // {
    //     message: "수정을 했으니 재리뷰를 받아볼까요? 버튼을 눌러주세요.",
    //     target: ".tutorial-button",
    // },
    // {
    //     message: "재리뷰가 완료되었어요! 피드백 사항이 잘 반영되면 색상이 초록색으로 바뀌어요.",
    //     target: ".tutorial-review-output",
    // },
    // {
    //     message: "모든 리뷰는 히스토리에서 다시 확인하실 수 있어요!",
    //     target: ".tutorial-history-accordion",
    // },
    // {
    //     message: "튜토리얼을 모두 완료하셨어요. 아무곳이나 한번 클릭하면 로그인페이지로 이동해져요.",
    //     target: ".tutorialtuto",
    //   },
  ];

  // 튜토리얼 시작 함수
  const startTutorial = () => {
    setIsTutorialStart(true);
    setShowOverlay(true);
    updateTooltipPosition(0);
  };

  // ✅ 특정 UI 요소 위치 가져와서 말풍선 배치 & 하이라이트 적용
  const updateTooltipPosition = (stepIndex: number) => {
    // ✅ 기존 하이라이트 제거
    document.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));

    const targetElement = document.querySelector(tutorialSteps[stepIndex].target as string) as HTMLElement;
    
    if (targetElement) {
      // ✅ 요소에 하이라이트 효과 적용
      targetElement.classList.add("highlight");

      // ✅ 말풍선 위치 조정
      const rect = targetElement.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + window.scrollY - 60,  // 요소 위에 띄우기
        left: rect.left + rect.width / 2 - 100, // 가운데 정렬
      });
    } else {
      setTooltipPosition({ top: window.innerHeight / 2 - 50, left: window.innerWidth / 2 - 150 });
    }
  };


  const handleReview = () => {
    setIsLoading(true); // ✅ 로딩 시작
    setShowOverlay(false); // ✅ 튜토리얼 오버레이 일시 중단
  
    setTimeout(() => {
      setIsLoading(false); // ✅ 3초 후 로딩 종료
      setShowReviewDetails(true); // ✅ 리뷰 상세 내용 표시
      setReviewButtonLabel("재리뷰받기");

  
      // ✅ 로딩이 끝난 후 다음 가이드 자동 진행
      setTutorialStep((prevStep) => {
        const nextStep = prevStep + 1;
        updateTooltipPosition(nextStep);
        setShowOverlay(true);
        return nextStep;
      });
    }, 2000);
  };


  // ✅ 튜토리얼 단계 변경 시 하이라이트 적용
  useEffect(() => {
    if (showOverlay) {
      updateTooltipPosition(tutorialStep);
    }
  }, [tutorialStep, showOverlay]);


  // 다음 가이드 스탭으로 이동. 모든 스탭이 마무리되면 리다이렉션.
  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep((prev) => prev + 1);
    } else {
      setShowOverlay(false);
      document.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight")); // 마지막 단계에서 하이라이트 제거
  
      // ✅ **튜토리얼이 끝났을 때만 2초 후 /login으로 리다이렉트**
      setTimeout(() => {
        if (tutorialStep === tutorialSteps.length - 1) {
          navigate("/login"); // ✅ React Router 사용 시
        }
      }, 1000);
    }
  };

  return (
    <div className="tutorial-page">
      {/* ✅ 튜토리얼 시작 화면 */}
      {!isTutorialStart && (
        <div className="tutorial-overlay">
          <div className="tutorial-message-box">
            <h2>알고리뷰 튜토리얼에 오신 것을 환영합니다!</h2>
            <p>사용법에 대해 알아볼까요?</p>
            <Button label="시작하기" onClick={startTutorial} className="p-button-lg p-button-primary"/>
          </div>
        </div>
      )}

      {/* ✅ Header Navigation */}
      <header className="tutorial-custom-header">
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Login</a></li>
            <li><a href="#" className="active">Tutorial</a></li>
            <li><a href="#">Review</a></li>
          </ul>
        </nav>
      </header>

      <div className="tutorial-container">
        {/* ✅ 히스토리 섹션 */}
        <aside className="tutorial-history-sidebar">
          <h3>히스토리</h3>
          <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(Array.isArray(e.index) ? e.index[0] : e.index)}>
            <AccordionTab header="테스트 문제" className="tutorial-history-accordion">
              <p>테스트 문제에 대한 설명이 들어갑니다.</p>
            </AccordionTab>
          </Accordion>
        </aside>

        {/* ✅ 메인 콘텐츠 */}
        <div className="tutorial-content">
          {/* ✅ 버튼 박스 */}
          <div className="tutorial-input-box">
            <Button label="새로운 문제 생성" icon="pi pi-plus" className="tutorial-btn" />
            <Button label="URL 입력" icon="pi pi-link" className="tutorial-btn" />
            <Button label="이미지 선택" icon="pi pi-image" className="tutorial-btn" />
            <input 
              type="text" 
              className="tutorial-url-input" 
              value={urlInput} 
              readOnly 
              placeholder="문제 URL 입력" 
            />
          </div>

          {/* ✅ 코드 입력 & 리뷰 결과 */}
          <div className="tutorial-review-container">
            {/* ✅ 코드 입력 */}
            <Card className="tutorial-code-input">
              <TabView>
                <TabPanel header="코드 입력">
                  <div className="code-editor">
                  <CodeMirror
                    value={tutorialStep >= 7 ? codeOptimizedInput : codeInput}
                    extensions={[javascript()]} // ✅ 하이라이트 적용
                    theme="light"
                    readOnly
                    style={{ height: "300px", fontSize: "14px", borderRadius: "5px" }}
                    />
                  </div>
                </TabPanel>
              </TabView>
            </Card>

            {/* ✅ 리뷰 결과 */}
            <Card className="tutorial-review-output">
              <TabView>
              <TabPanel header="리뷰 상세">
                  {isLoading ? (
                    <div className="loading-overlay flex flex-col items-center">
                      <LoadingLogo />
                      <p>리뷰 사항 생성 중...</p>
                    </div>
                  ) : (
                    showReviewDetails && (
                      <Accordion>
                        <AccordionTab header="O(N^2) 복잡도의 비효율적인 이중 반복문 사용" className="tutorial-accordion1" >
                          <pre className="review-comment">{
`🔍 현재 코드의 문제점
- 현재 코드는 모든 가능한 (i, j) 쌍을 이중 반복문으로 
확인하며, 이는 O(N^2) 시간 복잡도를 가집니다.
🚀 해결 방법
- 각 숫자에 대해 필요한 값(target - current_number)이 
앞서 나온 적이 있는지 해시 테이블(딕셔너리)을 
활용해 확인합니다.
- 해시 테이블을 사용하면 각 숫자에 대해 상수시간 복잡도로 
필요한 값을 찾을 수 있습니다.`}</pre>
                        </AccordionTab>
                      </Accordion>
                    )
                  )}
                </TabPanel>
                <TabPanel header="모범답안">
                  <pre className="solution-code">
                    {
`def solution(nums: list, length: int, target: int) -> int:
    answer = 0
    seen = set()
    for num in nums:
        complement = target - num
        if complement in seen:
            answer += 1
        seen.add(num)
    return answer
input_data = sys.stdin.read().strip().split('\n')
nums = list(map(int, input_data[1].split()))

print(solution(nums, length, target))`
                    }
                  </pre>
                </TabPanel>
              </TabView>
            </Card>
          </div>

          {/* ✅ 버튼 */}
          <div className="tutorial-button">
          <Button label={reviewButtonLabel} icon="pi pi-search" className="p-button-lg p-button-primary tutorial-review-button" onClick={handleReview}/>
          </div>
        </div>
      </div>

      {/* ✅ 튜토리얼 오버레이 (버튼 하이라이트 & 말풍선) */}
      {isTutorialStart && showOverlay && (
        <div className="tutorial-highlight-overlay" onClick={nextTutorialStep}>
          <div className="tutorial-tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
            {tutorialSteps[tutorialStep].message}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialPage;