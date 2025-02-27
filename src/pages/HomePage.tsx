import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import "../styles/homepage.css";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import logo from "../assets/images/logo.svg";

// 이미지 import
import Logo from "../assets/images/logo.svg";

const messages = [
  "알고리뷰는 AI 기반 코드 리뷰 플랫폼으로, 개발자의 알고리즘 실력을 성장시킵니다.",
  "개발 실력 향상의 새로운 패러다임",
  "어려움을 겪고 있는 문제를 해결할 수 있도록 방향성을 제안해드립니다."
];

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

  // 멘트 회전 함수
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setFade(true);
      }, 500); // 텍스트 변경 전 짧은 fade-out 효과
    }, 4000); // 3초마다 변경

    return () => clearInterval(interval);
  }, []);


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
        <header className="l-header">
          <nav className="hero-nav bd-grid">
              <div className="hero-nav-menu" id="hero-nav-menu">
                  <ul className="hero-nav-list">
                      <li className="hero-nav-item"><Link to="/"  className="hero-nav-link">Home</Link></li>
                      <li className="hero-nav-item"><Link to="/login"  className="hero-nav-link">Login</Link></li>
                      <li className="hero-nav-item"><Link to="/tutorial"  className="hero-nav-link">Tutorial</Link></li>
                      <li className="hero-nav-item"><Link to="/review"  className="hero-nav-link">Review</Link></li>
                  </ul>
              </div>
          </nav>
        </header>
        {/* ✅ Hero 섹션 */}
        <section className="hero-section">
          <section className="l-main bd-grid">
            <section className="hero-home">
                <div className="hero-home-data">
                    <h1 className="hero-home-title">Algo Review</h1>
                    <p className={`hero-home-description fade-text ${fade ? 'fade-in' : 'fade-out'}`}>{messages[currentIndex]}</p>
                </div>
                <div className="hero-home-img">
                    <img src={logo} alt="image" className="hero-logo" />
                </div>
             </section>
                <div className="hero-home-scroll">
                    <span className="hero-home-scroll-text">Scroll down for more</span>
                    <a href="#l-section"><img src="https://i.postimg.cc/brPG1vnY/bx-mouse.png" alt="icon" className="hero-home-scroll-icon" /></a>
                </div>
          </section>
        </section>

        {/* ✅ 알고리뷰 핵심 가치 섹션 */}
        <section className="hero-subsection">
          <div className="intro-logo-container">
            <img src={Logo} alt="algoreviewLogo" className="intro-logo" />
            <div className="intro-text">
              <h2>Q. 왜 알고리뷰를 사용해야 할까요?</h2>
            </div>
          </div>
          <section className="subhero-section">
            <div className="container-fluid">
              <div className="container">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="subhero-card text-center">
                      <div className="title">
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                        <h2>AI 기반 코드 리뷰</h2>
                      </div>
                      <div className="price">
                        <h4>Open AI</h4>
                      </div>
                      <div className="option">
                        <ul>
                        <li> <i className="fa fa-check" aria-hidden="true"></i> 자동으로 코드 개선 방향을 제시합니다 </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="subhero-card text-center">
                      <div className="title">
                        <i className="fa fa-plane" aria-hidden="true"></i>
                        <h2>피드백 & 모범 답안</h2>
                      </div>
                      <div className="price">
                        <h4>UX/UI</h4>
                      </div>
                      <div className="option">
                        <ul>
                        <li> <i className="fa fa-check" aria-hidden="true"></i> 단순한 정답이 아닌, 더 나은 코드를 학습하세요. </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="subhero-card text-center">
                      <div className="title">
                        <i className="fa fa-rocket" aria-hidden="true"></i>
                        <h2>코딩 실력 성장 기록</h2>
                      </div>
                      <div className="price">
                        <h4>History</h4>
                      </div>
                      <div className="option">
                        <ul>
                        <li> <i className="fa fa-check" aria-hidden="true"></i> 나만의 코드 학습 히스토리를 관리하세요. </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </section>
        </section>

        {/* ✅ 개별 설명 섹션 */}
        <section className="tutorial-section">
          <div className="tutorial-comment">
            <h2>먼저 어떻게 사용하는지 알아볼까요?</h2>
            <p>여기서 튜토리얼을 배우고, 공부를 시작하세요!</p>
          </div>
          
          <Button label="튜토리얼" icon="pi pi-play" className="homepage-login-button" onClick={redirectTutorialPage} />

          <div className="home-footer">
            <div className="home-footer-left">
              <h3>Team Members</h3>
              <ul>
                <li>조형식 - Team Leader, PM</li>
                <li>윤순상 - BackEnd, Cloud Infra</li>
                <li>이윤열 - BackEnd, AI Prompt</li>
                <li>장민성 - FrontEnd, UX/UI</li>
                <li>윤병수 - PM, FrontEnd</li>
              </ul>
            </div>
            <div className="home-footer-right">
              <div className="home-footer-logo-space"><img src={logo} className="footerlogo"/></div>
              <p>&copy; 2025 AlgoReview</p>
              <p>TABA 7th</p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Homepage;