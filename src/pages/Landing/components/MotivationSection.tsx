import { Button } from "@/components/ui/button";

export function MotivationSection() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-emerald-200 via-emerald-100 to-sky-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl text-slate-800 dark:text-white font-bold">
            "Every small step counts. Your journey to freedom starts today."
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of others who have successfully quit smoking with our
            app. Your new life is just one click away.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 font-bold">
              Get Started Free
            </Button>
            <Button size="lg" className="text-slate-900 dark:text-white font-bold" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
