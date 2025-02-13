import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload"; // ✅ FileUploadSelectEvent 추가

interface UrlOrFileUploaderProps {
  setInputSource: (source: "url" | "img") => void;
  setInputData: (data: string | null) => void;
}

const UrlOrFileUploader: React.FC<UrlOrFileUploaderProps> = ({ setInputSource, setInputData }) => {
  const [activeInput, setActiveInput] = useState<"url" | "img" | null>(null);
  const [url, setUrl] = useState("");

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

  return (
    <div className="flex flex-column align-items-center gap-2">
      {/* ✅ 입력 방식 선택 버튼 */}
      <div className="flex gap-2">
        <Button 
          label="URL 입력" 
          icon="pi pi-link" 
          onClick={() => setActiveInput("url")} 
          className="p-button-primary p-button-sm w-8rem"
        />
        <Button 
          label="이미지 선택" 
          icon="pi pi-image" 
          onClick={() => setActiveInput("img")} 
          className="p-button-secondary p-button-sm w-8rem"
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

// import React, { useState } from "react";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { FileUpload } from "primereact/fileupload";

// const UrlOrFileUploader: React.FC = () => {
//   const [activeInput, setActiveInput] = useState<"url" | "file" | null>(null);
//   const [url, setUrl] = useState("");

//   return (
//     <div className="flex flex-column align-items-center gap-2">
//       {/* 버튼 그룹 (크기 조정) */}
//       <div className="flex gap-2">
//         <Button 
//           label="URL 입력" 
//           icon="pi pi-link" 
//           onClick={() => setActiveInput(activeInput === "url" ? null : "url")} 
//           className="p-button-primary p-button-sm w-8rem" // ✅ 크기 조정
//         />
//         <Button 
//           label="이미지 선택" 
//           icon="pi pi-image" 
//           onClick={() => setActiveInput(activeInput === "file" ? null : "file")} 
//           className="p-button-secondary p-button-sm w-8rem" // ✅ 크기 조정
//         />
//       </div>

//       {/* URL 입력 필드 (크기 조정) */}
//       {activeInput === "url" && (
//         <div className="flex align-items-center gap-2">
//           <InputText 
//             value={url} 
//             onChange={(e) => setUrl(e.target.value)} 
//             placeholder="이미지 URL 입력" 
//             className="w-16rem p-inputtext-sm" // ✅ 크기 조정
//           />
//           <Button 
//             label="확인" 
//             icon="pi pi-check" 
//             className="p-button-success p-button-sm w-6rem" // ✅ 크기 조정
//           />
//         </div>
//       )}

//       {/* 파일 업로드 컴포넌트 (크기 조정) */}
//       {activeInput === "file" && (
//         <FileUpload 
//           mode="basic" 
//           chooseLabel="파일 선택" 
//           accept="image/*" 
//           customUpload={true}
//           className="p-button-sm w-16rem" // ✅ 크기 조정
//         />
//       )}
//     </div>
//   );
// };

// export default UrlOrFileUploader;
