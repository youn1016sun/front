import axios from "axios";
import BaseApi from "./BaseApi";

const url = "/v1/review";
// ✅ 리뷰 데이터를 가져오는 API 함수
export const fetchReviews = async () => {
    try {
        const response = await BaseApi.post(url); // 📌 실제 API 주소로 변경
        return response.data.reviews.map((review: any) => ({
            header: review.title,
            children: review.comments.replace(/\n/g, "<br />"), // ✅ 개행 문자 처리
        }));
    } catch (error) {
        if (axios.isAxiosError(error)) {  // ✅ axios에서 발생한 오류인지 확인
            console.error("Error fetching reviews:", error.response?.data || error.message);
        } else if (error instanceof Error) {  // ✅ 일반적인 JavaScript 오류인지 확인
            console.error("Unexpected error:", error.message);
        } else {
            console.error("An unknown error occurred");
        }
        return [];
    }
};