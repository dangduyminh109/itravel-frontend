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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import PasswordInput from "./PasswordInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/register.schema";

type RegisterSchema = z.infer<typeof registerSchema>;

const Register = ({
  handleChangeFrom,
}: {
  handleChangeFrom: (newAuthState: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterSchema) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex-1 flex p-3 items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full overflow-auto flex items-center"
        >
          <Card className="w-full border-none shadow-none ">
            <CardHeader className="px-3 py-1">
              <CardTitle className="text-center font-bold text-2xl">
                ĐĂNG KÝ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex flex-col gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <p className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <PasswordInput
                    id="password"
                    {...register("password")}
                    error={errors.password?.message}
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
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 p-3">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                size={"lg"}
              >
                Đăng Ký
              </Button>
              <Button
                variant="outline"
                className="w-full border-primary cursor-pointer"
                size={"lg"}
              >
                <FontAwesomeIcon icon={faGoogle} className="w-5 h-" />
                Đăng nhập với Google
              </Button>
              <div className="text-xs">
                Bạn đã có tài khoản?{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs cursor-pointer"
                  onClick={() => handleChangeFrom("login")}
                  type="button"
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
            Bạn đã có tài khoản? Hãy đăng nhập ngay để trải nghiệm những tính
            năng tuyệt vời của chúng tôi!
          </p>
          <Button
            variant="outline"
            className="mt-4 cursor-pointer bg-primary hover:text-foreground text-primary-foreground hover:bg-accent"
            onClick={() => handleChangeFrom("login")}
          >
            Đăng Nhập ngay
          </Button>
        </div>
      </div>
    </>
  );
};

export default Register;
