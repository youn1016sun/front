import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";

interface UrlOrFileUploaderProps {
  setInputSource: (source: "url" | "img") => void;
  setInputData: (data: string | null) => void;
  inputData?: string | null;
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
      setUrl(inputData);
    }
  }, [inputData]);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
    setInputSource("url");
    setInputData(newUrl);
  };

  const handleFileUpload = (event: FileUploadSelectEvent) => {
    const file = event.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputSource("img");
        setInputData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (activeInput === "url") {
      setUrlButtonClass("p-button-primary p-button-sm w-8rem");
      setImgButtonClass("p-button-secondary p-button-sm w-8rem");
    } else if (activeInput === "img") {
      setUrlButtonClass("p-button-secondary p-button-sm w-8rem");
      setImgButtonClass("p-button-primary p-button-sm w-8rem");
    }
  }, [activeInput]);

  return (
    <div className="url-or-file-uploader">
      {/* ✅ 버튼과 입력 필드를 한 줄로 정렬 */}
      <div className="input-container">
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

        {/* ✅ URL 입력 필드 (버튼 오른쪽에 위치) */}
        {activeInput === "url" && (
          <InputText 
            value={url} 
            onChange={handleUrlChange} 
            placeholder="이미지 URL 입력" 
            className="input-field"
          />
        )}

        {/* ✅ 파일 업로드 (버튼 오른쪽에 위치) */}
        {activeInput === "img" && (
          <FileUpload 
            mode="basic" 
            chooseLabel="파일 선택" 
            accept="image/*" 
            customUpload={true}
            className="input-file"
            onSelect={handleFileUpload}
          />
        )}
      </div>
    </div>
  );
};

export default UrlOrFileUploader;