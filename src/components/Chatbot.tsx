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

  // 메시지 전송 함수(API 연동 추가)
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const newMessages = [...chatMessages, { sender: "user", text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");

    try {
      // ✅ API 호출 (챗봇 메시지 전송)
      const response = await sendChatbotMessage({
        problemInfo,
        sourceCode,
        reviewTitle,
        reviewComments,
        questions: [userInput], // ✅ 사용자가 입력한 질문 추가
        answers: [], // ✅ 초기에는 빈 배열 (API에서 응답 후 추가)
      });

      if (response) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: response.chatbot_response }, // ✅ API 응답 데이터 반영
        ]);
      }
    } catch (error) {
      console.error("챗봇 API 요청 실패:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." }, // ✅ 오류 메시지 추가
      ]);
    }
  };
  return (
    <motion.div 
      className="chatbot-window"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 1 }}
    >
      <div className="chatbot-header">
        <h3>ChatBot</h3>
        {/* ✅ X 버튼 클릭 시 챗봇 닫기 */}
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

// ms버전
// import React, { useState, useRef, useEffect } from "react";
// import "../styles/review.css";
// import { InputText } from "primereact/inputtext";
// import { ScrollPanel } from "primereact/scrollpanel";
// import { Button } from "primereact/button";

// interface ChatbotProps {
//   onClose: () => void; // ✅ 부모에서 챗봇 닫기 기능 전달
// }

// const Chatbot: React.FC<ChatbotProps> = () => {
//   const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
//   const [userInput, setUserInput] = useState<string>("");
//   const scrollRef = useRef<any>(null); // ✅ useRef의 타입을 any로 변경

//   // 스크롤을 최신 메시지로 이동
//   useEffect(() => {
//     setTimeout(() => {
//       if (scrollRef.current) {
//         scrollRef.current.getContent().scrollTop = scrollRef.current.getContent().scrollHeight;
//       }
//     }, 100); // ✅ setTimeout을 사용하여 렌더링 이후 실행
//   }, [chatMessages]);

//   const sendMessage = () => {
//     if (userInput.trim() === "") return;

//     const newMessages = [...chatMessages, { sender: "user", text: userInput }];
//     setChatMessages(newMessages);
//     setUserInput("");

//     setTimeout(() => {
//       setChatMessages((prevMessages) => [
//         ...prevMessages,
//         { sender: "bot", text: "이해했어요! 더 도와드릴까요?" },
//       ]);
//     }, 1000);
//   };

//   return (
//     <div className="chatbot-window">
//       <div className="chatbot-header">
//         <h3>ChatBot</h3>
//         <Button icon="pi pi-times" className="p-button-text" />
//       </div>

//       {/* 채팅 메시지 영역 */}
//       <ScrollPanel ref={scrollRef} className="chatbot-messages">
//         {chatMessages.map((msg, index) => (
//           <div key={index} className={`chat-message ${msg.sender}`}>
//             <div className="chat-bubble">{msg.text}</div>
//           </div>
//         ))}
//       </ScrollPanel>

//       {/* 입력창 */}
//       <div className="chatbot-input">
//         <InputText
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder="메시지를 입력하세요..."
//           className="w-full"
//         />
//         <Button label="전송" icon="pi pi-send" className="p-button-primary" onClick={sendMessage} />
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
