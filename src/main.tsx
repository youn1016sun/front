// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/global.css'; // 스타일 파일
import App from './App'; // App 컴포넌트를 불러옴

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App /> {/* App 컴포넌트 렌더링 */}
  </React.StrictMode>
);