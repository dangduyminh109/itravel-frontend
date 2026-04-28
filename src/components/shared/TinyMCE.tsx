"use client";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/hooks/useTheme";
const CLOUDINARY_API = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
const TINY_MCE_API_KEY = process.env.NEXT_PUBLIC_TINY_MCE_API_KEY || "";

export default function TinyMCE({
  field,
}: {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
}) {
  const handleImageUpload = (blobInfo: any, progress: any, failure: any) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${CLOUDINARY_API}`, true);
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      formData.append("upload_preset", "unsigned_preset");
      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100);
        if (progress && typeof progress === "function") {
          const percent = 0;
          progress(percent);
        }
      };

      xhr.upload.onprogress = (e) => {
        if (progress && typeof progress === "function") {
          progress((e.loaded / e.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status > 300) {
          if (failure && typeof failure === "function") {
            failure("Upload thất bại");
          }
          reject("Upload thất bại");
        } else {
          const response = JSON.parse(xhr.responseText);
          if (response && response.secure_url) {
            resolve(response.secure_url);
          } else {
            reject("Không tìm thấy URL ảnh");
          }
        }
      };

      xhr.onerror = () => {
        if (failure && typeof failure === "function") {
          failure("Upload thất bại");
        }
        reject("Upload thất bại");
      };

      xhr.send(formData);
    });
  };
  const { theme } = useTheme();

  return (
    <Editor
      key={theme}
      apiKey={TINY_MCE_API_KEY}
      value={field.value}
      onEditorChange={(content) => field.onChange(content)}
      init={{
        height: 500,
        menubar: false,
        plugins: "link image code table lists",
        skin: theme === "dark" ? "oxide-dark" : "oxide",
        content_css: theme === "dark" ? "dark" : "default",
        images_upload_url: `${CLOUDINARY_API}`,
        automatic_uploads: true,
        images_reuse_filename: true,
        images_upload_handler: handleImageUpload,
        toolbar:
          "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image",
      }}
    />
  );
}
