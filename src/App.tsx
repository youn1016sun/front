import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HomeLayout from './layouts/HomeLayout';
import ReviewPage from './pages/ReviewPage';
import ReviewLayout from './layouts/ReviewLayout';
import LoginPage from './pages/LoginPage';
import LoginLayout from './layouts/LoginLayout';
import RegisterPage from './pages/RegisterPage';
import RegisterLayout from './layouts/RegisterLayout';
import TutorialPage from './pages/TutorialPage';

interface HistoryItem {
  problem_id: number;
  problem_name: string;
  history_ids: number[];
  history_names: string[];
}

const App: React.FC = () => {
  const [histories, setHistories] = useState<HistoryItem[]>([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout><HomePage /></HomeLayout>} />
        <Route path="/login" element={<LoginLayout><LoginPage /></LoginLayout>} />
        <Route path="/review" element={
          <ReviewLayout>
            <ReviewPage
              histories={histories}
              setHistories={setHistories}
            />
          </ReviewLayout>
        } />
        <Route path="/register" element={<RegisterLayout><RegisterPage /></RegisterLayout>} />
        <Route path="/tutorial" element={<TutorialPage />} />
      </Routes>
    </Router>
  );
};

export default App;
