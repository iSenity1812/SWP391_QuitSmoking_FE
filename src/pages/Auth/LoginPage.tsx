// src/components/auth/LoginForm.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react"; // Thay đổi ArrowLeft thành ArrowRight cho Login

import { UsernameOrEmailInput } from "@/pages/Auth/components/login";
import { PasswordInput } from "@/pages/Auth/components/login"; // Sử dụng lại PasswordInput từ Register
import { SubmitButton } from "@/pages/Auth/components/login"; // Sử dụng lại SubmitButton
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const LoginForm: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameOrEmailValid, setIsUsernameOrEmailValid] = useState<boolean | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateUsernameOrEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(value);
    const isUsername = value.length >= 3; // Ví dụ: username tối thiểu 3 ký tự

    setIsUsernameOrEmailValid(isEmail || isUsername);
  };

  const validatePassword = (value: string) => {
    // Logic validation password đơn giản hơn cho Login (chỉ cần có ký tự)
    // Hoặc bạn có thể giữ nguyên logic password strength nếu muốn người dùng nhập password mạnh cả khi login
    setIsPasswordValid(value.length >= 8); // Đảm bảo password không trống
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Re-validate just in case (e.g., if user types then quickly clicks submit)
    validateUsernameOrEmail(usernameOrEmail);
    validatePassword(password);

    if (isUsernameOrEmailValid && isPasswordValid) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        // Handle successful login
        alert("Login successful!");
        // Redirect or perform other actions
      }, 1500);
    }
  };

  return (
    <motion.div
      className="md:col-span-3 border-2 border-emerald-400/80 rounded-xl shadow-lg bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 z-1"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring" }}
    >
      <Card className="form-card bg-white/80 dark:bg-slate-900/80">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login to Your Account</CardTitle>
          <CardDescription className="text-center">Welcome back! Please enter your details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <UsernameOrEmailInput
              value={usernameOrEmail}
              setValue={setUsernameOrEmail}
              isValid={isUsernameOrEmailValid}
              validate={validateUsernameOrEmail}
            />

            <PasswordInput
              password={password}
              setPassword={setPassword}
              isPasswordValid={isPasswordValid}
              validatePassword={validatePassword}
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              isPasswordValid={isPasswordValid}
              isEmailValid={isUsernameOrEmailValid}
            />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-500 hover:underline inline-flex items-center group">
              <ArrowRight size={16} className="mr-1" />
              Register here
              <motion.span
                initial={{ x: -5, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Sparkles size={12} />
              </motion.span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};


export default function LoginPage() {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Your journey to a smoke-free life begins here</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 items-center">
          {/* Phần bên trái (tùy chọn) - Nếu bạn muốn có ảnh/mô tả bên trái cho trang Login */}
          <motion.div
            className="hidden md:block md:col-span-2 "
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {/* Có thể thêm một hình ảnh hoặc text ở đây */}
          </motion.div>

          {/* Form đăng nhập chính */}
          <LoginForm />
        </div>
      </div>
    </motion.div>
  );
}