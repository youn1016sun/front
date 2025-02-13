import axios from "axios";

const API_BASE_URL = "https://virtserver.swaggerhub.com/TNSTKD98/Algo_Reivew/1.0.0";

// ✅ Solution Code를 가져오는 API 요청
export const fetchSolutionCode = async (historyId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/solution/${historyId}`);
    return response.data.solution_code; // ✅ 서버에서 받은 솔루션 코드 반환
  } catch (error) {
    console.error("❌ Error fetching solution code:", error.response?.data || error.message);
    throw error;
  }
};
