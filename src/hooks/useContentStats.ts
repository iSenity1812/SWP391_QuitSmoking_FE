import { useState, useEffect, useCallback } from 'react'
import { achievementService } from '@/services/achievementService'
import { BlogService } from '@/services/blogService'
import { TaskService } from '@/services/taskService'
import { programService } from '@/services/programService'
import type { Achievement } from '@/types/achievement'
import type { BlogPost } from '@/types/blog'
import type { QuizResponseDTO, TipResponseDTO } from '@/types/task'
import type { ProgramResponseDTO } from '@/types/program'

export interface ContentStats {
    achievements: {
        total: number
        active: number
        byType: Record<string, number>
    }
    blogs: {
        total: number
        published: number
        pending: number
        rejected: number
    }
    tips: {
        total: number
    }
    quizzes: {
        total: number
    }
    programs: {
        total: number
        byType: Record<string, number>
    }
}

export interface UseContentStatsReturn {
    stats: ContentStats
    loading: boolean
    error: string | null
    refresh: () => Promise<void>
}

const initialStats: ContentStats = {
    achievements: { total: 0, active: 0, byType: {} },
    blogs: { total: 0, published: 0, pending: 0, rejected: 0 },
    tips: { total: 0 },
    quizzes: { total: 0 },
    programs: { total: 0, byType: {} }
}

export function useContentStats(): UseContentStatsReturn {
    const [stats, setStats] = useState<ContentStats>(initialStats)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadContentStats = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            // Load all data in parallel with Promise.allSettled to handle individual failures
            const [achievementsResult, blogsResult, tipsResult, quizzesResult, programsResult] = await Promise.allSettled([
                achievementService.getAllAchievements(),
                BlogService.getAllBlogsForAdmin(0, 1000),
                TaskService.getAllTips(),
                TaskService.getAllQuizzes(),
                programService.getAllPrograms({ page: 0, size: 1000 })
            ])

            // Process achievements
            const achievementStats = { total: 0, active: 0, byType: {} as Record<string, number> }
            if (achievementsResult.status === 'fulfilled') {
                const achievementData = achievementsResult.value as Achievement[]
                achievementStats.total = achievementData.length
                achievementStats.active = achievementData.filter(a => a.isActive).length
                
                // Count by type
                achievementData.forEach(achievement => {
                    const type = achievement.achievementType || 'OTHER'
                    achievementStats.byType[type] = (achievementStats.byType[type] || 0) + 1
                })
            } else {
                console.warn('Failed to load achievements:', achievementsResult.reason)
            }

            // Process blogs
            const blogStats = { total: 0, published: 0, pending: 0, rejected: 0 }
            if (blogsResult.status === 'fulfilled') {
                const blogData = blogsResult.value.content as BlogPost[]
                blogStats.total = blogData.length
                blogStats.published = blogData.filter(b => b.status === 'PUBLISHED').length
                blogStats.pending = blogData.filter(b => b.status === 'PENDING').length
                blogStats.rejected = blogData.filter(b => b.status === 'REJECTED').length
            } else {
                console.warn('Failed to load blogs:', blogsResult.reason)
            }

            // Process tips
            const tipStats = { total: 0 }
            if (tipsResult.status === 'fulfilled') {
                const tipData = tipsResult.value as TipResponseDTO[]
                tipStats.total = tipData.length
            } else {
                console.warn('Failed to load tips:', tipsResult.reason)
            }

            // Process quizzes
            const quizStats = { total: 0 }
            if (quizzesResult.status === 'fulfilled') {
                const quizData = quizzesResult.value as QuizResponseDTO[]
                quizStats.total = quizData.length
            } else {
                console.warn('Failed to load quizzes:', quizzesResult.reason)
            }

            // Process programs
            const programStats = { total: 0, byType: {} as Record<string, number> }
            if (programsResult.status === 'fulfilled') {
                const programData = programsResult.value.content as ProgramResponseDTO[]
                programStats.total = programData.length
                
                // Count by type
                programData.forEach(program => {
                    const type = program.programType || 'OTHER'
                    programStats.byType[type] = (programStats.byType[type] || 0) + 1
                })
            } else {
                console.warn('Failed to load programs:', programsResult.reason)
            }

            setStats({
                achievements: achievementStats,
                blogs: blogStats,
                tips: tipStats,
                quizzes: quizStats,
                programs: programStats
            })

            // Check if any critical services failed
            const failedServices = [
                achievementsResult.status === 'rejected' ? 'thành tựu' : null,
                blogsResult.status === 'rejected' ? 'bài viết' : null,
                tipsResult.status === 'rejected' ? 'tips' : null,
                quizzesResult.status === 'rejected' ? 'quiz' : null,
                programsResult.status === 'rejected' ? 'chương trình' : null,
            ].filter(Boolean)

            if (failedServices.length > 0) {
                setError(`Một số dữ liệu không thể tải: ${failedServices.join(', ')}`)
            }

        } catch (err) {
            console.error('Error loading content stats:', err)
            setError('Không thể tải thống kê nội dung')
        } finally {
            setLoading(false)
        }
    }, [])

    const refresh = useCallback(async () => {
        await loadContentStats()
    }, [loadContentStats])

    useEffect(() => {
        loadContentStats()
    }, [loadContentStats])

    return {
        stats,
        loading,
        error,
        refresh
    }
} 