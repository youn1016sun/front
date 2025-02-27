import axios from "axios";

const BaseApi = axios.create({
    baseURL: "https://www.algoreview.site/api",
    headers: { "Content-Type": "application/json" },
});

export default BaseApi;