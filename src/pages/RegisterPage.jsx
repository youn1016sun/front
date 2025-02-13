import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import RegisterApi from "../api/RegisterApi.jsx";
import {useState, useEffect} from "react";

function RegisterPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [passwordCheck, setPasswordCheck]= useState("");
    const [passwdCheckValid, setPasswdCheckValid]= useState(false);

    const updateEmail= (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    }

    const updatePassword= (e) => {
        const newPassword= e.target.value;
        setPassword(newPassword);
    }

    const updatePasswordCheck= (e) => {
        const newPasswordCheck= e.target.value;
        setPasswordCheck(newPasswordCheck);
    }

    useEffect(() => {
        if(password === passwordCheck){
            setPasswdCheckValid(true);
        }
        else {
            setPasswdCheckValid(false);
        }
    }, [password, passwordCheck])

    const handleRegister= async () => {
        const result= RegisterApi({email, password});
        console.log(result.data);
    };



    return (
        <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img src="/demo/images/blocks/logos/hyper.svg" alt="hyper" height={50} className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                    <InputText id="email" onChange={updateEmail} type="text" placeholder="Email address" className="w-full mb-3" />

                    <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                    <InputText id="password" onChange={updatePassword} type="password" placeholder="Password" className="w-full mb-3" />
                    <InputText id="password-check" onChange={updatePasswordCheck} type="password" placeholder="Password-check" className="w-full mb-3" />

                    <Button label="Register!" onClick={handleRegister}icon="pi pi-user" className="w-full" />
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;