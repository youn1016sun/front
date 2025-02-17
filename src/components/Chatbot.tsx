import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/review.css";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
import { sendChatbotMessage } from "../api/ChatbotApi";

interface ChatbotProps {
  onClose: () => void; // ✅ 부모에서 챗봇 닫기 기능 전달
  problemInfo: string;
  sourceCode: string;
  reviewTitle: string;
  reviewComments: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ 
  onClose,
  problemInfo, // ✅ props를 명확히 받아옴
  sourceCode,
  reviewTitle,
  reviewComments,
}) => {
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const scrollRef = useRef<any>(null);

  // ✅ 스크롤을 최신 메시지로 이동
  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.getContent().scrollTop = scrollRef.current.getContent().scrollHeight;
      }
    }, 100);
  }, [chatMessages]);

  // ✅ 챗봇 메시지 전송 함수 (POST 요청)
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const newMessages = [...chatMessages, { sender: "user", text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");

    // ✅ request data를 `console.log()`로 확인 (디버깅용)
    const requestData = {
      problemInfo,
      sourceCode,
      reviewTitle,
      reviewComments,
      questions: [userInput],
      answers: [],
    };
    console.log("📡 Sending Chatbot Request:", requestData);

    try {
      // ✅ API 요청
      const response = await sendChatbotMessage(requestData);

      console.log("✅ chatbotAPI Response:", response); // ✅ API 응답 확인

      // ✅ API 응답이 있을 경우, 봇 메시지 추가
      if (response) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: response }, // ✅ 응답 메시지 반영
        ]);
      } else {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." },
        ]);
      }
    } catch (error: any) {
      console.error("❌ 챗봇 API 요청 실패:", error.response?.data || error.message);

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "서버 응답을 받을 수 없습니다." },
      ]);
    }
  };
  return (
    <motion.div 
      className="chatbot-window"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="chatbot-header">
        <h3>ChatBot</h3>
        <Button icon="pi pi-times" className="p-button-text" onClick={onClose} />
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
          className="chatbot-input-text"
        />
        <Button 
          label="전송" 
          icon="pi pi-send" 
          className="p-button-primary chatbot-send-button"
          onClick={sendMessage} 
        />
      </div>
    </motion.div>
  );
};

export default Chatbot;