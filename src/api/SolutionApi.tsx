import BaseApi from "./BaseApi";

// ✅ Solution Code를 가져오는 API 요청
export const fetchSolutionCode = async (historyId: number) => {
  try {
    const response = await BaseApi.get(`v1/solution/${historyId}`);
    return response.data.solution_code; // ✅ 서버에서 받은 솔루션 코드 반환
  } catch (error: any) {
    console.error("❌ Error fetching solution code:", error.response?.data || error.message);
    throw error;
  }
};
