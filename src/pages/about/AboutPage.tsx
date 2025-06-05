"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { motion } from "framer-motion"
import {
    Heart,
    Users,
    Target,
    Award,
    Mail,
    Phone,
    Star,
    CheckCircle,
    TrendingUp,
    Shield,
    Clock,
    Sparkles,
    MessageCircle,
    Calendar,
    BarChart3,
} from "lucide-react"

const AboutPage: React.FC = () => {
    const teamMembers = [
        {
            name: "Dr. Sarah Johnson",
            role: "Chief Medical Officer",
            description: "15+ years in addiction medicine and respiratory health. Specialized in smoking cessation programs.",
            avatar: "/cham1.jpg",
            rating: 4.9,
            patients: 500,
            specialties: ["Addiction Medicine", "Respiratory Health", "Behavioral Therapy"],
        },
        {
            name: "Mike Chen",
            role: "Health & Wellness Coach",
            description: "Certified wellness coach with expertise in habit formation and lifestyle changes.",
            avatar: "/cham1.jpg",
            rating: 4.8,
            patients: 320,
            specialties: ["Habit Formation", "Nutrition", "Exercise Therapy"],
        },
        {
            name: "Dr. Emily Rodriguez",
            role: "Behavioral Psychologist",
            description: "PhD in Psychology, specializing in addiction recovery and cognitive behavioral therapy.",
            avatar: "/cham1.jpg",
            rating: 4.9,
            patients: 280,
            specialties: ["CBT", "Addiction Recovery", "Mental Health"],
        },
        {
            name: "Alex Thompson",
            role: "Community Mentor",
            description: "5 years smoke-free. Peer support specialist helping others through their quit journey.",
            avatar: "/cham1.jpg",
            rating: 4.7,
            patients: 150,
            specialties: ["Peer Support", "Motivation", "Real Experience"],
        },
    ]

    const features = [
        {
            icon: Target,
            title: "Evidence-Based Methods",
            description: "Our approach is backed by scientific research and proven clinical methods for smoking cessation.",
            gradient: "from-emerald-400 to-emerald-600",
        },
        {
            icon: Users,
            title: "24/7 Community Support",
            description: "Connect with a supportive community of people on the same journey, available around the clock.",
            gradient: "from-blue-400 to-blue-600",
        },
        {
            icon: BarChart3,
            title: "Progress Tracking",
            description: "Advanced analytics to monitor your progress, health improvements, and financial savings.",
            gradient: "from-purple-400 to-purple-600",
        },
        {
            icon: Shield,
            title: "Personalized Plans",
            description: "Customized quit plans tailored to your smoking habits, lifestyle, and personal goals.",
            gradient: "from-rose-400 to-rose-600",
        },
    ]

    const stats = [
        { number: "10,000+", label: "People Helped", icon: Users },
        { number: "85%", label: "Success Rate", icon: TrendingUp },
        { number: "24/7", label: "Support Available", icon: Clock },
        { number: "5★", label: "Average Rating", icon: Star },
    ]

    const achievements = [
        "Featured in Health & Wellness Magazine 2024",
        "Winner of Digital Health Innovation Award",
        "Certified by International Smoking Cessation Association",
        "Partnership with leading medical institutions",
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
            <div className="container mx-auto py-8 px-6">
                {/* Hero Section */}
                <AnimatedSection animation="fadeUp" delay={100}>
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-emerald-300/20 dark:from-emerald-500/10 dark:to-emerald-600/5 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/40 to-emerald-200/30 dark:from-emerald-600/10 dark:to-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

                        <div className="relative z-10">
                            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                                ✨ About QuitTogether
                            </Badge>
                            <h1 className="text-4xl lg:text-6xl font-black mb-6 text-slate-800 dark:text-white">
                                Empowering Your
                                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent block">
                                    Smoke-Free Journey
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                                We're dedicated to helping people quit smoking through evidence-based methods, personalized support, and
                                a thriving community of success stories.
                            </p>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Stats Section */}
                <AnimatedSection animation="fadeUp" delay={200}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-black text-slate-800 dark:text-white mb-2">{stat.number}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Mission & Vision */}
                <AnimatedSection animation="fadeUp" delay={300}>
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Heart className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    To provide comprehensive, evidence-based support for individuals on their journey to quit smoking. We
                                    combine cutting-edge technology with human compassion to create lasting change and improve lives
                                    through personalized quit plans, community support, and expert guidance.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {["Health First", "Evidence-Based", "Community Driven"].map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Our Vision</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    To become the world's leading platform for smoking cessation, creating a smoke-free future where
                                    everyone has access to the tools, support, and community they need to live healthier, happier lives.
                                    We envision a world where quitting smoking is achievable for everyone.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {["Global Impact", "Innovation", "Accessibility"].map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </AnimatedSection>

                {/* Features Section */}
                <AnimatedSection animation="fadeUp" delay={400}>
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-black mb-4 text-slate-800 dark:text-white">
                                Why Choose QuitTogether?
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                                Our comprehensive approach combines the best of technology, science, and human support
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-full">
                                        <CardHeader className="text-center">
                                            <div
                                                className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                            >
                                                <feature.icon className="w-8 h-8 text-white" />
                                            </div>
                                            <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* Team Section */}
                <AnimatedSection animation="fadeUp" delay={500}>
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-black mb-4 text-slate-800 dark:text-white">
                                Meet Our Expert Team
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                                Our dedicated professionals bring years of experience in healthcare, psychology, and wellness
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-full">
                                        <CardHeader className="text-center">
                                            <div className="relative mx-auto mb-4">
                                                <Avatar className="h-20 w-20 border-4 border-emerald-200 dark:border-emerald-700 shadow-lg">
                                                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold">
                                                        {member.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full flex items-center justify-center shadow-lg">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg font-bold">{member.name}</CardTitle>
                                            <CardDescription className="font-medium text-emerald-600 dark:text-emerald-400">
                                                {member.role}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                                                {member.description}
                                            </p>

                                            <div className="flex items-center justify-center gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="font-bold">{member.rating}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4 text-emerald-500" />
                                                    <span className="font-bold">{member.patients}+</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {member.specialties.map((specialty, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                                                    >
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* Achievements Section */}
                <AnimatedSection animation="fadeUp" delay={600}>
                    <div className="mb-16">
                        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-2 border-emerald-200 dark:border-emerald-700 shadow-xl">
                            <CardHeader className="text-center">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Our Achievements</CardTitle>
                                </div>
                                <CardDescription>Recognition and milestones that drive us forward</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {achievements.map((achievement, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl"
                                        >
                                            <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{achievement}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </AnimatedSection>

                {/* Contact Section */}
                <AnimatedSection animation="fadeUp" delay={700}>
                    <div className="text-center">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-slate-700 shadow-xl max-w-4xl mx-auto">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl font-black mb-4 text-slate-800 dark:text-white">
                                    Ready to Start Your Journey?
                                </CardTitle>
                                <CardDescription className="text-lg">
                                    Get in touch with our team for personalized support and guidance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                        <Mail className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                                        <h4 className="font-bold mb-2">Email Us</h4>
                                        <a
                                            href="mailto:support@quittogether.com"
                                            className="text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                            support@quittogether.com
                                        </a>
                                    </div>
                                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <Phone className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                                        <h4 className="font-bold mb-2">Call Us</h4>
                                        <a href="tel:+84123456789" className="text-blue-600 dark:text-blue-400 hover:underline">
                                            +84 123 456 789
                                        </a>
                                    </div>
                                    <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                        <MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                                        <h4 className="font-bold mb-2">Live Chat</h4>
                                        <span className="text-purple-600 dark:text-purple-400">Available 24/7</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Schedule Consultation
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="px-8 py-3 border-2 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold rounded-xl"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Start Live Chat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    )
}

export default AboutPage
