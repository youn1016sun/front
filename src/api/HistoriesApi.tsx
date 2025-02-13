import axios from "axios";

const API_BASE_URL = "http://222.100.174.159:25565";
//http://222.100.174.159:25565
//https://virtserver.swaggerhub.com/TNSTKD98/Algo_Reivew/1.0.0

<<<<<<< HEAD
const url = "/v1/history/";

const HistroyApi = async ({ historyId, METHOD }: Props): Promise<string | void> => {
    if (METHOD === "GET") {
        const response = await BaseApi.get(url+{ historyId });
    } else if(METHOD === "POST") {
        const response = await BaseApi.post(url+{ historyId });
    } else if(METHOD === "PUT") {
        const response = await BaseApi.put(url+{ historyId });
    } else if(METHOD === "DELETE") {
        const response = await BaseApi.delete(url+{ historyId });
    } else {
        console.log("method error");
    }
    try {
        return "success";  // 성공 시 호출한 곳에서 처리
    } catch (error) {
        return "오류처리";
    }
};

export default HistroyApi;
=======
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
>>>>>>> 611f940321eb778ee27005ae0c7175db1b18177f
