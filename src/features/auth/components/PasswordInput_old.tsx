import { useState, forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  useFormError?: boolean;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, className, useFormError = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`pr-10 ${className ?? ""}`}
            placeholder="Enter password"
            {...props}
          />

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="w-4 h-4"
            />
          </button>
        </div>
        {error && useFormError && (
          <p className="text-red-500 text-xs mt-1 ml-1 max-w-80">{error}</p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
