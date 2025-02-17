import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload"; // ✅ FileUploadSelectEvent 추가

interface UrlOrFileUploaderProps {
  setInputSource: (source: "url" | "img") => void;
  setInputData: (data: string | null) => void;
  inputData?: string | null; // ✅ 선택적 props 추가
}

const UrlOrFileUploader: React.FC<UrlOrFileUploaderProps> = ({ setInputSource, setInputData, inputData }) => {
  const [activeInput, setActiveInput] = useState<"url" | "img" | null>(null);
  const [url, setUrl] = useState("");
  const [urlButtonClass, setUrlButtonClass] = useState<string>("p-button-primary p-button-sm w-8rem");
  const [imgButtonClass, setImgButtonClass] = useState<string>("p-button-secondary p-button-sm w-8rem");

  useEffect(() => {
    if (inputData === null) {
      setUrl("");
      setActiveInput(null);
    } else if (inputData && activeInput === "url") {
      setUrl(inputData); // ✅ `inputData`가 변경되면 `url` 업데이트
    }
  }, [inputData]);
  // ✅ URL 입력 처리
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
    setInputSource("url"); // ✅ "URL 입력" 선택 시 `input_source`를 "url"로 설정
    setInputData(newUrl); // ✅ 입력된 URL을 `input_data`로 설정
  };

  // ✅ 파일 업로드 처리 (이미지를 Base64로 변환)
  const handleFileUpload = (event: FileUploadSelectEvent) => {
    const file = event.files[0]; // ✅ `event.files`에서 첫 번째 파일 가져오기

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputSource("img"); // ✅ "이미지 선택" 시 `input_source`를 "img"로 설정
        setInputData(reader.result as string); // ✅ Base64 변환된 이미지 저장
      };
      reader.readAsDataURL(file);
    }
  };

  // 버튼 클릭에 따라 색깔 변경
  useEffect(()=> {
    if(activeInput === "url"){
      setUrlButtonClass("p-button-primary p-button-sm w-8rem");
      setImgButtonClass("p-button-secondary p-button-sm w-8rem");
    } else if (activeInput === "img"){
      setUrlButtonClass("p-button-secondary p-button-sm w-8rem");
      setImgButtonClass("p-button-primary p-button-sm w-8rem");
    }
  }, [activeInput])
  return (
    <div className="flex flex-column align-items-center gap-2">
      {/* ✅ 입력 방식 선택 버튼 */}
      <div className="flex gap-2">
        <Button 
          label="URL 입력" 
          icon="pi pi-link" 
          onClick={() => setActiveInput("url")} 
          className={urlButtonClass}
        />
        <Button 
          label="이미지 선택" 
          icon="pi pi-image" 
          onClick={() => setActiveInput("img")} 
          className={imgButtonClass}
        />
      </div>

      {/* ✅ URL 입력 필드 */}
      {activeInput === "url" && (
        <InputText 
          value={url} 
          onChange={handleUrlChange} 
          placeholder="이미지 URL 입력" 
          className="w-16rem p-inputtext-sm"
        />
      )}

      {/* ✅ 파일 업로드 */}
      {activeInput === "img" && (
        <FileUpload 
          mode="basic" 
          chooseLabel="파일 선택" 
          accept="image/*" 
          customUpload={true} // ✅ 사용자 정의 업로드 방식 사용
          className="p-button-sm w-16rem"
          onSelect={handleFileUpload} // ✅ 타입 오류 해결 (FileUploadSelectEvent 사용)
        />
      )}
    </div>
  );
};

export default UrlOrFileUploader;