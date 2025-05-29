import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./styles/style.css";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-16">
      <div className="container mx-auto relative z-10 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-center space-y-4">
          <Badge className="w-fit bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Start Your Journey
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Quit Smoking, <span className="text-emerald-500">Start Living</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Join thousands who have successfully quit smoking with our fun,
            engaging approach. Save money, improve health, and earn rewards
            along the way.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Avatar key={i} className="border-2 border-white">
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40&text=User${i}`}
                  />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">250+</span> people
              joined this week
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src="/landing_tree_43-light.jpg"
            alt="Soft edge"
            className="soft-edge w-[650px] h-auto object-cover"
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-emerald-100 opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-20 h-[300px] w-[300px] rounded-full bg-teal-100 opacity-50 blur-3xl"></div>
    </section>
  );
}
