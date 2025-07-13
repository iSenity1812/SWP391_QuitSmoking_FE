"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Square, RotateCcw, Music, Volume2, VolumeX, ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BreathingPhase = "inhale" | "hold-in" | "exhale" | "hold-out"
type ExerciseScreen = "intro" | "pre-start" | "active"

interface MusicTrack {
    id: string
    name: string
    url: string
    icon: string
}

const musicTracks: MusicTrack[] = [
    { id: "option1", name: "Âm thanh 1", url: "/audio/option1.mp3", icon: "🌿" },
    { id: "option2", name: "Âm thanh 2", url: "/audio/option2.mp3", icon: "🧘" },
]

const phaseConfig = {
    inhale: {
        duration: 4000,
        label: "Hít Vào",
        instruction: "Hít vào qua mũi một cách chậm rãi",
        color: "from-blue-400 to-cyan-500",
    },
    "hold-in": {
        duration: 4000,
        label: "Giữ",
        instruction: "Giữ hơi thở trong 4 giây",
        color: "from-purple-400 to-indigo-500",
    },
    exhale: {
        duration: 4000,
        label: "Thở Ra",
        instruction: "Thở ra qua miệng một cách từ từ",
        color: "from-emerald-400 to-teal-500",
    },
    "hold-out": {
        duration: 4000,
        label: "Tạm Dừng",
        instruction: "Tạm dừng trước khi hít vào tiếp",
        color: "from-amber-400 to-orange-500",
    },
}

export function DeepBreathingExercise({ onClose }: { onClose?: () => void }) {
    const [currentScreen, setCurrentScreen] = useState<ExerciseScreen>("intro")
    const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale")
    const [isActive, setIsActive] = useState(false)
    const [cycleCount, setCycleCount] = useState(0)
    const [sessionTime, setSessionTime] = useState(0)
    const [progress, setProgress] = useState(0)
    const [selectedMusic, setSelectedMusic] = useState<string>("none")
    const [showMusicSelector, setShowMusicSelector] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    const phaseTimerRef = useRef<NodeJS.Timeout | null>(null)
    const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)
    const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const phases: BreathingPhase[] = ["inhale", "hold-in", "exhale", "hold-out"]

    useEffect(() => {
        if (isActive) {
            startPhase()
            startSessionTimer()
        } else {
            clearAllTimers()
        }

        return () => clearAllTimers()
    }, [isActive, currentPhase])

    useEffect(() => {
        if (selectedMusic !== "none" && !isMuted) {
            playMusic()
        } else {
            stopMusic()
        }
    }, [selectedMusic, isMuted])

    const clearAllTimers = () => {
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
        if (sessionTimerRef.current) clearInterval(sessionTimerRef.current)
        if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }

    const startPhase = () => {
        const phase = phaseConfig[currentPhase]
        setProgress(0)

        // Progress animation
        const progressInterval = 50
        const progressStep = (progressInterval / phase.duration) * 100
        progressTimerRef.current = setInterval(() => {
            setProgress((prev) => {
                const next = prev + progressStep
                return next >= 100 ? 100 : next
            })
        }, progressInterval)

        // Phase transition
        phaseTimerRef.current = setTimeout(() => {
            const currentIndex = phases.indexOf(currentPhase)
            const nextIndex = (currentIndex + 1) % phases.length

            if (nextIndex === 0) {
                setCycleCount((prev) => prev + 1)
            }

            setCurrentPhase(phases[nextIndex])
        }, phase.duration)
    }

    const startSessionTimer = () => {
        sessionTimerRef.current = setInterval(() => {
            setSessionTime((prev) => prev + 1)
        }, 1000)
    }

    const playMusic = () => {
        const track = musicTracks.find((t) => t.id === selectedMusic)
        if (track && track.url) {
            if (audioRef.current) {
                audioRef.current.pause()
            }
            audioRef.current = new Audio(track.url)
            audioRef.current.loop = true
            audioRef.current.volume = 0.3
            audioRef.current.play().catch(() => {
                // Handle autoplay restrictions
                console.log("Audio autoplay prevented")
            })
        }
    }

    const stopMusic = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current = null
        }
    }

    const handleStart = () => {
        setIsActive(true)
        setCurrentScreen("active")
        setCycleCount(0)
        setSessionTime(0)
    }

    const handleStop = () => {
        setIsActive(false)
        clearAllTimers()
        stopMusic()
        setCurrentScreen("intro")
        setCurrentPhase("inhale")
        setProgress(0)
    }

    const handleRestart = () => {
        setIsActive(false)
        clearAllTimers()
        setCycleCount(0)
        setSessionTime(0)
        setCurrentPhase("inhale")
        setProgress(0)
        setTimeout(() => {
            setIsActive(true)
        }, 100)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const getCircleScale = () => {
        switch (currentPhase) {
            case "inhale":
                return 1.5
            case "hold-in":
                return 1.5
            case "exhale":
                return 0.8
            case "hold-out":
                return 0.8
            default:
                return 1
        }
    }

    const renderIntroScreen = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
        >
            <div className="space-y-4 mb-20">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-8xl mb-6"
                >
                    🧘‍♀️
                </motion.div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Bài Tập Thở Sâu</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Làm dịu cơ thể và tâm trí của bạn. Bài tập thở này giúp giảm cơn thèm thuốc và lo âu thông qua việc hướng dẫn thở có ý thức
                </p>
            </div>

            <div className="space-y-4 max-w-xl mx-auto">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700">
                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">Quy trình thở:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                            <span>Hít vào (4 giây)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                            <span>Giữ hơi (4 giây)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span>Thở ra (4 giây)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <span>Tạm dừng (4 giây)</span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => setCurrentScreen("pre-start")}
                    className="w-full py-4 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                    <Play className="w-5 h-5 mr-2" />
                    Bắt Đầu Luyện Tập
                </Button>
            </div>
        </motion.div>
    )

    const renderPreStartScreen = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
        >
            <div className="space-y-4">
                <div className="text-6xl mb-4">🌟</div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Sẵn Sàng Bắt Đầu?</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Hãy tìm một tư thế thoải mái và nhấn nút bắt đầu khi bạn đã sẵn sàng thở cùng chúng tôi
                </p>
            </div>

            <div className="space-y-4 max-w-lg mx-auto mt-50">
                <Button
                    onClick={handleStart}
                    className="w-full py-4 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                    Bắt Đầu Ngay
                </Button>
                <Button onClick={() => setCurrentScreen("intro")} variant="outline" className="w-full py-3">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay Lại
                </Button>
            </div>
        </motion.div>
    )

    const renderActiveScreen = () => {
        const phase = phaseConfig[currentPhase]

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative h-full flex flex-col"
            >
                {/* Header Controls */}
                <div className="flex justify-center items-center mb-8">
                    {/* Session Info */}
                    <div className="text-center">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Chu kỳ: {cycleCount} • Thời gian: {formatTime(sessionTime)}
                        </div>
                    </div>
                </div>

                {/* Main Breathing Area */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                    {/* Phase Label */}
                    <motion.div
                        key={currentPhase}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-2 mb-15"
                    >
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{phase.label}</h2>
                        <p className="text-slate-600 dark:text-slate-300">{phase.instruction}</p>
                    </motion.div>

                    {/* Breathing Circle */}
                    <div className="relative">
                        {/* Progress Ring */}
                        <svg className="w-80 h-80 -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * progress) / 100}
                                className="transition-all duration-100"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" className="text-emerald-400" stopColor="currentColor" />
                                    <stop offset="100%" className="text-teal-500" stopColor="currentColor" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Breathing Circle */}
                        <motion.div
                            animate={{
                                scale: getCircleScale(),
                            }}
                            transition={{
                                duration: currentPhase.includes("hold") ? 0 : 4,
                                ease: "easeInOut",
                            }}
                            className={cn(
                                "absolute inset-0 m-auto w-45 h-45 rounded-full",
                                "bg-gradient-to-br shadow-2xl",
                                phase.color,
                            )}
                            style={{
                                filter: "blur(1px)",
                            }}
                        />

                        {/* Center Content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                className="text-6xl"
                            >
                                🧘‍♀️
                            </motion.div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 mt-8">
                        <Button
                            onClick={handleRestart}
                            variant="outline"
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Bắt Đầu Lại
                        </Button>

                        {/* Stop Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleStop}
                            className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                        >
                            <Square className="w-4 h-4" />
                        </Button>

                        {/* Music Control */}
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setShowMusicSelector(!showMusicSelector)}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                            >
                                <Music className="w-4 h-4" />
                            </Button>

                            <AnimatePresence>
                                {showMusicSelector && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-full mb-2 left-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border p-2 min-w-48 z-10"
                                    >
                                        {musicTracks.map((track) => (
                                            <button
                                                key={track.id}
                                                onClick={() => {
                                                    setSelectedMusic(track.id)
                                                    setShowMusicSelector(false)
                                                }}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2",
                                                    selectedMusic === track.id && "bg-emerald-100 dark:bg-emerald-900/30",
                                                )}
                                            >
                                                <span>{track.icon}</span>
                                                <span className="text-sm">{track.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {selectedMusic !== "none" && (
                            <Button
                                onClick={() => setIsMuted(!isMuted)}
                                variant="outline"
                                size="icon"
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6 relative">
            <div>
                <div className="p-8">
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    )}

                    <AnimatePresence mode="wait">
                        {currentScreen === "intro" && renderIntroScreen()}
                        {currentScreen === "pre-start" && renderPreStartScreen()}
                        {currentScreen === "active" && renderActiveScreen()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
