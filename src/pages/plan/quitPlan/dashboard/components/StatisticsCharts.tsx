import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar, LineChart, Line } from "recharts"

export function StatisticsCharts() {
    const weeklyData = [
        { week: "Week 1", smoking: 85, cravings: 45, mood: 3.2 },
        { week: "Week 2", smoking: 70, cravings: 38, mood: 3.8 },
        { week: "Week 3", smoking: 55, cravings: 28, mood: 4.1 },
        { week: "Week 4", smoking: 40, cravings: 22, mood: 4.3 },
    ]

    const moodData = [
        { day: 1, mood: 4 },
        { day: 2, mood: 3 },
        { day: 3, mood: 2 },
        { day: 4, mood: 5 },
        { day: 5, mood: 4 },
        { day: 6, mood: 3 },
        { day: 7, mood: 4 },
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Bar dataKey="smoking" fill="#ef4444" name="Cigarettes" />
                                    <Bar dataKey="cravings" fill="#f59e0b" name="Cravings" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Mood Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={moodData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis domain={[1, 5]} />
                                    <RechartsTooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="mood"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
