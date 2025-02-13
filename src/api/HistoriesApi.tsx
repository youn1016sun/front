import axios from "axios";

const API_BASE_URL = "http://222.100.174.159:25565";
//http://222.100.174.159:25565
//https://virtserver.swaggerhub.com/TNSTKD98/Algo_Reivew/1.0.0

// ✅ 특정 사용자의 리뷰 히스토리 가져오기
export const fetchUserHistory = async (userId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/histories/${userId}`);
    return response.data.problems; // ✅ 서버에서 받은 `problems` 배열 반환
  } catch (error) {
    console.error("❌ Error fetching user history:", error.response?.data || error.message);
    throw error;
  }
};
