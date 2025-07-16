import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wind } from "lucide-react";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";
import type { ForgotPasswordRequest } from "@/types/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailValid) {
      toast.error("Vui lòng nhập email hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      const request: ForgotPasswordRequest = { email: email.trim().toLowerCase() };
      const response = await authService.forgotPassword(request);

      if (response.status === 200) {
        setIsEmailSent(true);
        toast.success("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.");
      } else {
        toast.error(response.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
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
            <h1 className="text-4xl font-bold text-primary mb-2">Kiểm tra email</h1>
            <p className="text-muted-foreground">Chúng tôi đã gửi link đặt lại mật khẩu</p>
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
                <CardTitle className="text-xl">Email đã được gửi!</CardTitle>
                <CardDescription>
                  Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                      <ul className="space-y-1">
                        <li>• Link có hiệu lực trong 24 giờ</li>
                        <li>• Kiểm tra cả thư mục Spam nếu không thấy email</li>
                        <li>• Link sẽ tự động hết hạn sau khi sử dụng</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={() => {
                      setEmail("");
                      setIsEmailSent(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Gửi lại email
                  </Button>
                  
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Quay lại đăng nhập
                    </Button>
                  </Link>
                </div>
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
          <h1 className="text-4xl font-bold text-primary mb-2">Quên mật khẩu?</h1>
          <p className="text-muted-foreground">Nhập email để nhận link đặt lại mật khẩu</p>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <Card className="bg-white/80 dark:bg-slate-900/80 border-2 border-emerald-400/80">
            <CardHeader>
              <CardTitle className="text-xl text-center">Đặt lại mật khẩu</CardTitle>
              <CardDescription className="text-center">
                Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={handleEmailChange}
                      className={`pl-10 ${isEmailValid === false ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {isEmailValid === false && (
                    <p className="text-sm text-red-500">Email không hợp lệ</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isEmailValid || isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                </Button>
              </form>
            </CardContent>
            <CardContent className="pt-0">
              <div className="text-center">
                <Link to="/login" className="text-emerald-500 hover:underline inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 