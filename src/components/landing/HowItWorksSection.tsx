export function HowItWorksSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Getting started is simple. Follow these three easy steps to begin
            your smoke-free journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl font-bold text-coral-600">1</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Set Your Quit Date
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Choose when you want to quit smoking and let us help you prepare
              for success with personalized planning
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl font-bold text-emerald-600">2</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Track Your Progress
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Monitor your smoke-free days, health improvements, and money saved
              with our intuitive dashboard
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-200 to-blue-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl font-bold text-sky-600">3</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Get Support & Stay Motivated
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Connect with our community, access breathing exercises, and
              receive daily encouragement
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
