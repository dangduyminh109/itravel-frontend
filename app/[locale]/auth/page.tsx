"use client";
import { useRef } from "react";
import ForgotPassword from "../../../features/auth/components/FotgotPassword";
import Register from "../../../features/auth/components/Register";
import Login from "../../../features/auth/components/Login";

const page = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleChangeFrom = (newAuthState: string) => {
    if (divRef.current && newAuthState === "login") {
      divRef.current.classList.remove("translate-y-0");
      divRef.current.classList.remove("-translate-y-2/3");
      divRef.current.classList.add("-translate-y-1/3");
    } else if (divRef.current && newAuthState === "register") {
      divRef.current.classList.remove("-translate-y-1/3");
      divRef.current.classList.remove("-translate-y-2/3");
      divRef.current.classList.add("translate-y-0");
    } else if (divRef.current && newAuthState === "forgot") {
      divRef.current.classList.remove("translate-y-0");
      divRef.current.classList.remove("-translate-y-1/3");
      divRef.current.classList.add("-translate-y-2/3");
    }
  };

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
