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
import PasswordInput from "./PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPasswordSchema } from "../schemas/forgor-password.schema";

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = ({
  handleChangeFrom,
}: {
  handleChangeFrom: (newAuthState: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex-1 flex p-3 items-center w-max-200">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full overflow-auto flex items-center"
        >
          <Card className="w-full border-none shadow-none">
            <CardHeader className="px-3 py-1">
              <CardTitle className="text-center font-bold text-2xl">
                QUÊN MẬT KHẨU
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex flex-col gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <p className="text-red-500 text-xs ml-1">
                      {errors.email?.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex gap-2 items-end">
                    <div className="grid gap-1 flex-1">
                      <Label htmlFor="code">Mã xác nhận</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="Nhập mã xác nhận"
                        {...register("code")}
                      />
                    </div>
                    <Button type="button" className="w-22 cursor-pointer">
                      gửi mã
                    </Button>
                  </div>
                  {errors.code?.message && (
                    <p className="text-red-500 text-xs ml-1 mt-1">
                      {errors.code?.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <PasswordInput
                    id="newPassword"
                    {...register("newPassword")}
                    error={errors.newPassword?.message}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <PasswordInput
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
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
                Đổi mật khẩu
              </Button>
              <div className="text-xs">
                Bạn đã nhớ mật khẩu?{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs cursor-pointer"
                  type="button"
                  onClick={() => handleChangeFrom("login")}
                >
                  Đăng nhập ngay
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
      <div className="flex-1 p-3 bg-primary text-primary-foreground justify-center items-center hidden md:flex">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">
            Chào mừng bạn đến với iTravel!
          </h1>
          <p className="mt-2 text-center max-w-80 mx-auto">
            Bạn đã nhớ ra mật khẩu của mình? Hãy đăng nhập ngay để trải nghiệm
            những tính năng tuyệt vời của chúng tôi!
          </p>
          <Button
            variant="outline"
            className="mt-4 cursor-pointer bg-primary hover:text-foreground text-primary-foreground hover:bg-accent"
            onClick={() => handleChangeFrom("login")}
          >
            Đăng Nhập Ngay
          </Button>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
