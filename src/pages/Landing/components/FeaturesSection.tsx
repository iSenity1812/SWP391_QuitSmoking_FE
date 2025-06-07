import { Smile, Wind, BarChart3, Users } from "lucide-react";
import { AnimatedSection } from "../../../components/ui/AnimatedSection";

export function FeaturesSection() {
  return (
    <AnimatedSection animation="fadeUp" delay={200}>
      <section id="features" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Amazing Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Everything you need to successfully quit smoking and maintain a healthy lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-rose-200 rounded-xl flex items-center justify-center mb-4">
                <Smile className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Emotion Tracking
              </h3>
              <p className="text-slate-600 text-sm">
                Monitor your mood and identify triggers to better manage cravings
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-sky-200 rounded-xl flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Breathing Exercises
              </h3>
              <p className="text-slate-600 text-sm">
                Guided breathing techniques to help you through difficult moments
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-200 to-green-200 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Progress Dashboard
              </h3>
              <p className="text-slate-600 text-sm">
                Visualize your journey with detailed charts and statistics
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-violet-200 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Community Support
              </h3>
              <p className="text-slate-600 text-sm">
                Connect with others on the same journey for motivation and tips
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
