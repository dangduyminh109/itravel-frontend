"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "@/config/firebase.config";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import ApiResponse from "@/types/ApiResponse.type";
import { useAuthStore } from "@/store/auth.store";
import { GoogleLoginResponse } from "../types/googleLogin.response";
import { CurrentAccount } from "../types/currentAccount.type";
import { googleLogin } from "../services/auth.service";

export default function LoginPopup() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const idToken = await result.user.getIdToken();
      const response = await googleLogin(idToken);
      const data = response as ApiResponse<GoogleLoginResponse>;

      if (data.success) {
        const account: CurrentAccount = {
          username: data.response.username,
          email: data.response.email,
        };
        useAuthStore.getState().setAccount(account);
        router.push("/vi");
      } else {
        toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
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
