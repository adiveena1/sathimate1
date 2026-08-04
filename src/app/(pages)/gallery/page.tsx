
'use client';

import { InteractiveImageCard } from "@/components/gallery/InteractiveImageCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollReveal, ScrollRevealItem } from "@/components/shared/ScrollReveal";

export default function GalleryPage() {
    const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));

    return (
        <div className="bg-background">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:py-20 lg:px-8">
                <ScrollReveal className="text-center mb-16" stagger staggerChildren={0.2}>
                    <ScrollRevealItem>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
                        Image Gallery
                    </h1>
                    </ScrollRevealItem>
                     <ScrollRevealItem>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
                        Hover over the images to see the interactive 3D effect.
                    </p>
                    </ScrollRevealItem>
                </ScrollReveal>

                <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12" stagger staggerChildren={0.1}>
                    {galleryImages.map((image, index) => (
                        <ScrollRevealItem key={image.id}>
                            <InteractiveImageCard
                                src={image.imageUrl}
                                alt={image.description || 'Gallery Image'}
                                title={`Image ${index + 1}`}
                                description={image.description || ''}
                                width={600}
                                height={800}
                                dataAiHint={image.imageHint}
                            />
                        </ScrollRevealItem>
                    ))}
                </ScrollReveal>

                <ScrollReveal className="mt-20 text-center">
                    <Button asChild size="lg">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </ScrollReveal>
            </div>
        </div>
    );
}
