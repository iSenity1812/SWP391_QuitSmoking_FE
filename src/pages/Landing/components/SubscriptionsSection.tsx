import { AnimatedSection } from "@/components/ui/AnimatedSection";
export const SubscriptionsSection = () => {
    return (
        <section
            id="plans"
            className="py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-800 dark:to-slate-900"
        >

            <AnimatedSection animation="fadeUp" delay={400} className="relative z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-emerald-300/20 dark:from-emerald-500/10 dark:to-emerald-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/40 to-emerald-200/30 dark:from-emerald-600/10 dark:to-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 text-slate-800 dark:text-white">
                            Choose Your Plan
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
                            Select the plan that works best for your quit journey!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-6 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Free",
                                price: "$0",
                                period: "per month",
                                description: "Basic tools to start your journey",
                                features: [
                                    "✨ Basic progress tracking",
                                    "✨ Community access",
                                    "✨ Daily motivational quotes",
                                    "✨ Limited health insights",
                                ],
                                cta: "🚀 Get Started",
                                popular: false,
                            },
                            {
                                name: "Premium",
                                price: "$4.99",
                                period: "per month",
                                description: "Everything you need to quit for good!",
                                features: [
                                    "✨ Advanced progress tracking",
                                    "✨ Chat with a coach/AI",
                                    "✨ Create custom challenges",
                                    "✨ Full health dashboard",
                                    "✨ Money-saving calculator",
                                    "✨ Access Premium content",
                                    "✨ Premium community features",
                                ],
                                cta: "🚀 Start Your Journey",
                                popular: true,
                                variants: [
                                    {
                                        id: "prem_14d",
                                        label: "14 Days",
                                        price: "$4.99",
                                        subLabel: "billed every 14 days",
                                        cta: "Choose 14 Days",
                                    },
                                    {
                                        id: "prem_1m",
                                        label: "1 Months",
                                        price: "$8.99",
                                        subLabel: "billed every 1 month, save 10%",
                                        cta: "Choose 1 Month",
                                        highlight: "Popular",
                                    },
                                    {
                                        id: "prem_3m",
                                        label: "3 Months",
                                        price: "$21.99",
                                        subLabel: "billed every 3 months, save 20%",
                                        cta: "Choose 3 Months",
                                        highlight: "Best Value",
                                    },
                                ],
                            },
                        ].map((plan, i) => (
                            <AnimatedSection key={i} animation="fadeUp" delay={i * 150}
                                className={`${plan.popular ? "md:col-span-3" : "md:col-span-3"
                                    }`}>
                                <div
                                    className={`relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border-2 transition-all duration-500 hover:scale-105 hover:-translate-y-2 flex flex-col ${plan.popular
                                        ? " border-emerald-300 dark:border-emerald-500 shadow-2xl shadow-emerald-200/50 dark:shadow-emerald-500/25"
                                        : " border-emerald-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500"
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm rounded-full shadow-lg">
                                            🌟 Most Popular
                                        </div>
                                    )}
                                    <div className="text-center mb-8">
                                        {/* <div className="text-5xl mb-4 drop-shadow-lg">{plan.emoji}</div> */}
                                        <h3 className="text-2xl font-black mb-4 text-slate-800 dark:text-white">{plan.name}</h3>
                                        <div className="flex items-baseline justify-center gap-2 mb-4">
                                            <span className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                                                {plan.price}
                                            </span>
                                            {plan.period && (
                                                <span className="text-slate-600 dark:text-slate-300 font-semibold">{plan.period}</span>
                                            )}
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 font-medium">{plan.description}</p>
                                    </div>
                                    <div className="flex-1">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, j) => (
                                                <li key={j} className="text-slate-600 dark:text-slate-300 font-medium">
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Variants Section for Premium Plan */}
                                        {plan.name === "Premium" && plan.variants && (
                                            <div className="mb-8 mt-4">
                                                {/* <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center">Choose your duration:</h4> */}
                                                <div className="space-y-3">
                                                    {plan.variants.map((variant) => (
                                                        <div
                                                            key={variant.id}
                                                            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg dark:hover:border-emerald-400 ${variant.highlight ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-600 hover:border-emerald-300 bg-slate-50 dark:bg-slate-700/50'}`}
                                                        >
                                                            {variant.highlight && (
                                                                <div className={`absolute -top-3 right-3 text-xs font-bold px-2 py-1 rounded-full text-white ${variant.highlight === "Best Value" ? "bg-yellow-500" : "bg-emerald-500"}`}>
                                                                    {variant.highlight}
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <h5 className="font-bold text-slate-800 dark:text-white">{variant.label}</h5>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{variant.subLabel}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{variant.price}</span>
                                                                    {variant.label !== "1 Month" && <span className="text-xs text-slate-500 dark:text-slate-400 block">/{variant.label}</span>}
                                                                </div>
                                                            </div>
                                                            {/* Optionally, add a button for each variant if the main CTA changes
                                                        <button className="mt-2 w-full py-2 text-sm rounded-lg font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-700 dark:text-emerald-100 dark:hover:bg-emerald-600">
                                                            {variant.cta}
                                                        </button>
                                                        */}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-auto">
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            No credit card required.
                                        </p>
                                    </div>

                                    <button
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg ${plan.popular
                                            ? "text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-200/50 dark:shadow-emerald-500/25"
                                            : "text-slate-700 dark:text-slate-300 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-slate-700 dark:to-slate-600 border-2 border-emerald-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500"
                                            }`}
                                    >
                                        {plan.cta}
                                    </button>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </AnimatedSection>
        </section>

    )
}