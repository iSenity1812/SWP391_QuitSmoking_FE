import { Calendar, DollarSign, Heart, Target } from "lucide-react";
import { AnimatedSection } from "../shared/AnimatedSection";

export function BenefitsSection() {
  return (
    <AnimatedSection animation="fadeUp">

      <section id="benefits" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 dark:text-white">
              Why Choose QuitTogether?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto dark:text-slate-300">
              Our app makes quitting smoking easier with proven methods and
              supportive features
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl overflow-hidden shadow-xl border-2 border-emerald-100 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-500 hover:scale-105 hover:-translate-y-3 group relative">
              <div className="w-16 h-16 bg-gradient-to-br from-red-200 to-pink-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                Track Smoke-Free Days
              </h3>
              <p className="text-slate-600 text-center">
                Watch your streak grow and celebrate every milestone on your quit
                journey
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                Money Saved
              </h3>
              <p className="text-slate-600 text-center">
                See exactly how much money you're saving by not buying cigarettes
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-sky-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                Health Improvements
              </h3>
              <p className="text-slate-600 text-center">
                Monitor your health recovery with real-time progress indicators
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-violet-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Target className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                Daily Motivation
              </h3>
              <p className="text-slate-600 text-center">
                Get personalized tips and encouragement to stay on track
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
