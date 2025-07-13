'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Cigarette, DollarSign, Package, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQuitPlan } from '@/context/QuitPlanContext'

interface FormData {
    initialSmokingAmount: string
    cigarettesPerPack: string
    costPerPack: string
}

interface FormErrors {
    initialSmokingAmount?: string
    cigarettesPerPack?: string
    costPerPack?: string
}

interface InputFieldProps {
    id: string
    label: React.ReactNode
    value: string
    onChange: (value: string) => void
    error?: string
    placeholder: string
    type?: string
    description: string
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    label,
    value,
    onChange,
    error,
    placeholder,
    type = 'text',
    description
}) => {
    // isValid chỉ là để hiển thị icon check, chỉ khi có giá trị và không có lỗi
    const [isValid, setIsValid] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        setIsValid(value.length > 0 && !error)
    }, [value, error])

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-foreground">
                {label}
            </Label>
            <div className="relative">
                <Input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={`text-lg transition-all duration-200 ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : isValid
                            ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                            : 'border-border focus:border-primary focus:ring-primary'
                        }`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                {isValid && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        <CheckCircle2 size={16} />
                    </div>
                )}
                {error && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                        <AlertCircle size={16} />
                    </div>
                )}
            </div>
            <p className="text-xs text-muted-foreground">
                {description}
            </p>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id={`${id}-error`}
                    className="text-sm text-red-500 flex items-center gap-1"
                    role="alert"
                >
                    <AlertCircle size={14} />
                    {error}
                </motion.p>
            )}
        </div>
    )
}

const CreatQuitPlanStep1 = ({ onNext }: { onNext: () => void }) => {
    const { formData, updateFormData } = useQuitPlan()

    // Khởi tạo userData từ formData trong context để persistence dữ liệu
    const [userData, setUserData] = useState<FormData>({
        initialSmokingAmount: String(formData.initialSmokingAmount || ''),
        cigarettesPerPack: String(formData.cigarettesPerPack || ''),
        costPerPack: String(formData.costPerPack || '')
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)

    const validateField = (name: keyof FormData, value: string): string | undefined => {
        if (!value.trim()) {
            return 'This field is required'
        }

        const numValue = parseFloat(value)

        if (isNaN(numValue) || numValue < 0) {
            return 'Please enter a valid positive number'
        }

        switch (name) {
            case 'initialSmokingAmount':
                if (numValue > 100) return 'Please enter a realistic number (max 100)'
                if (numValue === 0) return 'Please enter a number greater than 0'
                break
            case 'cigarettesPerPack':
                if (numValue > 50) return 'Please enter a realistic pack size (max 50)'
                if (numValue === 0) return 'Please enter a number greater than 0'
                break
            case 'costPerPack':
                if (numValue > 999999) return 'Please enter a realistic cost (max 999999VNĐ)'
                if (numValue === 0) return 'Please enter a cost greater than 0VNĐ'
                break
        }

        return undefined
    };

    const handleInputChange = (name: keyof FormData, value: string) => {
        setUserData(prev => ({ ...prev, [name]: value }))
        const error = validateField(name, value)
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    useEffect(() => {
        const hasErrors = Object.values(errors).some(error => error)
        const hasAllValues = Object.values(userData).every(value => value.trim())
        setIsFormValid(hasAllValues && !hasErrors)
    }, [userData, errors])

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: FormErrors = {}
        const convertedData: Partial<typeof formData> = {}
        const fieldKeys: (keyof FormData)[] = ['initialSmokingAmount', 'cigarettesPerPack', 'costPerPack'];

        fieldKeys.forEach((key) => {
            const value = userData[key];
            const error = validateField(key, value);
            if (error) {
                newErrors[key] = error;
            } else {
                const parsed = Number(value);
                if (isNaN(parsed)) {
                    newErrors[key] = 'Please enter a valid number';
                } else {
                    // Type-safe assignment
                    if (key === 'initialSmokingAmount') convertedData.initialSmokingAmount = parsed;
                    if (key === 'cigarettesPerPack') convertedData.cigarettesPerPack = parsed;
                    if (key === 'costPerPack') convertedData.costPerPack = parsed;
                }
            }
        });
        setErrors(newErrors)

        //if submission should proceed
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true)
            await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
            setIsLoading(false)
            console.log('Form submitted:', userData)
            updateFormData(convertedData) // lưu vào context
            onNext() // chuyển sang bước 2
        }
    }

    // Animation configurations - Force animations to work for testing
    const animationConfig = {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1.2 }
    }

    return (
        <div className="max-h-screen py-40 relative overflow-hidden
        bg-gradient-to-bl from-emerald-50 to-white dark:from-slate-900/99 dark:to-slate-800">
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-emerald-100 opacity-30 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-20 h-[300px] w-[300px] rounded-full bg-teal-100 opacity-30 blur-3xl pointer-events-none"></div>
            <div className="container mx-auto px-4 py-8">

                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                        {/* Left Column - Motivational Content */}
                        <motion.div
                            {...animationConfig}
                            className="space-y-8 lg:sticky lg:top-8 self-start"
                        >
                            <div className="space-y-6">
                                <motion.h1
                                    initial={{ opacity: 0, y: 60 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                    className="text-4xl lg:text-5xl font-bold text-foreground leading-tight pt-10"
                                >
                                    Take the first step to a
                                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                                        {" "}Smoke-Free Life
                                    </span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 60 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                                    className="text-xl text-slate-800 dark:text-slate-300 leading-relaxed"
                                >
                                    Improve your health starting today. We'll help you quit smoking with our personalized approach,
                                    calculate your savings and track your progress on your journey.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 60 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                                    className="flex flex-wrap gap-4"
                                >
                                    {[
                                        { icon: '💪', text: 'Personal tracking' },
                                        { icon: '💰', text: 'Save Money' },
                                        { icon: '🫁', text: 'Breathe Better' }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="text-sm font-medium text-foreground">{item.text}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            <SmokingIllustration />
                        </motion.div>

                        {/* Right Column - Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                        >
                            <div className="
                        bg-emerald-100/50 dark:bg-gray-900 rounded-2xl shadow-x1 border border-emerald-400 p-6 
                        items-center">
                                <div className="space-y-6">
                                    <div className="space-y-2 text-center">
                                        <h2 className="text-2xl font-bold text-foreground">Tell us about your smoking habits</h2>
                                        <p className="text-muted-foreground">
                                            The more honest you are, the better we can help you quit
                                        </p>
                                    </div>

                                    <form onSubmit={handleContinue} className="space-y-6" noValidate>
                                        <InputField
                                            id="initialSmokingAmount"
                                            label={
                                                <>
                                                    <Cigarette className="text-muted-foreground" />
                                                    Cigarettes per day
                                                </>
                                            }
                                            value={userData.initialSmokingAmount}
                                            onChange={(value) => handleInputChange('initialSmokingAmount', value)}
                                            error={errors.initialSmokingAmount}
                                            placeholder="20"
                                            type="number"
                                            description="Average number of cigarettes you smoke daily"
                                        />

                                        <InputField
                                            id="cigarettesPerPack"
                                            label={
                                                <>
                                                    <Package className="text-muted-foreground" />
                                                    Cigarettes per pack
                                                </>
                                            }
                                            value={userData.cigarettesPerPack}
                                            onChange={(value) => handleInputChange('cigarettesPerPack', value)}
                                            error={errors.cigarettesPerPack}
                                            placeholder="20"
                                            type="number"
                                            description='How many cigarettes are in one pack'
                                        />

                                        <InputField
                                            id="costPerPack"
                                            label={
                                                <>
                                                    <DollarSign className="text-muted-foreground" />
                                                    Cost per pack
                                                </>
                                            }
                                            value={userData.costPerPack}
                                            onChange={(value) => handleInputChange('costPerPack', value)}
                                            error={errors.costPerPack}
                                            placeholder="50000"
                                            type="number"
                                            description="Average price you pay for one pack"
                                        />
                                        <div className="pt-4 mb-5">
                                            <Button
                                                onClick={handleContinue}
                                                disabled={!isFormValid || isLoading}
                                                size="lg"
                                                className="w-full h-12 text-base font-medium group relative overflow-hidden 
                                                                            bg-emerald-500 hover:bg-emerald-500 active:bg-emerald-600 transition"
                                            >
                                                {isLoading ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                ) : (
                                                    <>
                                                        <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0 text-white">
                                                            Continue to Quit Plan
                                                        </span>
                                                        <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-emerald-100/30 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
                                                            <ChevronRight size={16} strokeWidth={2} className="text-emerald-100" aria-hidden="true" />
                                                        </i>
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {!isFormValid && (Object.values(userData).some(value => typeof value === 'string' && value.trim() !== '') || Object.values(errors).some(error => error)) && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-sm text-muted-foreground text-center mb-5"
                                            >
                                                Please fill in all fields correctly to continue
                                            </motion.p>
                                        )}

                                        <div className="text-center pt-2">
                                            <p className="text-xs text-muted-foreground">
                                                Your information is private and secure. We'll use this data only to create your personalized quit plan, calculate your potential savings and health improvements.
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
        </div>
    )
}

const quotes = [
    "The journey of a thousand miles begins with a single step.",
    "Quitting smoking is the best investment in yourself.",
    "Every cigarette you skip is a deposit into your dream.",
    "One day at a time, one victory at a time.",
    "Your future self will thank you for today’s decision.",
    "Cravings are temporary. Freedom is forever.",
];

const fadeVariants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

const SmokingIllustration = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance quotes every 5s
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="bg-gradient-to-br from-emerald-200 via-emerald-100 to-sky-100 
            dark:from-sky-400/50 dark:via-emerald-400/50 dark:to-emerald-500/50
             rounded-xl p-6 shadow-lg text-center max-w-xl mx-auto transition relative"
        >
            {/* Header */}
            <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-2">
                <Sparkles className="w-5 h-5 animate-pulse text-yellow-500 dark:text-yellow-300" />
                <span className="text-emerald-700 dark:text-emerald-200">Stay Inspired</span>
            </div>

            {/* Quote */}
            <div className="relative min-h-[80px] overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.blockquote
                        key={`quote-${currentIndex}`} // <--- Đã sửa: Thêm tiền tố 'quote-'
                        className="text-xl italic font-medium text-gray-800 dark:text-gray-100 absolute"
                        variants={fadeVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.6 }}
                    >
                        “{quotes[currentIndex]}”
                    </motion.blockquote>
                </AnimatePresence>
            </div>

            {/* Indicator dots */}
            <div className="mt-6 flex justify-center space-x-2">
                {quotes.map((_, index) => (
                    <button
                        key={`button-${index}`} // <--- Đã sửa: Thêm tiền tố 'button-'
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'bg-emerald-600 dark:bg-emerald-300 w-3 h-3'
                            : 'bg-emerald-300 dark:bg-emerald-500'
                            }`}
                        aria-label={`Show quote ${index + 1}`}
                    />
                ))}
            </div>
        </div>

    );
}

export default CreatQuitPlanStep1
