// src/components/auth/SubmitButton.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface RegSubmitButtonProps {
  isSubmitting: boolean;
  isDisabled: boolean;
}

export const RegSubmitButton: React.FC<RegSubmitButtonProps> = ({ isSubmitting, isDisabled }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
      <Button type="submit" className="w-full relative bg-gradient-to-r from-emerald-500 to-emerald-400/100 text-white font-bold overflow-hidden group" disabled={isDisabled}>
        <AnimatePresence mode="wait">
          {isSubmitting ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </motion.div>
          ) : (
            <motion.span
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Đăng ký
            </motion.span>
          )}
        </AnimatePresence>

        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/50 to-emerald-400/50 opacity-90 group-hover:opacity-100 transition-opacity"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </Button>
    </motion.div>
  );
};