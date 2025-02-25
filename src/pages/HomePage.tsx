import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import "../styles/homepage.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { motion } from "framer-motion";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

// 이미지 import
import mainImg from "../assets/images/main_page.png";

// 6개의 섹션 정의
const sections = [
  { id: "hero", title: "더 나은 코드, 더 나은 개발", description: "AI 리뷰를 통해 코드 품질을 향상시키세요.", button: true },
  { id: "how-to-use1", title: "1. 프로젝트 회원가입", description: "간단한 가입 후 프로젝트를 시작하세요.", img: mainImg },
  { id: "how-to-use2", title: "2. 코드 입력", description: "리뷰하고 싶은 코드를 입력하세요.", img: "code-input.png" },
  { id: "how-to-use3", title: "3. 리뷰 실행", description: "AI가 코드를 분석하여 리뷰를 제공합니다.", img: "review-process.png" },
  { id: "how-to-use4", title: "4. 리뷰 피드백 확인", description: "리뷰 내용을 확인하고 개선하세요.", img: "feedback.png" },
  { id: "review-preview", title: "🔍 리뷰 기능 미리보기", description: "AI 기반 리뷰 시스템을 직접 체험해보세요." },
];

const Homepage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const navigate= useNavigate();
  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (event.deltaY > 0) {
        setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
      } else {
        setCurrentSection((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  const redirectReviewPage = () => {
    navigate("/login");
  }
  return (
    <div className="homepage">
      <motion.div
        className="sections-container"
        animate={{ translateY: `-${currentSection * 100}vh` }} // 풀페이지 스크롤 적용
        transition={{ ease: "easeInOut", duration: 0.8 }}
      >
        {sections.map((section, index) => (
          <section key={section.id} className="section">
            {section.button ? (
              <div className="hero-content">
                <h1>{section.title}</h1>
                <p>{section.description}</p>
                <Button label="리뷰 시작하기" icon="pi pi-play" className="p-button-primary p-button-lg" onClick={()=> redirectReviewPage()}/>
              </div>
            ) : section.img ? (
              <div className="step-container">
                <img src={section.img} alt={section.title} />
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
            ) : (
              <div className="review-preview">
                <h2>{section.title}</h2>
                <div className="review-container">
                  <Card className="code-input-card">
                    <h3>📝 코드 입력</h3>
                    <CodeMirror
                      value={`function add(a, b) {\n  return a + b;\n}`}
                      extensions={[javascript()]}
                      readOnly
                      style={{ height: "200px", fontSize: "14px" }}
                    />
                  </Card>
                  <Card className="code-output-card">
                    <h3>✅ 리뷰 결과</h3>
                    <p>⚠️ 'return' 키워드 사용 시, 타입 검사를 추가하는 것이 좋습니다.</p>
                  </Card>
                </div>
              </div>
            )}
          </section>
        ))}
      </motion.div>
    </div>
  );
};

export default Homepage;