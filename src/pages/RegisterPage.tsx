import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import RegisterApi from "../api/RegisterApi";
import { useState, useEffect } from "react";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [passwdCheckValid, setPasswdCheckValid] = useState<boolean>(false);

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
    } catch (error) {
      console.error("❌ 회원가입 실패:", error);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h1>Register</h1>
        <div className="p-field">
          <label htmlFor="email">Email</label>
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
            placeholder="Password-check"
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