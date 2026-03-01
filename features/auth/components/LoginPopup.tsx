"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase.config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function LoginPopup() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      // 1. Mở Popup Google
      const result = await signInWithPopup(auth, googleProvider);

      // 2. Lấy ID Token chính hãng của Firebase
      const idToken = await result.user.getIdToken();

      // 3. Ném Token lên API Route của Next.js (BFF)
      const response = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        alert("Đăng nhập thất bại từ server!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full border-primary"
      size={"lg"}
      type="button"
      onClick={handleGoogleLogin}
    >
      <FontAwesomeIcon icon={faGoogle} className="w-5 h-5" />
      Đăng nhập với Google
    </Button>
  );
}
