"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HealthMetricCardProps {
    percent: number;
    title: string;
    description: string;
    color?: "green" | "blue" | "purple" | "orange" | "pink" | "cyan" | "yellow";
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
    percent,
    title,
    description,
    color = "green"
}) => {
    const colorClasses = {
        green: {
            circle: "text-emerald-500",
            text: "text-emerald-700",
            bg: "bg-emerald-50"
        },
        blue: {
            circle: "text-sky-500",
            text: "text-sky-700",
            bg: "bg-sky-50"
        },
        purple: {
            circle: "text-purple-500",
            text: "text-purple-700",
            bg: "bg-purple-50"
        },
        orange: {
            circle: "text-orange-500",
            text: "text-orange-700",
            bg: "bg-orange-50"
        },
        pink: {
            circle: "text-pink-500",
            text: "text-pink-700",
            bg: "bg-pink-50"
        },
        cyan: {
            circle: "text-cyan-500",
            text: "text-cyan-700",
            bg: "bg-cyan-50"
        },
        yellow: {
            circle: "text-yellow-500",
            text: "text-yellow-700",
            bg: "bg-yellow-50"
        }
    };

    const currentColor = colorClasses[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className={cn("border-0 shadow-lg", currentColor.bg)}>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Circular Progress */}
                        <div className="relative flex items-center justify-center w-24 h-24">
                            <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                                {/* Background circle */}
                                <circle
                                    className="text-gray-200"
                                    strokeWidth="6"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="42"
                                    cx="48"
                                    cy="48"
                                />
                                {/* Progress circle */}
                                <circle
                                    className={currentColor.circle}
                                    strokeWidth="6"
                                    strokeDasharray={264}
                                    strokeDashoffset={264 - (264 * percent) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="42"
                                    cx="48"
                                    cy="48"
                                />
                            </svg>
                            <span className={cn("text-xl font-bold", currentColor.text)}>
                                {percent}%
                            </span>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default HealthMetricCard; 