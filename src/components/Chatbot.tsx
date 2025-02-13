import React, { useState, useRef, useEffect } from "react";
import "../styles/review.css";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";

interface ChatbotProps {
  onClose: () => void; // ✅ 부모에서 챗봇 닫기 기능 전달
}

const Chatbot: React.FC<ChatbotProps> = () => {
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const scrollRef = useRef<any>(null); // ✅ useRef의 타입을 any로 변경

  // 스크롤을 최신 메시지로 이동
  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.getContent().scrollTop = scrollRef.current.getContent().scrollHeight;
      }
    }, 100); // ✅ setTimeout을 사용하여 렌더링 이후 실행
  }, [chatMessages]);

  const sendMessage = () => {
    if (userInput.trim() === "") return;

    const newMessages = [...chatMessages, { sender: "user", text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");

    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "이해했어요! 더 도와드릴까요?" },
      ]);
    }, 1000);
  };

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <h3>ChatBot</h3>
        <Button icon="pi pi-times" className="p-button-text" />
      </div>

      {/* 채팅 메시지 영역 */}
      <ScrollPanel ref={scrollRef} className="chatbot-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
      </ScrollPanel>

      {/* 입력창 */}
      <div className="chatbot-input">
        <InputText
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="w-full"
        />
        <Button label="전송" icon="pi pi-send" className="p-button-primary" onClick={sendMessage} />
      </div>
    </div>
  );
};

export default Chatbot;
