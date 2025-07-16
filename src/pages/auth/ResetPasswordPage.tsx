import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wind } from "lucide-react";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";
import type { ResetPasswordRequest } from "@/types/auth";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isTokenChecking, setIsTokenChecking] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password requirements
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Token không hợp lệ");
      navigate("/forgot-password");
      return;
    }

    validateToken();
  }, [token, navigate]);

  const validateToken = async () => {
    try {
      const response = await authService.validateResetToken(token);
      setIsTokenValid(response.data);
    } catch (error) {
      console.error("Token validation error:", error);
      setIsTokenValid(false);
    } finally {
      setIsTokenChecking(false);
    }
  };

  const validatePassword = (value: string) => {
    const minLength = value.length >= 8;
    const uppercase = /[A-Z]/.test(value);
    const lowercase = /[a-z]/.test(value);
    const number = /[0-9]/.test(value);
    const special = /[^A-Za-z0-9]/.test(value);

    setHasMinLength(minLength);
    setHasUppercase(uppercase);
    setHasLowercase(lowercase);
    setHasNumber(number);
    setHasSpecial(special);

    setIsPasswordValid(minLength && uppercase && lowercase && number && special);

    // Also validate confirm password if it has a value
    if (confirmPassword) {
      setIsConfirmPasswordValid(confirmPassword === value);
    }
  };

  const validateConfirmPassword = (value: string) => {
    setIsConfirmPasswordValid(value === newPassword && value !== "");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid || !isConfirmPasswordValid) {
      toast.error("Vui lòng nhập mật khẩu hợp lệ và xác nhận mật khẩu");
      return;
    }

    setIsSubmitting(true);

    try {
      const request: ResetPasswordRequest = {
        token: token!,
        newPassword: newPassword
      };

      const response = await authService.resetPassword(request);

      if (response.status === 200) {
        setIsSuccess(true);
        toast.success("Mật khẩu đã được đặt lại thành công!");
      } else {
        toast.error(response.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isTokenChecking) {
    return (
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
          <p className="text-muted-foreground">Đang kiểm tra token...</p>
        </div>
      </motion.div>
    );
  }

  if (!isTokenValid) {
    return (
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full max-w-md text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Token không hợp lệ</h1>
          <p className="text-muted-foreground">
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.
          </p>
          <Link to="/forgot-password">
            <Button className="w-full">Yêu cầu link mới</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold text-primary mb-2">Thành công!</h1>
            <p className="text-muted-foreground">Mật khẩu đã được đặt lại</p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Card className="bg-white/80 dark:bg-slate-900/80 border-2 border-emerald-400/80">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Mật khẩu đã được đặt lại!</CardTitle>
                <CardDescription>
                  Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/login">
                  <Button className="w-full">Đăng nhập ngay</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 right-4">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-3 text-2xl font-black text-slate-800 dark:text-white">
            <Wind className="h-8 w-8 text-emerald-500" />
            <span className="text-xl font-bold">QuitTogether</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">Đặt lại mật khẩu</h1>
          <p className="text-muted-foreground">Nhập mật khẩu mới cho tài khoản của bạn</p>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <Card className="bg-white/80 dark:bg-slate-900/80 border-2 border-emerald-400/80">
            <CardHeader>
              <CardTitle className="text-xl text-center">Mật khẩu mới</CardTitle>
              <CardDescription className="text-center">
                Mật khẩu phải đáp ứng các yêu cầu bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      className={`pl-10 pr-10 ${isPasswordValid === false ? 'border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Yêu cầu mật khẩu:</p>
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {hasMinLength ? '✓' : '○'} Ít nhất 8 ký tự
                    </div>
                    <div className={`flex items-center ${hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {hasUppercase ? '✓' : '○'} Ít nhất 1 chữ hoa
                    </div>
                    <div className={`flex items-center ${hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {hasLowercase ? '✓' : '○'} Ít nhất 1 chữ thường
                    </div>
                    <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {hasNumber ? '✓' : '○'} Ít nhất 1 số
                    </div>
                    <div className={`flex items-center ${hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                      {hasSpecial ? '✓' : '○'} Ít nhất 1 ký tự đặc biệt
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`pl-10 pr-10 ${isConfirmPasswordValid === false ? 'border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {isConfirmPasswordValid === false && confirmPassword && (
                    <p className="text-sm text-red-500">Mật khẩu xác nhận không khớp</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isPasswordValid || !isConfirmPasswordValid || isSubmitting}
                >
                  {isSubmitting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 