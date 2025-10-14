import Page from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Page
    
    >
      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-screen-2xl px-4 md:px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
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

            <div className="hidden md:block">
              <div className="aspect-video rounded-xl border bg-muted/40" />
            </div>
            <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolorem laboriosam nihil maiores, quasi ea assumenda quas necessitatibus, culpa rem fugit. Illum omnis dignissimos itaque amet eius cumque deserunt. Doloremque!Lorem Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam minus sunt error exercitationem culpa architecto accusamus, sit illum ad adipisci amet ut autem, soluta optio, odio omnis deleniti iste expedita. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit quibusdam, incidunt earum odio, quam sunt quasi ea nam beatae exercitationem eligendi odit dicta laudantium, unde recusandae et maiores eum adipisci? Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui distinctio aperiam est sint blanditiis numquam nisi, non doloribus totam itaque hic nostrum voluptatum ut velit consequuntur veniam vel saepe. Id.</div>

          </div>
        </div>
      </section>
    </Page>
  );
}
