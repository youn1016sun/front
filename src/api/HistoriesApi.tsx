import BaseApi from "./BaseApi";

interface Props {
    historyId: Number;
    METHOD: string;
}

const url = "/v1/history/";

const HistroyApi = async ({ historyId, METHOD }: Props): Promise<string | void> => {
    if (METHOD === "GET") {

    } else if(METHOD === "POST") {

    } else if(METHOD === "PUT") {

    } else if(METHOD === "DELETE") {

    } else {
        console.log("method error");
    }
    try {
        const response = await BaseApi.post(url+{ historyId });
        return "success";  // 성공 시 호출한 곳에서 처리
    } catch (error) {
        return "오류처리";
    }
};

export default HistroyApi;
