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
import { loginSchema } from "../schemas/login.schema";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import LoginPopup from "./LoginPopup";
import { LoginAction } from "../actions/auth.action";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/store/loading.store";
type LoginSchema = z.infer<typeof loginSchema>;
import { useTranslations } from "next-intl";

const Login = ({
  handleChangeFrom,
}: {
  handleChangeFrom: (newAuthState: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const { setLoading } = useLoadingStore();
  const t = useTranslations("auth");

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    const result = await LoginAction({
      identifier: data.email,
      password: data.password,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Đăng nhập thành công!");
      handleChangeFrom("login");
      router.push("/vi");
    } else {
      toast.error(result.message || "Đăng nhập thất bại.");
    }
  };

  return (
    <>
      <div className="flex-1 p-3 w-max-200">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full overflow-auto flex items-center"
        >
          <Card className="w-full border-none shadow-none">
            <CardHeader className="px-3 py-1">
              <CardTitle className="text-center font-bold text-2xl uppercase">
                {t("login")}
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
                    <p className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Button
                      tabIndex={-1}
                      variant={"link"}
                      type="button"
                      className="ml-auto inline-block cursor-pointer text-sm underline-offset-4 hover:underline h-auto p-0"
                      onClick={() => handleChangeFrom("forgot")}
                    >
                      Quên mật khẩu?
                    </Button>
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
              <LoginPopup />
              <div className="text-xs">
                Bạn chưa có tài khoản?{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs cursor-pointer"
                  type="button"
                  onClick={() => handleChangeFrom("register")}
                >
                  Đăng ký ngay
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
            Bạn chưa có tài khoản? Hãy đăng ký ngay để trải nghiệm những tính
            năng tuyệt vời của chúng tôi!
          </p>
          <Button
            variant="outline"
            className="mt-4 cursor-pointer bg-primary hover:text-foreground text-primary-foreground hover:bg-accent"
            onClick={() => handleChangeFrom("register")}
          >
            Đăng ký ngay
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
