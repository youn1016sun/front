import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown"
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
import { sendChatbotMessage } from "../api/ChatbotApi";

interface ChatbotProps {
  onClose: () => void;
  problemInfo: string;
  sourceCode: string;
  reviewTitle: string;
  reviewComments: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ 
  onClose,
  problemInfo,
  sourceCode,
  reviewTitle,
  reviewComments,
}) => {
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false); // 확장 여부 상태
  const scrollRef = useRef<any>(null);

  // 스크롤을 최신 메시지로 이동
  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.getContent().scrollTop = scrollRef.current.getContent().scrollHeight;
      }
    }, 100);
  }, [chatMessages]);

  // 챗봇 메시지 전송 함수
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const newMessages = [...chatMessages, { sender: "user", text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");

    try {
      const response = await sendChatbotMessage({
        problemInfo,
        sourceCode,
        reviewTitle,
        reviewComments,
        questions: [userInput],
        answers: [],
      });

      if (response) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: response },
        ]);
      } else {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." },
        ]);
      }
    } catch (error: any) {
      console.error("❌ 챗봇 API 요청 실패:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "서버 응답을 받을 수 없습니다." },
      ]);
    }
  };

  return (
    <div className={`chatbot-window ${isExpanded ? "expanded" : ""}`}> {/* 확장 상태 반영 */}
      {/* 챗봇 헤더: 버튼 추가 */}
      <div className="chatbot-header">
        <h3>ChatBot</h3>
        <div>
          {/* 확장 버튼 (토글 기능) */}
          <Button
            icon={isExpanded ? "pi pi-compress" : "pi pi-external-link"} // 확장 상태에 따라 아이콘 변경
            className="p-button-text chatbot-expand-btn"
            onClick={() => setIsExpanded(!isExpanded)} // 버튼 누르면 확장/축소
          />
          <Button icon="pi pi-times" className="p-button-text" onClick={onClose} />
        </div>
      </div>

      {/* 채팅 메시지 영역 */}
      <ScrollPanel ref={scrollRef} className="chatbot-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <div className="chat-bubble">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
          </div>
        ))}
      </ScrollPanel>

      {/* 입력창 */}
      <div className="chatbot-input">
        <InputText
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="chatbot-input-text"
        />
        <Button 
          id="chatbot-send-button"
          label="전송" 
          icon="pi pi-send"
          className="p-button-primary chatbot-send-button"
          onClick={sendMessage} 
        />
      </div>
    </div>
  );
};

export default Chatbot;