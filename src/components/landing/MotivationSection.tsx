import { Button } from "@/components/ui/button";

export function MotivationSection() {
  return (
    <section className="bg-emerald-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">
            "Every small step counts. Your journey to freedom starts today."
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of others who have successfully quit smoking with our
            app. Your new life is just one click away.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
