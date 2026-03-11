import { useState, forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  useFormError?: boolean;
  hasTitle?: boolean;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      error,
      className,
      id,
      useFormError = true,
      title = "Password",
      hasTitle = true,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Field className="gap-1">
        {hasTitle && <FieldLabel htmlFor={id || "password-input"}>{title}</FieldLabel>}
        <InputGroup>
          <InputGroupInput
            id={id || "password-input"}
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`${className ?? ""}`}
            placeholder="Enter password"
            {...props}
          />
          <InputGroupAddon align="inline-start">
            <FontAwesomeIcon
              className={"text-primary"}
              icon={showPassword ? faLock : faLock}
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Button
              type="button"
              className="bg-transparent hover:bg-transparent shadow-none text-primary px-2 cursor-pointer"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        {error && useFormError && (
          <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
            {error}
          </FieldDescription>
        )}
      </Field>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
