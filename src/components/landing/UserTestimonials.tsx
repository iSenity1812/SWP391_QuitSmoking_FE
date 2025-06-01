import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export function UserTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        "This app helped me quit after 15 years of smoking. The daily motivation kept me going!",
      name: "Sarah M.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote:
        "I've saved over $2,000 in just 6 months. Seeing the numbers really motivated me.",
      name: "Mike R.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote:
        "The breathing exercises were a game-changer during cravings. Highly recommend!",
      name: "Emma L.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-slate-600">
            Real stories from people who successfully quit smoking with
            QuitTogether
          </p>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <img
                src={
                  testimonials[currentTestimonial].avatar || "/placeholder.svg"
                }
                alt={testimonials[currentTestimonial].name}
                className="w-16 h-16 rounded-full mb-4"
              />
              <blockquote className="text-lg text-slate-700 mb-4 italic leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <cite className="text-emerald-600 font-semibold">
                — {testimonials[currentTestimonial].name}
              </cite>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
