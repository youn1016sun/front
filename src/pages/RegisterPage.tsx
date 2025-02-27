import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import RegisterApi from "../api/RegisterApi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [passwdCheckValid, setPasswdCheckValid] = useState<boolean>(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate(); 

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const updatePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
  };

  useEffect(() => {
    setPasswdCheckValid(password === passwordCheck);
  }, [password, passwordCheck]);

  const handleRegister = async () => {
    try {
      const result = await RegisterApi({ email, password });
      console.log("회원가입 응답:", result);

      if (result === "success") {
        console.log("✅ 회원가입 성공! 로그인 페이지로 이동 준비...");
        
        // 성공 메시지 띄우기
        toast.current?.show({
          severity: "success",
          summary: "회원가입 완료",
          detail: "2초 후 로그인 페이지로 이동합니다.",
          life: 2000, // 2초 동안 표시
        });

        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        console.error("❌ 회원가입 실패: ", result);

        // 실패 메시지 띄우기
        toast.current?.show({
          severity: "error",
          summary: "회원가입 실패",
          detail: "이메일 또는 비밀번호를 확인하세요.",
          life: 3000, // 3초 동안 표시
        });
      }
    } catch (error) {
      console.error("❌ 회원가입 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className="login-container">
      <Toast ref={toast} /> {/* Toast 컴포넌트 추가 */}
      <Card className="login-card">
        <h1>Register</h1>
        <div className="p-field">
          <label htmlFor="email" className="block text-900 font-medium mb-2">
            Email
          </label>
          <InputText
            id="email"
            onChange={updateEmail}
            type="text"
            placeholder="Email address"
            className="w-full mb-3"
          />
        </div>
        <div className="p-field">
          <label htmlFor="password" className="block text-900 font-medium mb-2">
            Password
          </label>
          <InputText
            id="password"
            onChange={updatePassword}
            type="password"
            placeholder="Password"
            className="w-full mb-3"
          />
          <InputText
            id="password-check"
            onChange={updatePasswordCheck}
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-3"
          />
        </div>
        <Button
          label="Register!"
          onClick={handleRegister}
          icon="pi pi-user"
          className="w-full"
          disabled={!passwdCheckValid} // 비밀번호 확인이 일치하지 않으면 비활성화
        />
      </Card>
    </div>
  );
};

export default RegisterPage;