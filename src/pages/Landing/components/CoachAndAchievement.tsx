import { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Award, Crown, Heart, Star, Trophy, Users } from "lucide-react";



export function CoachAndAchievement() {
  const [activeTab, setActiveTab] = useState<"coaches" | "achievements">("coaches");

  const coachesData = [
    {
      id: 1,
      name: "Mike Johnson",
      title: "Health & Wellness Coach", // Huấn luyện viên Sức khỏe -> Health & Wellness Coach (phổ biến và đúng chuyên môn hơn)
      experience: "5 years supporting smoking cessation journeys", // 5 năm đồng hành cùng người cai thuốc -> specific hơn
      specialty: "Integrating exercise and nutrition into cessation plans", // Kết hợp tập luyện và dinh dưỡng trong quá trình cai
      successCases: 320,
      quote: "A healthy body builds a stronger mind for your smoke-free journey.", // Tự nhiên hơn
      gradient: "from-red-400 to-pink-400",
      // icon: Dumbbell,
      rating: 4.2, // Thêm rating để tăng tính chuyên nghiệp
      avatar: "/cham1.jpg",
      bio: "With 5 years of experience, Mike helps clients quit smoking by integrating tailored fitness and nutrition plans. His holistic approach has supported over 320 success stories."
    },
    {
      id: 2,
      name: "Dr. James Wilson",
      title: "Internal Medicine Physician", // Bác sĩ Nội khoa -> Internal Medicine Physician (chính xác hơn)
      experience: "12 years specializing in respiratory health and smoking cessation", // 12 năm chuyên khoa hô hấp và cai thuốc lá -> rõ ràng hơn
      specialty: "Medical support and health monitoring during cessation", // Hỗ trợ y khoa và theo dõi sức khỏe trong quá trình cai
      successCases: 380,
      quote: "Your body recovers faster than you think. Let me show you how.", // Tự nhiên, mang tính khích lệ hơn
      gradient: "from-green-500 to-emerald-600",
      // icon: Stethoscope,
      rating: 4.7, // Thêm rating để tăng tính chuyên nghiệp
      avatar: "/cham1.jpg",
      bio: "A specialist in respiratory health with 12 years of clinical experience, Dr. Wilson offers expert medical guidance and health monitoring to ensure a safer, more effective quit process."
    },
    {
      id: 3,
      name: "Lisa Thompson",
      title: "Registered Dietitian", // Chuyên gia Dinh dưỡng -> Registered Dietitian (chuẩn hơn so với Nutritionist chung chung)
      experience: "7 years providing nutritional counseling for quitters", // 7 năm tư vấn dinh dưỡng cho người cai thuốc -> gọn hơn, rõ ràng
      specialty: "Developing meal plans to prevent weight gain during cessation", // Lập kế hoạch ăn uống tránh tăng cân khi cai thuốc
      successCases: 250,
      quote: "Eating right doesn't just help you quit; it enhances your overall well-being.", // Tự nhiên hơn, nhấn mạnh lợi ích toàn diện
      gradient: "from-blue-500 to-indigo-400",
      // icon: Apple,
      rating: 4.9, // Thêm rating để tăng tính chuyên nghiệp
      avatar: "/cham1.jpg",
      bio: "With a focus on preventing weight gain during cessation, Lisa has helped over 250 clients achieve their health goals through personalized meal plans and nutritional counseling."
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      title: "Community Mentor", // Mentor Cộng đồng
      experience: "4 years smoke-free, 3 years community support", // Cai thuốc thành công 4 năm, 3 năm hỗ trợ cộng đồng -> gọn và rõ ràng
      specialty: "Sharing real-world experience and 24/7 emotional support", // Chia sẻ kinh nghiệm thực tế và hỗ trợ tinh thần 24/7
      successCases: 180,
      quote: "I understand what you're going through because I've been there.", // Tự nhiên và chân thật hơn
      gradient: "from-purple-400 to-pink-400",
      // icon: Users,
      rating: 4.8, // Thêm rating để tăng tính chuyên nghiệp
      avatar: "/cham1.jpg",
      bio: "Having successfully quit smoking for 4 years, Alex provides peer support and mentorship, sharing personal experiences and offering emotional guidance to those on their quit journey."
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

    <section
      id="progress"
      className="py-20 bg-gradient-to-bl from-emerald-50 to-white dark:from-slate-900/99 dark:to-slate-800"
    >
      <AnimatedSection animation="fadeUp" delay={200}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-4xl font-black mb-6 text-slate-800 dark:text-white">
              Introduce our Coaches & Achievements
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              See your achievements and compete with others on their quit journey!
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
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
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {coachesData.map((coach, index) => (
                    <AnimatedSection key={coach.id} animation="fadeUp" delay={index * 150}>
                      <div className="group relative bg-[#FBFBFB] bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 shadow-xl border-2 border-emerald-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:-translate-y-3 overflow-hidden">
                        {/* Background Gradient Animation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/55 to-emerald-500/5 dark:from-emerald-200/15 dark:to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Coach Avatar */}
                        <div className="relative text-center mb-4">
                          <div className="flex justify-center relative mx-auto mb-4">
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
                            <span className={`px-3 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${coach.gradient} shadow-md`}>
                              {coach.specialty}
                            </span>
                          </div>
                        </div>

                        {/* Coach Stats */}

                        {/* Coach Bio */}

                        <div className="space-y-4">
                          {/* <div className="flex items-center justify-between min-h-10">
                            <span className="font-sm text-slate-600 dark:text-white">
                              <ul>
                                <li>{coach.experience}</li>
                              </ul>
                            </span>
                          </div> */}

                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            {coach.bio}
                          </p>


                          <div className="flex items-center justify-between p-3 mt-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 border-2 border-emerald-100 dark:border-slate-600">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              Rating
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



                        {/* Contact Button */}
                        {/* <button className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${coach.gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group-hover:from-emerald-500 group-hover:to-blue-500`}>
                          💬 Chat with {coach.name.split(' ')[0]}
                        </button> */}
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
      </AnimatedSection>
    </section >

  )
}