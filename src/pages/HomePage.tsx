import React from 'react';
import HomeSection from '../components/HomeSection'; // ✅ HomeSection import 추가
import '../styles/homepage.css';

const Homepage: React.FC = () => {
  return (
    <div className="homepage-container">
      <div className="home-left">
        <HomeSection />
      </div>
      <div className="home-right">
        {/* 오른쪽 콘텐츠 추가 가능 */}
      </div>
    </div>
  );
};

export default Homepage;