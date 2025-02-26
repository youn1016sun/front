import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import "../styles/homepage.css";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import CustomCodeEditor from "../components/CustomEditor";

// 이미지 import
import Logo from "../assets/images/logo.svg";


const Homepage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const navigate = useNavigate();
  const [scrollLock, setScrollLock] = useState(false);

  const TOTAL_SECTIONS = 3;

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (scrollLock) return;

      if (Math.abs(event.deltaY) > 60) {
        setScrollLock(true);

        if (event.deltaY > 0) {
          setCurrentSection((prev) => Math.min(prev + 1, TOTAL_SECTIONS - 1));
        } else {
          setCurrentSection((prev) => Math.max(prev - 1, 0));
        }

        setTimeout(() => setScrollLock(false), 1000);
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [scrollLock]);

  const redirectLoginPage = () => {
    navigate("/login");
  };
  const redirectTutorialPage = () => {
    navigate("/tutorial");
  };
  

  return (
    <div className="homepage">
      <motion.div
        className="sections-container"
        animate={{ translateY: `-${currentSection * 100}vh` }}
        transition={{ ease: "easeInOut", duration: 0.8 }}
      >
        {/* ✅ Hero 섹션 */}
        <section className="hero-section">
          <h1>알고리뷰와 함께 맞춤형 코드리뷰를 받아보세요</h1>
          <CustomCodeEditor />
          <Button label="리뷰 시작하기" icon="pi pi-play" className="p-button-primary p-button-lg" onClick={redirectLoginPage} />
        </section>

        {/* ✅ 알고리뷰 핵심 가치 섹션 */}
        <section className="hero-subsection">
          <div className="intro-logo-container">
            <img src={Logo} alt="algoreviewLogo" className="intro-logo" />
            <div className="intro-text">
              <h2>Q. 알고리뷰를 왜 사용해야 할까요?</h2>
            </div>
          </div>
          <div className="slider-container">
            {["AI 기반 코드 리뷰", "개선 방향 & 모범 답안", "실시간 재리뷰 & 챗봇 서비스"].map((text, index) => (
              <motion.div key={index} className="home-slide" initial={{ opacity: 0, y: 80, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.5, delay: index * 0.9, ease: "easeOut" }}>
                <h2>{text}</h2>
                <p>
                  {index === 0
                    ? "고민 중인 문제에 대해 30초 안에 리뷰를 받아보세요"
                    : index === 1
                    ? "세부적인 개선 방향을 확인하고 최적화된 코드 예시까지 받아보세요"
                    : "최적의 코드에 도전하시고, 언제든 질문하세요"}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ✅ 개별 설명 섹션 */}
        <section className="tutorial-section">
          <div className="tutorial-comment">
            <h2>먼저 어떻게 사용하지 알아볼까요?</h2>
            <p>여기서 튜토리얼을 배우고, 공부를 시작하세요!</p>
          </div>
          <Button label="튜토리얼" icon="pi pi-play" className="p-button-primary p-button-lg" onClick={redirectTutorialPage} />
        </section>
      </motion.div>
    </div>
  );
};

export default Homepage;