import BaseApi from "./BaseApi.tsx";

const url = "/v1/review";

// 코드 리뷰 요청 (POST 요청을 한 번만 실행)
export const sendReviewRequest = async (data: any) => {
  try {
    const response = await BaseApi.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("📡 API Response:", response.data);
    return response.data; // 전체 응답 데이터 반환 (history_id, problem_info, reviews 포함)
  } catch (error: any) {
    console.error("❌ Error sending review request:", error.response?.data || error.message);
    throw error;
  }
};
export default sendReviewRequest;