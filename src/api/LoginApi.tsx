import BaseApi from "./BaseApi";

interface LoginResponse {
    message: string;
    user_id: number; // `user_id`는 숫자
}

interface LoginProps {
    email: string;
    password: string;
}

const url = "/v1/user/login/";

const LoginApi = async ({ email, password }: LoginProps): Promise<LoginResponse> => {
    try {
        const response = await BaseApi.post(url, { email, password });

        // `response.data`가 예상한 구조인지 확인
        if (!response.data || typeof response.data.user_id !== "number") {
            throw new Error("Invalid response format");
        }

        return response.data; // `user_id`와 `message`가 포함된 객체 반환
    } catch (error) {
        console.error("❌ 로그인 실패:", error);
        throw new Error("로그인 실패, 아이디 또는 패스워드를 확인해주세요.");
    }
};

export default LoginApi;



// import BaseApi from "./BaseApi";

// interface Props {
//     email: string;
//     password: string;
//     error?: string;
// }

// const url = "/v1/user/login/";

// const LoginApi = async ({ email, password }: Props): Promise<string | void> => {
//     try {
//         const response = await BaseApi.post(url, { email, password });
//         return response.data; // 성공 시 호출한 곳에서 처리
//     } catch (error) {
//         return "로그인 실패, 아이디 또는 패스워드를 확인해주세요.";
//     }
// };

// export default LoginApi;