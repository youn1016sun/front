import axios from "axios";

const BaseApi = axios.create({
    baseURL: "http://13.231.227.232:8000/api",
    // 스웨거 서버 baseURL: "https://virtserver.swaggerhub.com/TNSTKD98/Algo_Reivew/1.0.0/api",
    // 실제 서비스 서버 baseURL: "http://52.199.8.118:8000/api",
    // 형식님 서버 http://222.100.174.159:25565/api/v1/review
    // 최신 서비스 서버 URL: http://13.231.227.232:8000/api
    headers: { "Content-Type": "application/json" },
});

export default BaseApi;