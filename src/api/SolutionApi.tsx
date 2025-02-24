import BaseApi from "./BaseApi";

// ✅ Solution Code를 가져오는 API 요청 (GET)
export const fetchSolutionCode = async (problemId: number) => {
  try {
    const response = await BaseApi.get(`/v1/solution/${problemId}`);
    return response.data; // ✅ `is_created` 및 `solution_code` 반환
  } catch (error: any) {
    console.error("❌ Error fetching solution code:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Solution Code를 생성하는 API 요청 (POST)
export const generateSolutionCode = async (problemId: number, requestData: any) => {
  try {
    const response = await BaseApi.post(`/v1/solution/${problemId}`, requestData);
    return response.data; // ✅ 생성된 `solution_code` 반환
  } catch (error: any) {
    console.error("❌ Error generating solution code:", error.response?.data || error.message);
    throw error;
  }
};

