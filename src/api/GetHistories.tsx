import BaseApi from "./BaseApi";

interface Props {
    userId: Number;
    error?: string;
}

const url = "/v1/user/history/";

const LoginApi = async ({ userId }: Props): Promise<string | void> => {
    try {
        const response = await BaseApi.get(url + `"${ userId }"`);
        return response.data; // 성공 시 호출한 곳에서 처리
    } catch (error) {
        return "로그인 실패, 아이디 또는 패스워드를 확인해주세요.";
    }
};

export default LoginApi;