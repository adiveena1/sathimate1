
import { notFound } from 'next/navigation';
import { indianStates } from '@/lib/india-data';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Utensils, Calendar, Mountain } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';



export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state = indianStates.find((s) => s.id === slug);

  if (!state) {
    notFound();
    return null;
  }

  return (
    <div className="bg-background">
      <section className="relative h-[60vh] w-full">
        <Image
          src={state.bannerImageUrl}
          alt={state.name}
          fill
          className="object-cover"
          priority
          data-ai-hint={state.bannerImageHint}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 text-center text-white">
          <ScrollReveal stagger staggerChildren={0.2}>
            <ScrollRevealItem>
              <h1 className="font-headline text-4xl font-extrabold md:text-6xl">
                {state.name}
              </h1>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-4 max-w-3xl text-lg md:text-2xl">{state.tagline}</p>
            </ScrollRevealItem>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <ScrollReveal className="mb-8 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/sathi-space">Sathi Space</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{state.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button asChild variant="outline">
            <Link href="/sathi-space">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sathi Space
            </Link>
          </Button>
        </ScrollReveal>

        <section id="about-state">
          <ScrollReveal>
            <h2 className="font-headline mb-4 text-3xl font-bold text-primary">
              About {state.name}
            </h2>
            <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
              {state.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section id="popular-cities" className="mt-16">
          <ScrollReveal>
            <h2 className="font-headline mb-6 text-3xl font-bold text-primary">
              Popular Cities
            </h2>
          </ScrollReveal>
          <ScrollReveal className="grid grid-cols-1 gap-8 md:grid-cols-3" stagger staggerChildren={0.1}>
            {state.cities.map((city) => (
              <ScrollRevealItem key={city.name}>
                <Card className="h-full overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                  <div className="relative h-60 w-full">
                    <Image
                      src={city.imageUrl}
                      alt={city.name}
                      fill
                      className="object-cover"
                      data-ai-hint={city.imageHint}
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold group-hover:text-primary-foreground">{city.name}</h3>
                    <p className="mt-2 text-muted-foreground group-hover:text-primary-foreground/80">{city.description}</p>
                  </CardContent>
                </Card>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
        </section>

        <section id="famous-places" className="mt-16">
          <ScrollReveal>
            <h2 className="font-headline mb-6 text-3xl font-bold text-primary">
              Famous Places & Attractions
            </h2>
          </ScrollReveal>
          <ScrollReveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger staggerChildren={0.1}>
            {state.famousPlaces.map((place) => (
              <ScrollRevealItem key={place.name}>
                <Card className="h-full overflow-hidden">
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={place.imageUrl}
                      alt={place.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={place.imageHint}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold group-hover:text-primary-foreground">{place.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground group-hover:text-primary-foreground/80">{place.description}</p>
                  </CardContent>
                </Card>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
        </section>
        
        <section id="travel-info" className="mt-16">
          <ScrollReveal>
            <h2 className="font-headline mb-6 text-3xl font-bold text-primary">
              Travel Information
            </h2>
          </ScrollReveal>
          <ScrollReveal className="grid grid-cols-1 gap-8 md:grid-cols-3" stagger staggerChildren={0.1}>
            <ScrollRevealItem>
              <Card className="flex h-full items-start space-x-4 p-6">
                <Calendar className="mt-1 h-8 w-8 group-hover:text-primary-foreground" />
                <div>
                  <h3 className="font-bold group-hover:text-primary-foreground">Best Time to Visit</h3>
                  <p className="text-muted-foreground group-hover:text-primary-foreground/80">{state.travelInfo.bestTimeToVisit}</p>
                </div>
              </Card>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <Card className="flex h-full items-start space-x-4 p-6">
                <Utensils className="mt-1 h-8 w-8 group-hover:text-primary-foreground" />
                <div>
                  <h3 className="font-bold group-hover:text-primary-foreground">Local Food Highlights</h3>
                  <p className="text-muted-foreground group-hover:text-primary-foreground/80">{state.travelInfo.localFood}</p>
                </div>
              </Card>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <Card className="flex h-full items-start space-x-4 p-6">
                <Mountain className="mt-1 h-8 w-8 group-hover:text-primary-foreground" />
                <div>
                  <h3 className="font-bold group-hover:text-primary-foreground">Culture & Festivals</h3>
                  <p className="text-muted-foreground group-hover:text-primary-foreground/80">{state.travelInfo.cultureAndFestivals}</p>
                </div>
              </Card>
            </ScrollRevealItem>
          </ScrollReveal>
        </section>

        <section id="gallery" className="mt-16">
          <ScrollReveal>
            <h2 className="font-headline mb-6 text-3xl font-bold text-primary">
              Gallery
            </h2>
          </ScrollReveal>
          <ScrollReveal className="grid grid-cols-2 gap-4 md:grid-cols-3" stagger staggerChildren={0.05}>
            {state.galleryImages.map((image, index) => (
              <ScrollRevealItem key={index}>
                <div className="group relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={image.url}
                    alt={`${state.name} gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={image.hint}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
