import { RefreshCw } from "lucide-react";

export function MotivationMessages() {
  const messages = [
    "Every day smoke-free is a victory. Keep going!",
    "You are stronger than your cravings. Believe in yourself!",
    "Each moment without smoking is a step towards a healthier you.",
    "Remember why you started. Your future self will thank you!",
    "Stay focused on your goals. You've got this!",
    "Celebrate your progress, no matter how small.",
    "You are not alone. We're here to support you every step of the way.",
  ];

  const randomQuote = messages[Math.floor(Math.random() * messages.length)];

  return (
    <section className="w-full bg-emerald-500 py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center gap-2 text-center">
          <RefreshCw className="h-5 w-5 text-white animate-spin-slow" />
          <p className="text-lg font-medium text-white">{randomQuote}</p>
        </div>
      </div>
    </section>
  );
}
