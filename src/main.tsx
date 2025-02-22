// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/global.css'; // 스타일 파일
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./styles/login.css";
import './styles/homepage.css';
import "./styles/review.css";
import "./styles/feedback.css";
import "./styles/solution.css";
import App from './App'; // App 컴포넌트를 불러옴

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App /> {/* App 컴포넌트 렌더링 */}
  </React.StrictMode>
);