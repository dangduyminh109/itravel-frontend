"use client";
import { useAuthStore } from "@/store/auth.store";

const page = () => {
  const currentAccount = useAuthStore((state) => state.account);
  return <div>home page {currentAccount?.email}</div>;
};

export default page;
