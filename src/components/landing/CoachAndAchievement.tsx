import { useState } from "react";
import { AnimatedSection } from "../shared/AnimatedSection";
import { Apple, Award, Brain, Crown, Dumbbell, Heart, Leaf, Star, Stethoscope, Trophy, Users } from "lucide-react";



export function CoachAndAchievement() {
  const [activeTab, setActiveTab] = useState<"coaches" | "achievements">("coaches");

  const coachesData = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "Chuyên gia Tâm lý",
      experience: "8 năm kinh nghiệm tâm lý lâm sàng",
      specialty: "Liệu pháp nhận thức hành vi (CBT) cho cai nghiện",
      successCases: 450,
      quote: "Mỗi người đều có sức mạnh để thay đổi, tôi chỉ giúp bạn tìm thấy nó.",
      gradient: "from-purple-500 to-pink-600",
      icon: Brain
    },
    {
      id: 2,
      name: "Mike Johnson",
      title: "Huấn luyện viên Sức khỏe",
      experience: "5 năm đồng hành cùng người cai thuốc",
      specialty: "Kết hợp tập luyện và dinh dưỡng trong quá trình cai",
      successCases: 320,
      quote: "Thể chất khỏe mạnh sẽ giúp tinh thần vững vàng hơn trong hành trình cai thuốc.",
      gradient: "from-orange-500 to-red-600",
      icon: Dumbbell
    },
    {
      id: 3,
      name: "Emma Davis",
      title: "Chuyên gia Thiền & Mindfulness",
      experience: "6 năm thực hành và giảng dạy thiền",
      specialty: "Quản lý stress và cơn thèm qua thiền chánh niệm",
      successCases: 280,
      quote: "Khi tâm trí bình tĩnh, mọi cơn thèm đều có thể vượt qua được.",
      gradient: "from-teal-500 to-cyan-600",
      icon: Leaf
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      title: "Bác sĩ Nội khoa",
      experience: "12 năm chuyên khoa hô hấp và cai thuốc lá",
      specialty: "Hỗ trợ y khoa và theo dõi sức khỏe trong quá trình cai",
      successCases: 380,
      quote: "Cơ thể bạn phục hồi nhanh hơn bạn nghĩ, hãy để tôi chứng minh điều đó.",
      gradient: "from-blue-500 to-indigo-600",
      icon: Stethoscope
    },
    {
      id: 5,
      name: "Lisa Thompson",
      title: "Chuyên gia Dinh dưỡng",
      experience: "7 năm tư vấn dinh dưỡng cho người cai thuốc",
      specialty: "Lập kế hoạch ăn uống tránh tăng cân khi cai thuốc",
      successCases: 250,
      quote: "Ăn đúng cách không chỉ giúp cai thuốc mà còn cải thiện toàn diện sức khỏe.",
      gradient: "from-green-500 to-emerald-600",
      icon: Apple
    },
    {
      id: 6,
      name: "Alex Rodriguez",
      title: "Mentor Cộng đồng",
      experience: "Cai thuốc thành công 4 năm, 3 năm hỗ trợ cộng đồng",
      specialty: "Chia sẻ kinh nghiệm thực tế và hỗ trợ tinh thần 24/7",
      successCases: 180,
      quote: "Tôi hiểu bạn đang trải qua gì, vì tôi đã từng ở vị trí đó.",
      gradient: "from-yellow-500 to-orange-600",
      icon: Users
    }
  ];

  const achievements = [
    {
      title: "First Day Complete",
      icon: Star,
      unlocked: true,
      description: "Completed your first smoke-free day",
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "One Week Milestone",
      icon: Trophy,
      unlocked: true,
      description: "7 days smoke-free!",
      gradient: "from-amber-400 to-amber-600",
    },
    {
      title: "Saved $100",
      icon: Crown,
      unlocked: false,
      description: "Saved your first $100",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      title: "One Month Free",
      icon: Award,
      unlocked: false,
      description: "30 days of freedom",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Health Champion",
      icon: Heart,
      unlocked: true,
      description: "Improved health metrics",
      gradient: "from-rose-400 to-rose-600",
    },
    {
      title: "Community Helper",
      icon: Users,
      unlocked: true,
      description: "Helped 5 other quitters",
      gradient: "from-teal-400 to-teal-600",
    },
  ]

  return (
    <AnimatedSection animation="fadeUp" delay={400}>
      <section
        id="progress"
        className="py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-800 dark:to-slate-900"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-slate-800 dark:text-white">
              Text
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              See your achievements and compete with others on their quit journey! 🎯
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-xl border-2 border-emerald-100 dark:border-slate-700">
                <div className="flex gap-2">
                  <button
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === "coaches"
                      ? "text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg scale-105"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700"
                      }`}
                    onClick={() => setActiveTab("coaches")}
                  >
                    <Users size={20} />
                    Our Coaches
                  </button>
                  <button
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === "achievements"
                      ? "text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg scale-105"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700"
                      }`}
                    onClick={() => setActiveTab("achievements")}
                  >
                    <Award size={20} />
                    Achievements
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
              {activeTab === "coaches" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {coachesData.map((coach, index) => (
                    <AnimatedSection key={coach.id} animation="fadeUp" delay={index * 150}>
                      <div className="group relative bg-gradient-to-br from-teal-50 to-teal-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 shadow-xl border-2 border-emerald-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-500 hover:scale-105 hover:-translate-y-3 overflow-hidden">
                        {/* Background Gradient Animation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Coach Avatar */}
                        <div className="relative text-center mb-6">
                          <div className="relative mx-auto mb-4">
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${coach.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                              <img
                                src={coach.avatar}
                                alt={`${coach.name}'s Avatar`}
                                className="w-full h-full object-cover rounded-full shadow-lg"
                              />
                            </div>
                            {/* Online Status Indicator
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full flex items-center justify-center shadow-lg">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div> */}
                          </div>

                          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                            {coach.name}
                          </h3>

                          <div className="flex items-center justify-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${coach.specialtyGradient} shadow-md`}>
                              {coach.specialty}
                            </span>
                          </div>
                        </div>

                        {/* Coach Stats */}
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 border-2 border-emerald-100 dark:border-slate-600">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              🎯 Success Rate
                            </span>
                            <span className="font-black text-emerald-600 dark:text-emerald-400">
                              {coach.successRate}%
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 border-2 border-emerald-100 dark:border-slate-600">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              👥 Clients Helped
                            </span>
                            <span className="font-black text-blue-600 dark:text-blue-400">
                              {coach.clientsHelped}+
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 border-2 border-emerald-100 dark:border-slate-600">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              ⭐ Rating
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(coach.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                              <span className="ml-1 font-black text-slate-700 dark:text-slate-300">
                                {coach.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Coach Bio */}
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                          {coach.bio}
                        </p>

                        {/* Contact Button */}
                        <button className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${coach.gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group-hover:from-emerald-500 group-hover:to-blue-500`}>
                          💬 Chat with {coach.name.split(' ')[0]}
                        </button>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}

              {activeTab === "achievements" && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, i) => (
                    <AnimatedSection key={i} animation="fadeUp" delay={i * 100}>
                      <div
                        className={`relative p-6 rounded-3xl border-2 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${achievement.unlocked
                          ? "bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-500 shadow-xl shadow-emerald-200/50 dark:shadow-emerald-500/25"
                          : "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 opacity-60 grayscale"
                          }`}
                      >
                        {achievement.unlocked && (
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 rounded-3xl animate-pulse"></div>
                        )}
                        <div className="relative text-center">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg ${achievement.unlocked ? "animate-pulse" : ""
                              }`}
                          >
                            <achievement.icon className="w-7 h-7 text-white" />
                          </div>
                          <h4 className="font-black text-lg mb-2 text-slate-800 dark:text-white">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 font-medium">
                            {achievement.description}
                          </p>
                          {achievement.unlocked ? (
                            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md">
                              ✨ Unlocked!
                            </span>
                          ) : (
                            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-slate-600 border-2 border-gray-300 dark:border-slate-500">
                              🔒 Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  )
}