"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/store/loading.store";
import { adminLoginSchema } from "@/features/auth/schemas/admin-login.schema";
import { LoginAction } from "../actions/auth.action";
import { useLocale } from "next-intl";
import PasswordInput from "./PasswordInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useEffect } from "react";
import { useSidebarStore } from "@/store/sidebar.store";
type AdminLoginSchema = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginSchema>({
    resolver: zodResolver(adminLoginSchema),
  });
  const { setActiveItem } = useSidebarStore();
  const router = useRouter();
  const { setLoading } = useLoadingStore();
  const locale = useLocale();
  useEffect(() => {
    setLoading(false);
  }, []);
  const onSubmit = async (data: AdminLoginSchema) => {
    setLoading(true);
    const result = await LoginAction({
      identifier: data.username,
      password: data.password,
      isAdmin: true,
    });
    setLoading(false);
    
    if (result.success) {
      toast.success(result.message || "Đăng nhập thành công!");
      router.push(`/${locale}/admin/dashboard`);
      setActiveItem("dashboard");
    } else {
      toast.error(result.message || "Đăng nhập thất bại.");
    }
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
                  <Field className="gap-1">
                    <FieldLabel htmlFor="username">Tên đăng nhập</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="username"
                        type="text"
                        placeholder="Tên đăng nhập"
                        {...register("username")}
                      />
                      <InputGroupAddon align="inline-start">
                        <FontAwesomeIcon
                          className={"text-primary"}
                          icon={faUser}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.username?.message && (
                      <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                        {errors.username.message}
                      </FieldDescription>
                    )}
                  </Field>
                </div>
                <div className="grid gap-1">
                  <PasswordInput
                    title="Mật Khẩu"
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
