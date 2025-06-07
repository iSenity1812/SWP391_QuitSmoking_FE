// src/components/auth/RegisterForm.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

import { AuthFormProgress } from "./AuthFormProgress";
import { UsernameInput } from "./UsernameInput";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { PasswordRequirements } from "./PasswordRequirements";
import { ConfirmPasswordInput } from "./ConfirmPasswordInput";
import { RegSubmitButton } from "./RegSubmitButton";

export const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password requirements
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);

  const validateUsername = (value: string) => {
    setIsUsernameValid(value.length >= 3);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const validatePassword = (value: string) => {
    // Check requirements
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

    // Calculate strength (0-100)
    let strength = 0;
    if (minLength) strength += 20;
    if (uppercase) strength += 20;
    if (lowercase) strength += 20;
    if (number) strength += 20;
    if (special) strength += 20;

    setPasswordStrength(strength);
    setIsPasswordValid(minLength && uppercase && lowercase && number && special);

    // Also validate confirm password if it has a value
    if (confirmPassword) {
      setIsConfirmPasswordValid(confirmPassword === value);
    }
  };

  const validateConfirmPassword = (value: string) => {
    setIsConfirmPasswordValid(value === password && value !== "");
  };

  const getFormProgress = () => {
    let validFields = 0;
    const totalFields = 4;

    if (isUsernameValid) validFields++;
    if (isEmailValid) validFields++;
    if (isPasswordValid) validFields++;
    if (isConfirmPasswordValid) validFields++;

    return (validFields / totalFields) * 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        // Handle successful registration
        alert("Registration successful!");
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
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Join us on your journey to quit smoking</CardDescription>
          <AuthFormProgress value={getFormProgress()} />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <UsernameInput
              username={username}
              setUsername={setUsername}
              isUsernameValid={isUsernameValid}
              validateUsername={validateUsername}
            />

            <EmailInput
              email={email}
              setEmail={setEmail}
              isEmailValid={isEmailValid}
              validateEmail={validateEmail}
            />

            <PasswordInput
              password={password}
              setPassword={setPassword}
              isPasswordValid={isPasswordValid}
              validatePassword={validatePassword}
            />
            <PasswordRequirements
              passwordStrength={passwordStrength}
              hasMinLength={hasMinLength}
              hasUppercase={hasUppercase}
              hasLowercase={hasLowercase}
              hasNumber={hasNumber}
              hasSpecial={hasSpecial}
            />

            <ConfirmPasswordInput
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isConfirmPasswordValid={isConfirmPasswordValid}
              validateConfirmPassword={validateConfirmPassword}
            />

            <RegSubmitButton
              isSubmitting={isSubmitting}
              isDisabled={
                !isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || isSubmitting
              }
            />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-500 hover:underline inline-flex items-center group">
              <ArrowRight size={12} className="mr-1" />
              Login here
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