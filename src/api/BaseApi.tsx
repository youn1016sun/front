import axios from "axios";

const BaseApi = axios.create({
    baseURL: "http://222.100.174.159:25565/api/",
    headers: { "Content-Type": "application/json" },
});

export default BaseApi;

//https://virtserver.swaggerhub.com/TNSTKD98/Algo_Reivew/1.0.0/api/v1/review
//http://222.100.174.159:25565/api/