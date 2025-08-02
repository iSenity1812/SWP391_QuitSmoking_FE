import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, TrendingUp, Zap, Award, Activity, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthProgressCardProps {
    title: string;
    value: number;
    unit: string;
    description: string;
    icon: 'heart' | 'trending' | 'zap' | 'award' | 'activity' | 'brain';
    color: 'green' | 'blue' | 'purple' | 'amber' | 'red' | 'orange';
    className?: string;
}

const HealthProgressCard: React.FC<HealthProgressCardProps> = ({
    title,
    value,
    unit,
    description,
    icon,
    color,
    className = ''
}) => {
    const getIconComponent = () => {
        const iconClass = "w-6 h-6";

        switch (icon) {
            case 'heart':
                return <Heart className={iconClass} />;
            case 'trending':
                return <TrendingUp className={iconClass} />;
            case 'zap':
                return <Zap className={iconClass} />;
            case 'award':
                return <Award className={iconClass} />;
            case 'activity':
                return <Activity className={iconClass} />;
            case 'brain':
                return <Brain className={iconClass} />;
            default:
                return <Activity className={iconClass} />;
        }
    };

    const getColorClasses = () => {
        switch (color) {
            case 'green':
                return {
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    icon: 'text-green-500 dark:text-green-400',
                    value: 'text-green-500 dark:text-green-400'
                };
            case 'blue':
                return {
                    bg: 'bg-blue-100 dark:bg-blue-900/30',
                    icon: 'text-blue-500 dark:text-blue-400',
                    value: 'text-blue-500 dark:text-blue-400'
                };
            case 'purple':
                return {
                    bg: 'bg-purple-100 dark:bg-purple-900/30',
                    icon: 'text-purple-500 dark:text-purple-400',
                    value: 'text-purple-500 dark:text-purple-400'
                };
            case 'amber':
                return {
                    bg: 'bg-amber-100 dark:bg-amber-900/30',
                    icon: 'text-amber-500 dark:text-amber-400',
                    value: 'text-amber-500 dark:text-amber-400'
                };
            case 'red':
                return {
                    bg: 'bg-red-100 dark:bg-red-900/30',
                    icon: 'text-red-500 dark:text-red-400',
                    value: 'text-red-500 dark:text-red-400'
                };
            case 'orange':
                return {
                    bg: 'bg-orange-100 dark:bg-orange-900/30',
                    icon: 'text-orange-500 dark:text-orange-400',
                    value: 'text-orange-500 dark:text-orange-400'
                };
            default:
                return {
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    icon: 'text-green-500 dark:text-green-400',
                    value: 'text-green-500 dark:text-green-400'
                };
        }
    };

    const colorClasses = getColorClasses();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <motion.div
                            className={`w-12 h-12 rounded-full ${colorClasses.bg} flex items-center justify-center animate-pulse`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className={colorClasses.icon}>
                                {getIconComponent()}
                            </div>
                        </motion.div>
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
                        {title}
                    </h3>
                    <div className="space-y-1">
                        <motion.span
                            className={`text-2xl font-bold ${colorClasses.value}`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            {value}{unit}
                        </motion.span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default HealthProgressCard; 