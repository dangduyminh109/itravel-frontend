"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/store/loading.store";
import { adminLoginSchema } from "@/features/auth/schemas/admin-login.schema";
import PasswordInput from "@/features/auth/components/PasswordInput";
import { LoginAction } from "../actions/auth.action";
type AdminLoginSchema = z.infer<typeof adminLoginSchema>;
import { useLocale } from "next-intl";

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginSchema>({
    resolver: zodResolver(adminLoginSchema),
  });
  const router = useRouter();
  const { setLoading } = useLoadingStore();
  const locale = useLocale();

  const onSubmit = async (data: AdminLoginSchema) => {
    setLoading(true);
    const result = await LoginAction({
      identifier: data.username,
      password: data.password,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Đăng nhập thành công!");
      router.push(`/${locale}/admin/dashboard`);
    } else {
      toast.error(result.message || "Đăng nhập thất bại.");
    }
    setLoading(false);
  };
  return (
    <>
      <div className="flex-1 p-3 w-max-200">
        <form
          className="w-full h-full overflow-auto flex items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Card className="w-full border-none shadow-none">
            <CardHeader className="px-3 py-1">
              <CardTitle className="text-center font-bold text-2xl uppercase">
                Đăng nhập
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex flex-col gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Tên đăng nhập"
                    {...register("username")}
                  />
                  {errors.username?.message && (
                    <p className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mật khẩu</Label>
                  </div>
                  <PasswordInput
                    id="password"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 p-3">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                size={"lg"}
              >
                Đăng nhập
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
      <div className="flex-1 p-3 bg-primary text-primary-foreground justify-center items-center hidden md:flex">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">iTravel Admin</h1>
          <p className="mt-2 text-center max-w-80 mx-auto">
            Quản lý du lịch thông minh, hiệu quả và tiện lợi.
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
