import Page from "@/components/pages/Page";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Page
    >
      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-screen-2xl px-4 md:px-6 py-16 md:py-24">
          <div className="grid  items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Discover truthful insights about companies
              </h1>
              <p className="mt-4 text-muted-foreground text-base md:text-lg">
                NoLies helps you explore real experiences, salaries, and technologies used by companies worldwide.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild className="cursor-pointer">
                  <Link to="/signup">Get started</Link>
                </Button>
                <Button asChild variant="outline" className="cursor-pointer">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
