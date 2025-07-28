"use client"

import { useState, useCallback, useEffect } from "react"
import { TaskService } from "@/services/taskService"
import type { TipResponseDTO, QuizResponseDTO } from "@/types/task"
import { toast } from "react-toastify";

// Định nghĩa lại TaskState để phù hợp với logic FE
export interface TaskState {
    currentTask: {
        id: number; // Task ID ảo, có thể là 0 hoặc một giá trị cố định nếu không lưu DB
        type: 'QUIZ' | 'TIP' | null;
        quizzes?: QuizResponseDTO[];
        tips?: TipResponseDTO[];
    } | null;
    isLoading: boolean;
    error: string | null;
    completedTasks: number[]; // Vẫn theo dõi các task ID đã hoàn thành (nếu có)
    stats: TaskStats;
    // Thêm các state để quản lý phiên
    allAvailableQuizzes: QuizResponseDTO[];
    allAvailableTips: TipResponseDTO[];
    completedSessionQuizIds: string[]; // UUIDs của quizzes đã làm trong phiên
    completedSessionTipIds: string[];   // UUIDs của tips đã làm trong phiên
    previousTaskType: 'QUIZ' | 'TIP' | null; // Để tránh trùng lặp loại task
    currentQuizIndex: number; // Chỉ số câu hỏi hiện tại trong 5 câu quiz
    quizResults: Map<string, boolean>; // Kết quả đúng/sai của từng quiz trong task hiện tại
    totalCorrectAnswers: number; // Số câu trả lời đúng trong task quiz hiện tại
    isDataLoaded: boolean; // Flag để kiểm tra data đã được load chưa
}

export interface TaskStats {
    totalCompleted: number;
    quizzesCompleted: number;
    tipsCompleted: number;
    correctAnswers: number;
    totalQuizAttempts: number; // Tổng số câu hỏi quiz đã làm
    accuracy: number;
    streak: number;
}

// Giả định một Task ID cố định cho FE nếu không lưu DB
const FE_TASK_ID = 1;

export function useTask() {
    const [state, setState] = useState<TaskState>(() => {
        // Load stats from localStorage on initial mount
        const savedStats = localStorage.getItem("taskStats");
        const savedCompleted = localStorage.getItem("completedTasks");

        let initialStats: TaskStats = {
            totalCompleted: 0,
            quizzesCompleted: 0,
            tipsCompleted: 0,
            correctAnswers: 0,
            totalQuizAttempts: 0,
            accuracy: 0,
            streak: 0,
        };
        let initialCompletedTasks: number[] = [];

        if (savedStats) {
            try {
                initialStats = JSON.parse(savedStats);
            } catch (error) {
                console.error("Error loading task stats:", error);
            }
        }

        if (savedCompleted) {
            try {
                initialCompletedTasks = JSON.parse(savedCompleted);
            } catch (error) {
                console.error("Error loading completed tasks:", error);
            }
        }

        return {
            currentTask: null,
            isLoading: false,
            error: null,
            completedTasks: initialCompletedTasks,
            stats: initialStats,
            allAvailableQuizzes: [],
            allAvailableTips: [],
            completedSessionQuizIds: [],
            completedSessionTipIds: [],
            previousTaskType: null,
            currentQuizIndex: 0,
            quizResults: new Map(),
            totalCorrectAnswers: 0,
            isDataLoaded: false,
        };
    });

    // Save stats to localStorage whenever they change
    const saveStats = useCallback((newStats: TaskStats, newCompletedTasks: number[]) => {
        localStorage.setItem("taskStats", JSON.stringify(newStats));
        localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks));
    }, []);

    // Load all quizzes and tips on component mount
    useEffect(() => {
        const fetchAllContent = async () => {
            setState((prev: TaskState) => ({ ...prev, isLoading: true, error: null }));
            try {
                const quizzes = await TaskService.getAllQuizzes();
                const tips = await TaskService.getAllTips();
                setState((prev: TaskState) => ({
                    ...prev,
                    allAvailableQuizzes: quizzes,
                    allAvailableTips: tips,
                    isLoading: false,
                    isDataLoaded: true,
                }));
            } catch (err: unknown) {
                setState((prev: TaskState) => ({
                    ...prev,
                    error: err instanceof Error ? err.message : "Failed to load all quizzes and tips.",
                    isLoading: false,
                }));
                toast.error(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu thử thách.");
            }
        };
        fetchAllContent();
    }, []); const generateNewTask = useCallback(async () => {
        setState((prev: TaskState) => {
            // Kiểm tra xem data đã được load chưa
            if (!prev.isDataLoaded || (prev.allAvailableQuizzes.length === 0 && prev.allAvailableTips.length === 0)) {
                return {
                    ...prev,
                    isLoading: !prev.isDataLoaded, // Chỉ set loading nếu data chưa load
                    error: prev.isDataLoaded ? "Không có dữ liệu quiz hoặc tip trong hệ thống" : null,
                    currentTask: null,
                };
            }

            const availableQuizzes = prev.allAvailableQuizzes.filter(
                (q: QuizResponseDTO) => !prev.completedSessionQuizIds.includes(q.quizId)
            );
            const availableTips = prev.allAvailableTips.filter(
                (t: TipResponseDTO) => !prev.completedSessionTipIds.includes(t.tipId)
            );

            let nextTaskType: 'QUIZ' | 'TIP' | null = null;
            const hasAvailableQuizzes = availableQuizzes.length >= 5; // Cần ít nhất 5 quiz cho 1 task
            const hasAvailableTips = availableTips.length >= 2;     // Cần ít nhất 2 tips cho 1 task

            // Logic ưu tiên chọn loại task khác với lần trước
            if (prev.previousTaskType === 'QUIZ' && hasAvailableTips) {
                nextTaskType = 'TIP';
            } else if (prev.previousTaskType === 'TIP' && hasAvailableQuizzes) {
                nextTaskType = 'QUIZ';
            } else if (hasAvailableQuizzes && hasAvailableTips) {
                nextTaskType = Math.random() < 0.5 ? 'QUIZ' : 'TIP';
            } else if (hasAvailableQuizzes) {
                nextTaskType = 'QUIZ';
            } else if (hasAvailableTips) {
                nextTaskType = 'TIP';
            } else {
                // Nếu không còn task nào không trùng lặp, reset phiên
                toast.info("Bạn đã hoàn thành tất cả các thử thách duy nhất trong phiên này. Bắt đầu lại từ đầu.");
                // Reset session và tạo task mới từ toàn bộ danh sách
                const resetAvailableQuizzes = prev.allAvailableQuizzes;
                const resetAvailableTips = prev.allAvailableTips;

                // Kiểm tra xem có đủ dữ liệu để reset không
                if (resetAvailableQuizzes.length === 0 && resetAvailableTips.length === 0) {
                    return {
                        ...prev,
                        isLoading: false,
                        error: "Không có dữ liệu quiz hoặc tip trong hệ thống",
                        currentTask: null,
                    };
                }

                // Chọn task type ngẫu nhiên
                const newTaskType = resetAvailableQuizzes.length >= 5 && resetAvailableTips.length >= 2
                    ? (Math.random() < 0.5 ? 'QUIZ' : 'TIP')
                    : resetAvailableQuizzes.length >= 5 ? 'QUIZ' : 'TIP';

                if (newTaskType === 'QUIZ' && resetAvailableQuizzes.length >= 5) {
                    const selectedQuizzes: QuizResponseDTO[] = [];
                    const tempQuizzes = [...resetAvailableQuizzes];
                    for (let i = 0; i < 5; i++) {
                        const randomIndex = Math.floor(Math.random() * tempQuizzes.length);
                        selectedQuizzes.push(tempQuizzes.splice(randomIndex, 1)[0]);
                    }

                    return {
                        ...prev,
                        completedSessionQuizIds: selectedQuizzes.map(q => q.quizId),
                        completedSessionTipIds: [],
                        previousTaskType: 'QUIZ',
                        currentTask: {
                            id: FE_TASK_ID,
                            type: 'QUIZ',
                            quizzes: selectedQuizzes,
                        },
                        currentQuizIndex: 0,
                        quizResults: new Map(),
                        totalCorrectAnswers: 0,
                        isLoading: false,
                        error: null,
                    };
                } else if (newTaskType === 'TIP' && resetAvailableTips.length >= 2) {
                    const selectedTips: TipResponseDTO[] = [];
                    const tempTips = [...resetAvailableTips];
                    for (let i = 0; i < 2; i++) {
                        const randomIndex = Math.floor(Math.random() * tempTips.length);
                        selectedTips.push(tempTips.splice(randomIndex, 1)[0]);
                    }

                    return {
                        ...prev,
                        completedSessionQuizIds: [],
                        completedSessionTipIds: selectedTips.map(t => t.tipId),
                        previousTaskType: 'TIP',
                        currentTask: {
                            id: FE_TASK_ID,
                            type: 'TIP',
                            tips: selectedTips,
                        },
                        isLoading: false,
                        error: null,
                    };
                }

                // Fallback nếu không có đủ data để tạo task ngay cả sau khi reset
                return {
                    ...prev,
                    completedSessionQuizIds: [],
                    completedSessionTipIds: [],
                    previousTaskType: null,
                    isLoading: false,
                    error: `Không có đủ dữ liệu để tạo thử thách. Cần ít nhất ${resetAvailableQuizzes.length < 5 ? '5 quiz' : '2 tip'}.`,
                    currentTask: null,
                };
            }

            try {
                if (nextTaskType === 'QUIZ') {
                    // Chọn 5 quiz ngẫu nhiên từ danh sách availableQuizzes
                    const selectedQuizzes: QuizResponseDTO[] = [];
                    const tempAvailableQuizzes = [...availableQuizzes]; // Tạo bản sao để tránh sửa đổi mảng gốc
                    for (let i = 0; i < 5; i++) {
                        if (tempAvailableQuizzes.length === 0) {
                            // Xử lý trường hợp không đủ quiz không trùng lặp
                            toast.warn("Không đủ quiz không trùng lặp. Đang chọn lại từ đầu.");
                            // Reset session quiz IDs và thử lại
                            return {
                                ...prev,
                                completedSessionQuizIds: [],
                                isLoading: false,
                                error: null,
                                currentTask: null,
                            };
                        }
                        const randomIndex = Math.floor(Math.random() * tempAvailableQuizzes.length);
                        selectedQuizzes.push(tempAvailableQuizzes.splice(randomIndex, 1)[0]);
                    }

                    return {
                        ...prev,
                        currentTask: {
                            id: FE_TASK_ID, // Task ID cố định cho FE
                            type: 'QUIZ',
                            quizzes: selectedQuizzes,
                        },
                        currentQuizIndex: 0,
                        quizResults: new Map(),
                        totalCorrectAnswers: 0,
                        previousTaskType: 'QUIZ',
                        isLoading: false,
                    };
                } else if (nextTaskType === 'TIP') {
                    // Chọn 2 tip ngẫu nhiên từ danh sách availableTips
                    const selectedTips: TipResponseDTO[] = [];
                    const tempAvailableTips = [...availableTips]; // Tạo bản sao
                    for (let i = 0; i < 2; i++) {
                        if (tempAvailableTips.length === 0) {
                            // Xử lý trường hợp không đủ tip không trùng lặp
                            toast.warn("Không đủ tip không trùng lặp. Đang chọn lại từ đầu.");
                            // Reset session tip IDs và thử lại
                            return {
                                ...prev,
                                completedSessionTipIds: [],
                                isLoading: false,
                                error: null,
                                currentTask: null,
                            };
                        }
                        const randomIndex = Math.floor(Math.random() * tempAvailableTips.length);
                        selectedTips.push(tempAvailableTips.splice(randomIndex, 1)[0]);
                    }

                    return {
                        ...prev,
                        currentTask: {
                            id: FE_TASK_ID, // Task ID cố định cho FE
                            type: 'TIP',
                            tips: selectedTips,
                        },
                        previousTaskType: 'TIP',
                        isLoading: false,
                    };
                }
            } catch (err: unknown) {
                return {
                    ...prev,
                    error: err instanceof Error ? err.message : "Failed to generate task",
                    isLoading: false
                };
            }

            return { ...prev, isLoading: false };
        });
    }, []);


    const handleQuizAnswer = useCallback((quizId: string, selectedOptionId: number) => {
        setState((prev: TaskState) => {
            if (!prev.currentTask || prev.currentTask.type !== 'QUIZ' || !prev.currentTask.quizzes) {
                return prev;
            }

            const currentQuiz = prev.currentTask.quizzes[prev.currentQuizIndex];
            if (!currentQuiz || currentQuiz.quizId !== quizId) {
                return prev; // Đảm bảo đang trả lời đúng quiz hiện tại
            }

            const selectedOption = currentQuiz.options.find((opt: { optionId: number; correct: boolean }) => opt.optionId === selectedOptionId);
            const isCorrect = selectedOption?.correct || false;

            const newQuizResults = new Map(prev.quizResults);
            newQuizResults.set(quizId, isCorrect);

            const newTotalCorrectAnswers = prev.totalCorrectAnswers + (isCorrect ? 1 : 0);

            // Cập nhật completedSessionQuizIds ngay sau khi trả lời mỗi câu (tránh duplicate)
            const newCompletedSessionQuizIds = prev.completedSessionQuizIds.includes(quizId)
                ? prev.completedSessionQuizIds
                : [...prev.completedSessionQuizIds, quizId];

            return {
                ...prev,
                quizResults: newQuizResults,
                totalCorrectAnswers: newTotalCorrectAnswers,
                completedSessionQuizIds: newCompletedSessionQuizIds,
                // Không tăng currentQuizIndex ở đây, để QuizTaskComponent quản lý
            };
        });
    }, []);

    const markQuizTaskCompleted = useCallback(() => {
        setState((prev: TaskState) => {
            if (!prev.currentTask || prev.currentTask.type !== 'QUIZ' || !prev.currentTask.quizzes) {
                return prev;
            }

            const newStats = { ...prev.stats };
            newStats.totalCompleted += 1;
            newStats.quizzesCompleted += 1;
            newStats.correctAnswers += prev.totalCorrectAnswers;
            newStats.totalQuizAttempts += prev.currentTask.quizzes.length; // Luôn là 5 câu

            // Cập nhật độ chính xác
            if (newStats.totalQuizAttempts > 0) {
                newStats.accuracy = (newStats.correctAnswers / newStats.totalQuizAttempts) * 100;
            } else {
                newStats.accuracy = 0;
            }

            // Cập nhật streak (logic đơn giản: nếu trả lời đúng ít nhất 3/5 câu thì tăng streak)
            if (prev.totalCorrectAnswers >= 3) { // Ví dụ: cần ít nhất 3/5 câu đúng để tính streak
                newStats.streak += 1;
            } else {
                newStats.streak = 0; // Reset streak nếu không đạt
            }

            const newCompletedTasks = [...prev.completedTasks, FE_TASK_ID]; // Đánh dấu task ID đã hoàn thành
            saveStats(newStats, newCompletedTasks);

            return {
                ...prev,
                stats: newStats,
                completedTasks: newCompletedTasks,
                currentTask: null, // Xóa task hiện tại sau khi hoàn thành
            };
        });
        toast.success("Chúc mừng! Bạn đã hoàn thành thử thách Quiz!");
    }, [saveStats]);


    const markTipTaskCompleted = useCallback(() => {
        setState((prev: TaskState) => {
            if (!prev.currentTask || prev.currentTask.type !== 'TIP' || !prev.currentTask.tips) {
                return prev;
            }

            const newStats = { ...prev.stats };
            newStats.totalCompleted += 1;
            newStats.tipsCompleted += 1;
            // Cập nhật completedSessionTipIds khi task tip hoàn thành
            const newCompletedSessionTipIds = [...prev.completedSessionTipIds];
            prev.currentTask.tips.forEach((tip: TipResponseDTO) => {
                if (!newCompletedSessionTipIds.includes(tip.tipId)) {
                    newCompletedSessionTipIds.push(tip.tipId);
                }
            });

            const newCompletedTasks = [...prev.completedTasks, FE_TASK_ID]; // Đánh dấu task ID đã hoàn thành
            saveStats(newStats, newCompletedTasks);

            return {
                ...prev,
                stats: newStats,
                completedTasks: newCompletedTasks,
                completedSessionTipIds: newCompletedSessionTipIds,
                currentTask: null, // Xóa task hiện tại sau khi hoàn thành
            };
        });
        toast.success("Tuyệt vời! Bạn đã hoàn thành thử thách Tip!");
    }, [saveStats]);

    const resetTask = useCallback(() => {
        setState((prev: TaskState) => ({ ...prev, currentTask: null, error: null, currentQuizIndex: 0, quizResults: new Map(), totalCorrectAnswers: 0 }));
    }, []);

    const resetStats = useCallback(() => {
        const initialStats: TaskStats = {
            totalCompleted: 0,
            quizzesCompleted: 0,
            tipsCompleted: 0,
            correctAnswers: 0,
            totalQuizAttempts: 0,
            accuracy: 0,
            streak: 0,
        };
        setState((prev: TaskState) => ({
            ...prev,
            stats: initialStats,
            completedTasks: [],
            completedSessionQuizIds: [], // Reset session IDs
            completedSessionTipIds: [],   // Reset session IDs
            previousTaskType: null,       // Reset previous task type
        }));
        saveStats(initialStats, []);
        toast.info("Đã reset tất cả thống kê và phiên thử thách.");
    }, [saveStats]);

    // Reset session IDs but keep overall stats and try to generate new task
    const resetSession = useCallback(() => {
        setState((prev: TaskState) => ({
            ...prev,
            completedSessionQuizIds: [],
            completedSessionTipIds: [],
            previousTaskType: null,
        }));
        toast.info("Phiên thử thách đã được reset. Các thử thách có thể lặp lại.");
    }, []);


    // Task type helpers based on typeId (now based on currentTask.type)
    const isQuizTask = state.currentTask?.type === 'QUIZ';
    const isTipTask = state.currentTask?.type === 'TIP';

    return {
        // State
        currentTask: state.currentTask,
        isLoading: state.isLoading,
        error: state.error,
        completedTasks: state.completedTasks,
        stats: state.stats,
        currentQuizIndex: state.currentQuizIndex,
        quizResults: state.quizResults,
        totalCorrectAnswers: state.totalCorrectAnswers,
        isDataLoaded: state.isDataLoaded,

        // Computed
        isQuizTask,
        isTipTask,

        // Actions
        generateNewTask, // Đổi tên từ generateRandomTask
        handleQuizAnswer,
        markQuizTaskCompleted,
        markTipTaskCompleted,
        resetTask,
        resetStats,
        resetSession, // Thêm hành động reset session
        // Thêm action để tăng currentQuizIndex từ QuizTaskComponent
        goToNextQuiz: useCallback(() => {
            setState((prev: TaskState) => {
                if (!prev.currentTask || prev.currentTask.type !== 'QUIZ' || !prev.currentTask.quizzes) {
                    return prev;
                }
                return {
                    ...prev,
                    currentQuizIndex: prev.currentQuizIndex + 1,
                };
            });
        }, []),
    };
}
