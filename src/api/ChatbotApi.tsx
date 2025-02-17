import BaseApi from "../api/BaseApi"; // ✅ BaseApi.tsx 불러오기

const url = "/v1/chatbot"; // ✅ API 경로 설정

export const sendChatbotMessage = async ({
  problemInfo,
  sourceCode,
  reviewTitle,
  reviewComments,
  questions,
  answers
}: {
  problemInfo: string;
  sourceCode: string;
  reviewTitle: string;
  reviewComments: string;
  questions: string[];
  answers: string[];
}) => {
  try {
    // ✅ API 요청
    const response = await BaseApi.post(url, {
      problem_info: problemInfo,
      source_code: sourceCode,
      review_info: {
        title: reviewTitle,
        comments: reviewComments,
      },
      questions: questions,
      answers: answers,
    });

    return response.data.response; // ✅ API 응답 메시지만 반환
  } catch (error) {
    console.error("❌ 챗봇 API 요청 실패:", error);
    return "챗봇 응답을 가져올 수 없습니다."; // ✅ 오류 발생 시 기본 메시지 반환
  }
};