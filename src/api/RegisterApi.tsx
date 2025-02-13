import BaseApi from "./BaseApi";

interface Props {
    email: string;
    password: string;
}

const url = "/v1/user/register/";

const RegisterApi = async ({ email, password }: Props): Promise<string | void> => {
    try {
        const response = await BaseApi.post(url, { email, password });
        return "success";  // 성공 시 호출한 곳에서 처리
    } catch (error) {
        return "오류처리";
    }
};

export default RegisterApi;
