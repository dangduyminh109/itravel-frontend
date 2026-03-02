"use client";
import ForgotPassword from "@/features/auth/components/FotgotPassword";
import Login from "@/features/auth/components/Login";
import Register from "@/features/auth/components/Register";
import { useEffect, useRef } from "react";

const page = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleChangeFrom = (newAuthState: string) => {
    if (divRef.current && newAuthState === "login") {
      localStorage.setItem("auth_redirected", "login");
      divRef.current.classList.remove("translate-y-0");
      divRef.current.classList.remove("-translate-y-2/3");
      divRef.current.classList.add("-translate-y-1/3");
    } else if (divRef.current && newAuthState === "register") {
      localStorage.setItem("auth_redirected", "register");
      divRef.current.classList.remove("-translate-y-1/3");
      divRef.current.classList.remove("-translate-y-2/3");
      divRef.current.classList.add("translate-y-0");
    } else if (divRef.current && newAuthState === "forgot") {
      localStorage.setItem("auth_redirected", "forgot");
      divRef.current.classList.remove("translate-y-0");
      divRef.current.classList.remove("-translate-y-1/3");
      divRef.current.classList.add("-translate-y-2/3");
    }
  };

  useEffect(() => {
    const authRedirected = localStorage.getItem("auth_redirected");
    if (authRedirected) {
      handleChangeFrom(authRedirected);
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-145 overflow-hidden px-10">
        <div
          ref={divRef}
          className="transition-all duration-800 -translate-y-1/3 flex flex-col items-stretch gap-10 items-center"
        >
          <div className="max-w-200 h-135 rounded-lg border border-secondary flex overflow-hidden">
            <Register handleChangeFrom={handleChangeFrom} />
          </div>

          <div className="max-w-200 h-135 rounded-lg border border-secondary flex overflow-hidden">
            <Login handleChangeFrom={handleChangeFrom} />
          </div>

          <div className="max-w-200 h-135 rounded-lg border border-secondary flex overflow-hidden">
            <ForgotPassword handleChangeFrom={handleChangeFrom} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
