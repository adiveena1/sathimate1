'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  sendEmailVerification
} from "firebase/auth";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase-errors";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    grecaptcha?: { reset: (id: number) => void };
  }
}

/**
 * Phone OTP login Firebase ke Blaze (paid) plan par hi chalta hai aur har SMS
 * ka paisa lagta hai. Launch ke liye ye band hai — email + Google dono free hain.
 * Baad mein chalu karne ke liye .env.production mein:
 *   NEXT_PUBLIC_ENABLE_PHONE_AUTH=true
 * Code hataya nahi gaya hai, sirf flag ke peeche hai.
 */
const PHONE_AUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_PHONE_AUTH === 'true';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  useEffect(() => {
    if (!PHONE_AUTH_ENABLED) return;
    if (auth && typeof window !== 'undefined') {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          }
        });
      }
    }
  }, [auth]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = form.formState;

  const handleRedirect = async (uid: string) => {
    try {
      const { getDb } = await import('@/firebase/config-client');
      const { doc, getDoc } = await import('firebase/firestore');
      const db = getDb();
      if (db) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists() && userDoc.data().onboardingComplete) {
          router.push('/discover');
          return;
        }
      }
    } catch (e) {
      console.error('Error checking profile:', e);
    }
    router.push('/onboarding');
  };

  const handleEmailLogin = async (values: z.infer<typeof formSchema>) => {
    if (!auth) return toast({ variant: 'destructive', title: 'Setup Incomplete', description: 'Firebase credentials missing.' });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      
      // Show warning if email is not verified, but still allow login
      if (!userCredential.user.emailVerified) {
        toast({ 
            title: 'Email Not Verified',
            description: 'Please verify your email for full access. Check your inbox for the verification link.',
        });
      } else {
        toast({ title: 'Welcome back! 🎉', description: 'Logged in successfully!' });
      }
      
      await handleRedirect(userCredential.user.uid);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      console.error("Login error:", firebaseError.code, firebaseError.message);
      toast({ variant: 'destructive', title: 'Login Failed', description: getFirebaseAuthErrorMessage(firebaseError.code || 'unknown') });
    }
  };

  const handleResendEmailVerification = async () => {
      if(!auth || !auth.currentUser) {
          toast({ variant: 'destructive', title: 'Error', description: 'Not authenticated.' });
          return;
      }
      try {
          await sendEmailVerification(auth.currentUser);
          toast({ title: 'Email Sent', description: 'A new verification link has been sent to your email.' });
      } catch (error: unknown) {
          const errorMsg = error instanceof Error ? error.message : 'Failed to send verification email';
          console.error('Email verification error:', errorMsg);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not send verification email. Try again later.' });
      }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) return toast({ variant: 'destructive', title: 'Setup Incomplete', description: 'Firebase missing.' });
    setIsGoogleLoading(true);
    try {
        const cred = await signInWithPopup(auth, new GoogleAuthProvider());
        toast({ title: 'Success', description: 'Logged in with Google successfully!' });
        await handleRedirect(cred.user.uid);
    } catch (error: any) {
        console.error("Google sign-in error:", error.code, error.message, error);
        const friendlyMessage = getFirebaseAuthErrorMessage(error.code || 'unknown');
        toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: friendlyMessage });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!auth) return;
    if (phone.length < 10) return toast({ variant: 'destructive', title: 'Invalid Phone', description: 'Enter a valid mobile number with country code.' });

    setIsPhoneLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      toast({ title: 'OTP Sent', description: 'Check your messages for the 6-digit code.' });
    } catch (error: unknown) {
      const err = error as Error;
      console.error(err.message);
      toast({ variant: 'destructive', title: 'Failed to Send OTP', description: err.message || 'Please try again.' });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;
    setIsPhoneLoading(true);
    try {
      const cred = await confirmationResult.confirm(otp);
      toast({ title: 'Verified!', description: 'Phone number verified successfully. Welcome!' });
      await handleRedirect(cred.user.uid);
    } catch (error: unknown) {
      const err = error as Error;
      toast({ variant: 'destructive', title: 'Invalid OTP', description: err.message || 'The code provided is incorrect.' });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {PHONE_AUTH_ENABLED && <div id="recaptcha-container"></div>}

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                 <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-balance text-muted-foreground">
                    Continue planning your next journey — together.
                </p>
            </div>

            <Card className="rounded-2xl border shadow-lg overflow-hidden">
                 <CardHeader className="bg-muted/30 pb-4">
                    <Tabs defaultValue="email" className="w-full">
                        <TabsList className={PHONE_AUTH_ENABLED ? "grid w-full grid-cols-2 mb-2" : "grid w-full grid-cols-1 mb-2"}>
                            <TabsTrigger value="email">Email</TabsTrigger>
                            {PHONE_AUTH_ENABLED && <TabsTrigger value="phone">Mobile OTP</TabsTrigger>}
                        </TabsList>

                        <TabsContent value="email" className="pt-4 space-y-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
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
                                        <div className="flex items-center">
                                        <FormLabel>Password</FormLabel>
                                        <Link href="#" className="ml-auto inline-block text-sm text-primary hover:underline">Forgot your password?</Link>
                                        </div>
                                        <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pr-10"
                                                {...field}
                                                disabled={isSubmitting || isGoogleLoading}
                                            />
                                            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} disabled={isSubmitting || isGoogleLoading}>
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </Button>
                                        </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                
                                <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleLoading}>
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </Button>
                                </form>
                            </Form>
                        </TabsContent>

                        {PHONE_AUTH_ENABLED && (
                        <TabsContent value="phone" className="pt-4 space-y-4">
                            {!isOtpSent ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <FormLabel>Phone Number</FormLabel>
                                        <Input 
                                            type="tel" 
                                            placeholder="+91 9876543210" 
                                            value={phone} 
                                            onChange={(e) => setPhone(e.target.value)} 
                                            disabled={isPhoneLoading}
                                            className="text-lg"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +91)</p>
                                    </div>
                                    <Button onClick={handleSendOtp} className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isPhoneLoading}>
                                        {isPhoneLoading ? "Sending OTP..." : "Get OTP"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <FormLabel>Enter 6-digit OTP sent to {phone}</FormLabel>
                                        <Input 
                                            type="text" 
                                            value={otp} 
                                            onChange={(e) => setOtp(e.target.value)} 
                                            maxLength={6} 
                                            className="text-center text-xl tracking-widest font-mono"
                                            disabled={isPhoneLoading}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button onClick={handleVerifyOtp} className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isPhoneLoading}>
                                            {isPhoneLoading ? "Verifying..." : "Verify & Login"}
                                        </Button>
                                        <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => setIsOtpSent(false)} disabled={isPhoneLoading}>
                                            Wrong number? Change it here.
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                        )}
                    </Tabs>
                 </CardHeader>
                 
                 <CardContent className="pt-4">
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting || isGoogleLoading || isPhoneLoading}>
                        {isGoogleLoading ? (
                            'Signing in...'
                        ) : (
                            <>
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.5 109.8 8 244 8c66.8 0 126 21.2 173.4 54.7l-73.4 69.4c-22.3-21.3-52.6-34.2-88-34.2-73.9 0-134.4 60.3-134.4 134.4s60.5 134.4 134.4 134.4c83.8 0 119.2-61.4 123.6-92.8H244v-75.5h244z"></path></svg>
                                Continue with Google
                            </>
                        )}
                    </Button>
                </CardContent>
                
                <CardFooter className="bg-muted/10 pt-4 border-t">
                    <div className="text-center text-sm w-full">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline text-primary hover:text-primary/80 font-medium">
                            Sign up instantly
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
      </div>
      
      <div className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1080')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 text-center max-w-lg space-y-6 bg-white/40 p-10 backdrop-blur-3xl rounded-3xl border shadow-xl">
            <h2 className="text-4xl font-black tracking-tight text-primary">Your journey begins here.</h2>
            <p className="text-lg font-medium text-slate-700">Join thousands of verified travelers. Explore the world effortlessly with Sathimate.</p>
        </div>
      </div>
    </div>
  );
}
