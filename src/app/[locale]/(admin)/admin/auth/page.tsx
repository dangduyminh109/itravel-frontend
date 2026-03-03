"use client";
import AdminLogin from "@/features/auth/components/AminLogin";

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-125 overflow-hidden px-10">
        <div className="max-w-200 h-115 rounded-lg border border-secondary flex overflow-hidden">
          <AdminLogin />
        </div>
      </div>
    </div>
  );
};

export default page;
