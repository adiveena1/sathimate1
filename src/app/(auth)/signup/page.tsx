
'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase-errors";
import { createUserDocument } from "@/services/user-service";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

const formSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  terms: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions." }),
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const { isSubmitting } = form.formState;
  const passwordValue = form.watch("password");

  const handleSignup = async (values: z.infer<typeof formSchema>) => {
    if (!auth || !db) {
      toast({ variant: 'destructive', title: 'Setup Incomplete', description: 'Firebase is not configured.' });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(userCredential.user, { displayName: values.displayName });
      
      // Send the verification email immediately
      await sendEmailVerification(userCredential.user);
      
      await createUserDocument(db, userCredential.user);
      
      toast({ title: 'Success!', description: 'Account created. Please check your email inbox to verify your account.' });
      router.push('/');
    } catch (error: any) {
      console.error("Signup error:", error.code, error.message);
      const friendlyMessage = getFirebaseAuthErrorMessage(error.code);
      toast({ variant: 'destructive', title: 'Signup Failed', description: friendlyMessage });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !db) {
      toast({ variant: 'destructive', title: 'Setup Incomplete', description: 'Firebase is not configured.' });
      return;
    }
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const userCredential = await signInWithPopup(auth, provider);
        // This will create a document only if the user is new
        try {
          await createUserDocument(db, userCredential.user);
        } catch (firestoreError) {
          console.error("Firestore user document creation error:", firestoreError);
          // Don't block sign-in if Firestore document creation fails
        }
        toast({ title: 'Success', description: 'Signed up with Google successfully!' });
        router.push('/');
    } catch (error: any) {
        console.error("Google sign-in error:", error.code, error.message, error);
        const friendlyMessage = getFirebaseAuthErrorMessage(error.code || 'unknown');
        toast({ variant: 'destructive', title: 'Google Sign-Up Failed', description: friendlyMessage });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Start your journey by creating a free account.
            </p>
          </div>

          <Card className="rounded-2xl">
             <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Enter your details to create your account.</CardDescription>
             </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Max Robinson" {...field} disabled={isSubmitting || isGoogleLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="m@example.com" {...field} disabled={isSubmitting || isGoogleLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                              {...field}
                              disabled={isSubmitting || isGoogleLoading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isSubmitting || isGoogleLoading}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <PasswordStrength password={passwordValue} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting || isGoogleLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>
                            Accept terms and conditions
                          </FormLabel>
                          <FormDescription>
                            You agree to our <Link href="#" className="underline hover:text-primary">Terms of Service and Privacy Policy</Link>.
                          </FormDescription>
                           <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleLoading}>
                    {isSubmitting ? 'Creating Account...' : 'Create an Account'}
                  </Button>
                </form>
              </Form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting || isGoogleLoading}>
                {isGoogleLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.5 109.8 8 244 8c66.8 0 126 21.2 173.4 54.7l-73.4 69.4c-22.3-21.3-52.6-34.2-88-34.2-73.9 0-134.4 60.3-134.4 134.4s60.5 134.4 134.4 134.4c83.8 0 119.2-61.4 123.6-92.8H244v-75.5h244z"></path></svg>
                    Sign up with Google
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter>
              <div className="text-center text-sm w-full">
                Already have an account?{" "}
                <Link href="/login" className="underline text-primary hover:text-primary/80">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
       <div className="relative hidden lg:flex items-center justify-center bg-black text-primary-foreground p-12">
        <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold leading-tight">Join a community built on trust and shared journeys.</h2>
            <p className="mt-4 text-xl text-primary-foreground/80">Sathimate | Meet before you move.</p>
        </div>
      </div>
    </div>
  );
}
