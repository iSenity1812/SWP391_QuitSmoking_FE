import { RefreshCw } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function MotivationMessages() {
  const messages = [
    "Mỗi ngày không hút thuốc là một chiến thắng. Hãy tiếp tục cố gắng nhé!",
    "Bạn mạnh mẽ hơn những cơn thèm thuốc. Hãy tin vào chính mình!",
    "Mỗi khoảnh khắc không thuốc lá là một bước tiến đến một phiên bản khỏe mạnh hơn của bạn.",
    "Hãy nhớ lý do bạn bắt đầu. Bản thân bạn trong tương lai sẽ biết ơn điều đó!",
    "Luôn tập trung vào mục tiêu của bạn. Bạn làm được mà!",
    "Hãy ăn mừng những tiến bộ của bạn, dù là nhỏ nhất.",
    "Bạn không hề đơn độc. Chúng tôi luôn ở đây để đồng hành cùng bạn trên mọi chặng đường.",
  ];

  const randomQuote = messages[Math.floor(Math.random() * messages.length)];

  return (

    <section className="relative w-full bg-emerald-500 py-6" >
      <AnimatedSection animation="fadeUp" delay={400}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse">
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-4 text-center text-white">
            <RefreshCw className="text-3xl animate-spin-slow" />
            <p className="text-xl lg:text-2xl font-bold italic text-white drop-shadow-lg">{randomQuote}</p>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
