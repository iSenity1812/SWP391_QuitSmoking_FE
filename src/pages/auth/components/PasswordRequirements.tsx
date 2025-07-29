// src/components/auth/PasswordRequirements.tsx
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";

interface PasswordRequirementsProps {
  passwordStrength: number;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  passwordStrength,
  hasMinLength,
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSpecial,
}) => {
  return (
    <div className="space-y-2 mt-2">
      <div className="flex justify-between items-center text-xs">
        {/* chuyen sang tieng viet */}
        <span>
          Mức độ mạnh của mật khẩu: {passwordStrength}%
        </span>
        <span
          className={`font-medium ${passwordStrength < 40
            ? "text-destructive"
            : passwordStrength < 80
              ? "text-yellow-500"
              : "text-emerald-500"
            }`}
        >
          {passwordStrength < 40 ? "Weak" : passwordStrength < 80 ? "Medium" : "Strong"}
        </span>
      </div>
      <Progress value={passwordStrength} className="h-1" />

      <div className="grid grid-cols-2 gap-1 text-xs mt-2">
        <div className="flex items-center gap-1">
          {hasMinLength ? (
            <Check className="text-emerald-500" size={12} />
          ) : (
            <X className="text-red-500" size={12} />
          )}
          <span className={hasMinLength ? "text-emerald-500" : "text-red-500"}>
            Ít nhất 8 ký tự
          </span>
        </div>
        <div className="flex items-center gap-1">
          {hasUppercase ? (
            <Check className="text-emerald-500" size={12} />
          ) : (
            <X className="text-red-500" size={12} />
          )}
          <span className={hasUppercase ? "text-emerald-500" : "text-red-500"}>
            Chữ hoa
          </span>
        </div>
        <div className="flex items-center gap-1">
          {hasLowercase ? (
            <Check className="text-emerald-500" size={12} />
          ) : (
            <X className="text-red-500" size={12} />
          )}
          <span className={hasLowercase ? "text-emerald-500" : "text-red-500"}>
            Chữ thường
          </span>
        </div>
        <div className="flex items-center gap-1">
          {hasNumber ? (
            <Check className="text-emerald-500" size={12} />
          ) : (
            <X className="text-red-500" size={12} />
          )}
          <span className={hasNumber ? "text-emerald-500" : "text-red-500"}>
            Số
          </span>
        </div>
        <div className="flex items-center gap-1">
          {hasSpecial ? (
            <Check className="text-emerald-500" size={12} />
          ) : (
            <X className="text-red-500" size={12} />
          )}
          <span className={hasSpecial ? "text-emerald-500" : "text-red-500"}>
            Ký tự đặc biệt
          </span>
        </div>
      </div>
    </div>
  );
};