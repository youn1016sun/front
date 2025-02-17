import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HomeLayout from './layouts/HomeLayout';
import ReviewPage from './pages/ReviewPage';
import ReviewLayout from './layouts/ReviewLayout';
import LoginPage from './pages/LoginPage';
import LoginLayout from './layouts/LoginLayout';
import RegisterPage from './pages/RegisterPage';
import RegisterLayout from './layouts/RegisterLayout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Homepage - HomeLayout 사용 */}
        <Route path="/" element={<HomeLayout><HomePage /></HomeLayout>} />
        
        {/* LoginPage - HomeLayout 사용 */}
        <Route path="/login" element={<LoginLayout><LoginPage /></LoginLayout>} />
        
        {/* ReviewPage - ReviewLayout 사용 */}
        <Route path="/review" element={<ReviewLayout><ReviewPage /></ReviewLayout>} />
        
        {/* 임시 회원가입 */}
        <Route path="/register" element={<RegisterLayout><RegisterPage /></RegisterLayout>} />
      </Routes>
    </Router>
  );
};

export default App;