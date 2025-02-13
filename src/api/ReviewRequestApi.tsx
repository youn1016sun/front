import axios from "axios";
import BaseApi from "./BaseApi.tsx";

const url = "/v1/review";
// https://virtserver.swaggerhub.com/TNSTKD98/Algo_Reivew/1.0.0/api/v1/review
// http://222.100.174.159:25565/api/v1/review

// ✅ 코드 리뷰 요청 (POST 요청을 한 번만 실행)
export const sendReviewRequest = async (data: any) => {
  try {
    const response = await BaseApi.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("📡 API Response:", response.data);
    return response.data; // ✅ 전체 응답 데이터 반환 (history_id, problem_info, reviews 포함)
  } catch (error) {
    console.error("❌ Error sending review request:", error.response?.data || error.message);
    throw error;
  }
};
export default sendReviewRequest;
