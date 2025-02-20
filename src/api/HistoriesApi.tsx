import BaseApi from "./BaseApi.tsx";

// ✅ 특정 사용자의 리뷰 히스토리 가져오기 (user_id 기반)
export const fetchUserHistory = async (userId: number) => {
  try {
    const response = await BaseApi.get(`v1/user-histories/${userId}`);
    return response.data.problems; // ✅ 서버에서 받은 `problems` 배열 반환
  } catch (error: any) {
    console.error("❌ Error fetching user history:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 특정 히스토리 상세 정보 가져오기 (history_id 기반)
export const fetchHistoryDetails = async (historyId: number) => {
  try {
    const response = await BaseApi.get(`v1/histories/${historyId}`);
    return response.data; // ✅ 전체 응답 반환
  } catch (error: any) {
    console.error("❌ Error fetching history details:", error.response?.data || error.message);
    throw error;
  }
};

/** ✅ 히스토리 이름 변경 (PUT 요청) */
export const updateHistoryName = async (historyId: number, newName: string) => {
  try {
    await BaseApi.put(`v1/history/${historyId}`, { new_name: newName});
    //await axios.put(`${API_BASE_URL}/api/v1/history/${historyId}`, { new_name: newName });
    console.log(`✅ History ${historyId} 이름이 ${newName}로 변경됨`);
    return true; // ✅ 성공 반환
  } catch (error: any) {
    console.error(`❌ Error updating history ${historyId}:`, error.response?.data || error.message);
    return false; // ❌ 실패 반환
  }
};

/** ✅ 히스토리 삭제 (DELETE 요청) */
export const deleteHistory = async (historyId: number) => {
  try {
    await BaseApi.delete(`v1/history/${historyId}`);
    console.log(`✅ History ${historyId} 삭제됨`);
    return true; // ✅ 성공 반환
  } catch (error: any) {
    console.error(`❌ Error deleting history ${historyId}:`, error.response?.data || error.message);
    return false; // ❌ 실패 반환
  }
};