import axios from "axios";

const API_BASE_URL = "https://virtserver.swaggerhub.com/TNSTKD98/Algo_Reivew/1.0.0";

// ✅ 특정 사용자의 리뷰 히스토리 가져오기 (user_id 기반)
export const fetchUserHistory = async (userId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/user-histories/${userId}`);
    return response.data.problems; // ✅ 서버에서 받은 `problems` 배열 반환
  } catch (error: any) {
    console.error("❌ Error fetching user history:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 특정 히스토리 상세 정보 가져오기 (history_id 기반)
export const fetchHistoryDetails = async (historyId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/histories/${historyId}`);
    return response.data; // ✅ 전체 응답 반환
  } catch (error: any) {
    console.error("❌ Error fetching history details:", error.response?.data || error.message);
    throw error;
  }
};


// import axios from "axios";

// const API_BASE_URL = "https://virtserver.swaggerhub.com/TNSTKD98/Algo_Reivew/1.0.0";
// //http://222.100.174.159:25565
// //https://virtserver.swaggerhub.com/TNSTKD98/Algo_Reivew/1.0.0

// // ✅ 특정 사용자의 리뷰 히스토리 가져오기(user_id 기반 get요청)
// export const fetchUserHistory = async (userId: number) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/v1/histories/${userId}`);
//     return response.data.problems; // ✅ 서버에서 받은 `problems` 배열 반환
//   } catch (error: any) {
//     console.error("❌ Error fetching user history:", error.response?.data || error.message);
//     throw error;
//   }
// };
