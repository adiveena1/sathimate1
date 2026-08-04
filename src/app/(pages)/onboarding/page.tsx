
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser, useAuth } from '@/firebase';
import { travellerService } from '@/services/traveller-service';
import { Loader2, Plane, User, Globe, Heart, ShieldCheck, Camera, Calendar, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  travelDestination: z.string().min(2, "Destination is required"),
  budgetRange: z.string().min(1, "Budget range is required"),
  travelStyle: z.array(z.string()).min(1, "Select at least one travel style"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
});

const TRAVEL_STYLES = [
  "Backpacking", "Luxury", "Budget", "Adventure", "Family", "Solo", "Honeymoon", "Slow Travel"
];

const INTERESTS = [
  "Nature", "Food", "Mountains", "Temples", "Cafes", "Beaches", "Culture", "Nightlife", "Photography", "Art", "Shopping"
];

const LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "German", "Japanese", "Chinese", "Arabic"
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useUser();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      age: "",
      gender: "",
      city: "",
      country: "",
      travelDestination: "",
      budgetRange: "Mid-range",
      travelStyle: [],
      interests: [],
      bio: "",
      languages: ["English"],
    },
  });

  const nextStep = async () => {
    // Basic validation per step
    const fields = step === 1 
      ? ["fullName", "age", "gender", "city", "country"] as const
      : step === 2 
      ? ["travelDestination", "budgetRange", "travelStyle", "interests"] as const
      : ["bio", "languages"] as const;

    const isValid = await form.trigger(fields);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
      
      // Cleanup function to revoke object URL when component unmounts or new file is selected
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  };

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      let finalPhotoURL = user.photoURL || null;
      if (photoFile) {
        finalPhotoURL = await travellerService.uploadPhoto(user.uid, photoFile);
      }

      await travellerService.saveProfile(user.uid, {
        ...values,
        photoURL: finalPhotoURL || undefined,
        onboardingComplete: true,
        visibility: 'public'
      });

      toast({
          title: "Setup Complete!",
          description: "Welcome to Sathimate. Your profile is ready.",
      });
      router.push('/discover');
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return (
      <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
  );

  if (!user && !authLoading) {
      router.push('/login');
      return null;
  }

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#1D1D1F] pb-20">
      <div className="absolute top-0 left-0 w-full h-2 bg-muted/20">
          <div className="h-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }} />
      </div>

      <nav className="p-6">
          <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                   <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                        <Plane className="h-5 w-5 text-white" />
                   </div>
                   <span className="font-bold text-xl tracking-tighter uppercase">Sathimate</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                  Step {step} of 3
              </div>
          </div>
      </nav>

      <div className="container mx-auto max-w-2xl px-6 pt-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <header>
                      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Nice to meet you!</h1>
                      <p className="text-muted-foreground mt-2">Let's start with your basics.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} className="bg-white border-muted h-12 rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl><Input type="number" placeholder="25" {...field} className="bg-white border-muted h-12 rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-white border-muted h-12 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl><Input placeholder="Mumbai" {...field} className="bg-white border-muted h-12 rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl><Input placeholder="India" {...field} className="bg-white border-muted h-12 rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <header>
                      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Where to next?</h1>
                      <p className="text-muted-foreground mt-2">Tell us about your travel vibes.</p>
                  </header>

                   <FormField
                    control={form.control}
                    name="travelDestination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Where are you planning to go?</FormLabel>
                        <FormControl><Input placeholder="Goa, Iceland, Tokyo..." {...field} className="bg-white border-muted h-12 rounded-xl" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                      <FormLabel>Travel style (Pick as many as you like)</FormLabel>
                      <div className="flex flex-wrap gap-2">
                          {TRAVEL_STYLES.map(style => (
                              <Badge 
                                  key={style} 
                                  variant={form.watch('travelStyle').includes(style) ? "default" : "secondary"}
                                  className="cursor-pointer px-4 py-2 text-sm rounded-full transition-all"
                                  onClick={() => {
                                      const current = form.getValues('travelStyle');
                                      if (current.includes(style)) {
                                          form.setValue('travelStyle', current.filter(s => s !== style));
                                      } else {
                                          form.setValue('travelStyle', [...current, style]);
                                      }
                                  }}
                              >
                                  {style}
                              </Badge>
                          ))}
                      </div>
                      <FormMessage>{form.formState.errors.travelStyle?.message}</FormMessage>
                  </div>

                  <div className="space-y-4">
                      <FormLabel>What are your interests?</FormLabel>
                      <div className="flex flex-wrap gap-2">
                          {INTERESTS.map(interest => (
                              <Badge 
                                  key={interest} 
                                  variant={form.watch('interests').includes(interest) ? "default" : "secondary"}
                                  className="cursor-pointer px-4 py-2 text-sm rounded-full transition-all"
                                  onClick={() => {
                                      const current = form.getValues('interests');
                                      if (current.includes(interest)) {
                                          form.setValue('interests', current.filter(i => i !== interest));
                                      } else {
                                          form.setValue('interests', [...current, interest]);
                                      }
                                  }}
                              >
                                  {interest}
                              </Badge>
                          ))}
                      </div>
                      <FormMessage>{form.formState.errors.interests?.message}</FormMessage>
                  </div>

                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Vibes</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="bg-white border-muted h-12 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Economy">Economy (Tents & Hostels)</SelectItem>
                            <SelectItem value="Mid-range">Mid-range (Hotels & Cafes)</SelectItem>
                            <SelectItem value="Luxury">Luxury (Resorts & Fine Dining)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <header className="text-center">
                       <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                            <Camera className="h-8 w-8 text-primary" />
                       </div>
                      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Almost there!</h1>
                      <p className="text-muted-foreground mt-2">Personalize your traveler profile.</p>
                  </header>

                   <div className="flex flex-col items-center gap-4">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-muted">
                            {photoPreview ? <Image src={photoPreview} alt="Profile preview" fill sizes="96px" className="object-cover" /> : <div className="h-full w-full flex items-center justify-center"><User className="h-10 w-10 text-muted-foreground" /></div>}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="h-6 w-6 text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <span className="text-sm font-medium text-primary underline cursor-pointer">Upload profile photo</span>
                   </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Bio/About You</FormLabel>
                        <FormControl><Textarea placeholder="E.g. I'm a nature lover looking for someone to hike with in Iceland next September..." {...field} className="bg-white border-muted min-h-[120px] rounded-xl" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                      <FormLabel>Languages You Know</FormLabel>
                      <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map(lang => (
                              <Badge 
                                  key={lang} 
                                  variant={form.watch('languages').includes(lang) ? "default" : "secondary"}
                                  className="cursor-pointer px-4 py-2 text-sm rounded-full transition-all"
                                  onClick={() => {
                                      const current = form.getValues('languages');
                                      if (current.includes(lang)) {
                                          form.setValue('languages', current.filter(l => l !== lang));
                                      } else {
                                          form.setValue('languages', [...current, lang]);
                                      }
                                  }}
                              >
                                  {lang}
                              </Badge>
                          ))}
                      </div>
                      <FormMessage>{form.formState.errors.languages?.message}</FormMessage>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 pt-8">
                {step > 1 && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        className="flex-1 h-14 rounded-2xl gap-2 font-bold"
                        onClick={prevStep}
                        disabled={isSubmitting}
                    >
                        <ArrowLeft className="h-5 w-5" /> Back
                    </Button>
                )}
                {step < 3 ? (
                    <Button 
                        type="button" 
                        className="flex-1 h-14 rounded-2xl gap-2 font-extrabold shadow-lg shadow-primary/20"
                        onClick={nextStep}
                    >
                        Next <ArrowRight className="h-5 w-5" />
                    </Button>
                ) : (
                    <Button 
                        type="submit" 
                        className="flex-1 h-14 rounded-2xl gap-2 font-extrabold shadow-lg shadow-primary/20"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Complete Setup</>}
                    </Button>
                )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
