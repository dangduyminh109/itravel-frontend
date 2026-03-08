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
import { registerSchema } from "../schemas/register.schema";
import { toast } from "sonner";
import { registerAction, sendOtpAction } from "../actions/auth.action";
import useOtpCooldown from "@/hooks/useOtpCooldown";
import { useLoadingStore } from "@/store/loading.store";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faEnvelope,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import PasswordInput from "./PasswordInput";
type RegisterSchema = z.infer<typeof registerSchema>;

const Register = ({
  handleChangeFrom,
}: {
  handleChangeFrom: (newAuthState: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const { start, clear, otpCooldown } = useOtpCooldown("otp_send_time");
  const { setLoading } = useLoadingStore();

  const onSubmit = async (data: RegisterSchema) => {
    setLoading(true);
    const result = await registerAction({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      otp: data.otp,
    });
    setLoading(false);
    if (result.success) {
      toast.success("Đăng ký thành công!");
      clear();
      handleChangeFrom("login");
    } else {
      toast.error(result.message || "Đăng ký thất bại.");
    }
  };

  async function handleSendOtp() {
    const isValid = await trigger("email");
    if (!isValid) return;

    const email = getValues("email");

    setLoading(true);
    const result = await sendOtpAction(email);
    setLoading(false);

    if (result.success) {
      toast.success(result.message || "Mã xác nhận đã được gửi.");
      start();
    } else {
      toast.error(result.message || "Gửi mã OTP thất bại. Vui lòng thử lại.");
    }
  }

  return (
    <>
      <div className="flex-1 p-3 items-center w-full h-full overflow-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="w-full border-none shadow-none ">
            <CardHeader className="px-3 py-1">
              <CardTitle className="text-center font-bold text-2xl">
                ĐĂNG KÝ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex flex-col gap-3">
                <div className="grid gap-1">
                  <Field className="gap-1">
                    <FieldLabel htmlFor="inline-start-input">Họ tên</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="fullName"
                        type="text"
                        placeholder="Full Name"
                        {...register("fullName")}
                      />
                      <InputGroupAddon align="inline-start">
                        <FontAwesomeIcon
                          className={"text-primary"}
                          icon={faAddressCard}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.fullName?.message && (
                      <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                        {errors.fullName.message}
                      </FieldDescription>
                    )}
                  </Field>
                </div>
                <div className="grid gap-1">
                  <Field className="gap-1">
                    <FieldLabel htmlFor="inline-start-input">Email</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="email"
                        type="text"
                        placeholder="Email"
                        {...register("email")}
                      />
                      <InputGroupAddon align="inline-start">
                        <FontAwesomeIcon
                          className={"text-primary"}
                          icon={faEnvelope}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.email?.message && (
                      <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                        {errors.email.message}
                      </FieldDescription>
                    )}
                  </Field>
                </div>
                <div className="grid gap-1">
                  <PasswordInput
                    id="password"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                </div>
                <div className="grid gap-1">
                  <PasswordInput
                    id="confirmPassword"
                    title="Xác nhận mật khẩu"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                  />
                </div>
                <div>
                  <div className="flex gap-2 items-end">
                    <div className="grid gap-1 flex-1">
                      <Field className="gap-1">
                        <FieldLabel htmlFor="inline-start-input">
                          Mã xác nhận
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="otp"
                            type="text"
                            placeholder="Nhập mã xác nhận"
                            {...register("otp")}
                          />
                          <InputGroupAddon align="inline-start">
                            <FontAwesomeIcon
                              className={"text-primary"}
                              icon={faShield}
                            />
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>
                    </div>
                    <Button
                      onClick={handleSendOtp}
                      disabled={otpCooldown > 0}
                      type="button"
                      className="w-22 cursor-pointer"
                    >
                      {otpCooldown > 0
                        ? `${Math.floor(otpCooldown / 60)
                            .toString()
                            .padStart(
                              2,
                              "0",
                            )}:${(otpCooldown % 60).toString().padStart(2, "0")}`
                        : "Gửi mã"}
                    </Button>
                  </div>
                  {errors.otp?.message && (
                    <p className="text-red-500 text-xs ml-1 mt-1">
                      {errors.otp?.message}
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
