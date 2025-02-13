import BaseApi from "./BaseApi";

interface Props {
    historyId: Number;
    METHOD: string;
}

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
