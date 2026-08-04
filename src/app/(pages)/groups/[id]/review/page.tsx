'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Camera,
  Check,
  Loader2,
  MapPin,
  ShieldAlert,
  Star,
  Users,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { getTravelGroup, getTravelerProfile } from '@/firebase/firestore';
import { reviewService } from '@/services/review-service';
import { travellerService } from '@/services/traveller-service';
import { COMPLIMENT_TAGS, RATING_LABELS, type MemberFeedback } from '@/types/review';
import type { TravelGroup } from '@/types';

const MIN_NOTE_LENGTH = 30;
const MAX_PHOTOS = 8;

type Member = { uid: string; name: string; photoURL?: string };

/* ------------------------------------------------------------------ */
/* Stars                                                               */
/* ------------------------------------------------------------------ */

function StarRow({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-base">{label}</span>
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star
              className={
                n <= (hover || value)
                  ? 'h-7 w-7 fill-accent text-accent'
                  : 'h-7 w-7 text-muted-foreground/40'
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Member card                                                         */
/* ------------------------------------------------------------------ */

function MemberCard({
  member,
  feedback,
  onChange,
}: {
  member: Member;
  feedback: MemberFeedback;
  onChange: (next: MemberFeedback) => void;
}) {
  const [showSafety, setShowSafety] = useState(false);

  const toggleTag = (tag: (typeof COMPLIMENT_TAGS)[number]) => {
    const has = feedback.compliments.includes(tag);
    onChange({
      ...feedback,
      compliments: has
        ? feedback.compliments.filter((t) => t !== tag)
        : [...feedback.compliments, tag],
    });
  };

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src={member.photoURL} alt="" />
          <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="font-headline font-semibold">{member.name}</p>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">Would you travel with them again?</p>
      <div className="mt-2 flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={feedback.wouldTravelAgain === true ? 'default' : 'outline'}
          onClick={() => onChange({ ...feedback, wouldTravelAgain: true })}
        >
          <Check className="mr-1.5 h-4 w-4" /> Yes
        </Button>
        <Button
          type="button"
          size="sm"
          variant={feedback.wouldTravelAgain === false ? 'default' : 'outline'}
          onClick={() => onChange({ ...feedback, wouldTravelAgain: false })}
        >
          <X className="mr-1.5 h-4 w-4" /> No
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {COMPLIMENT_TAGS.map((tag) => {
          const active = feedback.compliments.includes(tag);
          return (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}>
              <Badge
                variant={active ? 'default' : 'outline'}
                className="cursor-pointer font-normal"
              >
                {tag}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Safety note har member ke saath available hai, chhupa hua nahi.
          Jise zaroorat hai use dhoondhna na pade. */}
      {!showSafety ? (
        <button
          type="button"
          onClick={() => setShowSafety(true)}
          className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Something private to report about them?
        </button>
      ) : (
        <div className="mt-4">
          <p className="mb-2 text-sm text-muted-foreground">
            Only the Sathimate safety team reads this. {member.name} will never
            see it — not now, not later.
          </p>
          <Textarea
            value={feedback.privateSafetyNote ?? ''}
            onChange={(e) => onChange({ ...feedback, privateSafetyNote: e.target.value })}
            placeholder="What happened?"
            rows={3}
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TripReviewPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const groupId = params.id as string;

  const [group, setGroup] = useState<TravelGroup | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [ratings, setRatings] = useState({ overall: 0, safety: 0, organisation: 0 });
  const [publicNote, setPublicNote] = useState('');
  const [productFeedback, setProductFeedback] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [memberFeedback, setMemberFeedback] = useState<MemberFeedback[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);

  /* ---- load ---- */
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const alreadyDone = await reviewService.hasSubmitted(groupId);
        if (alreadyDone) {
          setSubmitted(true);
          setLoading(false);
          return;
        }

        const g = await getTravelGroup(groupId);
        if (!g) {
          toast({ title: 'Trip not found.', variant: 'destructive' });
          router.push('/my-groups');
          return;
        }
        setGroup(g);

        const others = (g.members ?? []).filter((uid: string) => uid !== user.uid);
        const profiles = await Promise.all(
          others.map(async (uid: string) => {
            const p = await getTravelerProfile(uid).catch(() => null);
            return {
              uid,
              name: p?.fullName ?? 'Traveller',
              photoURL: p?.photoURL,
            } as Member;
          })
        );
        setMembers(profiles);

        const draft = await reviewService.loadDraft(groupId);
        if (draft) {
          if (draft.ratings) setRatings(draft.ratings);
          if (draft.publicNote) setPublicNote(draft.publicNote);
          if (draft.productFeedback) setProductFeedback(draft.productFeedback);
          if (draft.photoUrls) setPhotoUrls(draft.photoUrls);
        }

        setMemberFeedback(
          profiles.map((p) => {
            const saved = draft?.memberFeedback?.find((m) => m.revieweeId === p.uid);
            return (
              saved ?? { revieweeId: p.uid, wouldTravelAgain: null, compliments: [] }
            );
          })
        );
      } catch {
        toast({ title: 'Could not load this page.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [user, groupId, router, toast]);

  /* ---- autosave draft (debounced) ---- */
  useEffect(() => {
    if (loading || submitted || !user) return;
    const t = setTimeout(() => {
      reviewService
        .saveDraft(groupId, { ratings, publicNote, productFeedback, photoUrls, memberFeedback })
        .catch(() => {
          /* draft save best-effort hai — fail ho to user ko disturb mat karo */
        });
    }, 1200);
    return () => clearTimeout(t);
  }, [ratings, publicNote, productFeedback, photoUrls, memberFeedback, groupId, loading, submitted, user]);

  /* ---- photos ---- */
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const room = MAX_PHOTOS - photoUrls.length;
      if (room <= 0) {
        toast({ title: `Up to ${MAX_PHOTOS} photos.` });
        return;
      }

      setUploading(true);
      try {
        const uploaded: string[] = [];
        for (const file of Array.from(files).slice(0, room)) {
          // Wahi /api/upload route — photos VPS par jaati hain, Firebase
          // Storage par nahi (Blaze plan bachane ke liye).
          const url = await travellerService.uploadPhoto(user!.uid, file);
          uploaded.push(url);
        }
        setPhotoUrls((prev) => [...prev, ...uploaded]);
      } catch (err) {
        toast({
          title: 'Photo upload failed.',
          description: err instanceof Error ? err.message : undefined,
          variant: 'destructive',
        });
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [photoUrls.length, toast, user]
  );

  /* ---- validation ---- */
  const errors = useMemo(() => {
    const e: string[] = [];
    if (ratings.overall === 0) e.push('An overall rating is required.');
    if (publicNote.trim().length > 0 && publicNote.trim().length < MIN_NOTE_LENGTH)
      e.push(`Review must be at least ${MIN_NOTE_LENGTH} characters.`);
    return e;
  }, [ratings.overall, publicNote]);

  const handleSubmit = async () => {
    if (errors.length) {
      toast({ title: errors[0], variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.submit(
        groupId,
        { ratings, publicNote, productFeedback, photoUrls, memberFeedback },
        group?.members ?? []
      );
      setSubmitted(true);
    } catch (err) {
      toast({
        title: 'Could not submit.',
        description: err instanceof Error ? err.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- render ---- */
  if (authLoading || loading) {
    return (
      <div className="container mx-auto max-w-3xl space-y-6 px-4 py-12">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-headline text-3xl font-extrabold">Thank you.</h1>
        <p className="mt-4 text-muted-foreground">
          Your review stays hidden until everyone else in the group submits theirs — so nobody reads one and rewrites their own.
        </p>
        <div className="mt-8 flex gap-3">
          <Button onClick={() => router.push('/discover')}>Explore new trips</Button>
          <Button variant="outline" onClick={() => router.push('/my-groups')}>
            My groups
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-8 -ml-2">
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
      </Button>

      {/* ---- Header ---- */}
      <div className="mb-10">
        <p className="font-headline text-sm uppercase tracking-[0.2em] text-accent">
          Trip complete
        </p>
        <h1 className="mt-3 font-headline text-4xl font-extrabold tracking-tight">
          {group?.destination} is done.
        </h1>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {group?.dateRange?.from && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {format(new Date(group.dateRange.from), 'd MMM')} –{' '}
              {group.dateRange.to ? format(new Date(group.dateRange.to), 'd MMM yyyy') : ''}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {group?.members?.length ?? 0} travellers
          </span>
        </div>
        <p className="mt-6 text-muted-foreground">
          Takes two minutes. Everything except the overall rating is optional.
        </p>
      </div>

      {/* ---- Ratings ---- */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline">How was the trip</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {(Object.keys(RATING_LABELS) as (keyof typeof RATING_LABELS)[]).map((key) => (
            <StarRow
              key={key}
              label={RATING_LABELS[key]}
              value={ratings[key]}
              onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
            />
          ))}
        </CardContent>
      </Card>

      {/* ---- Photos ---- */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline">Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photoUrls.map((url) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrls((p) => p.filter((u) => u !== url))}
                  aria-label="Remove photo"
                  className="absolute right-1 top-1 rounded-full bg-background/90 p-1 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {photoUrls.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            JPG, PNG or WebP. Max 5MB each, up to {MAX_PHOTOS}.
          </p>
        </CardContent>
      </Card>

      {/* ---- Public note ---- */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline">Anything to write?</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={publicNote}
            onChange={(e) => setPublicNote(e.target.value)}
            placeholder="What was the best part? What did not work?"
            rows={4}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            This will be visible on the group page.
          </p>
        </CardContent>
      </Card>

      {/* ---- Members ---- */}
      {members.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-headline">The people you travelled with</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No star ratings here, on purpose. In a small group everyone works out who rated them what — and then nobody writes the truth.
            </p>
            {members.map((m, i) => (
              <MemberCard
                key={m.uid}
                member={m}
                feedback={memberFeedback[i] ?? { revieweeId: m.uid, wouldTravelAgain: null, compliments: [] }}
                onChange={(next) =>
                  setMemberFeedback((prev) => prev.map((f, idx) => (idx === i ? next : f)))
                }
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* ---- Product feedback ---- */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-headline">About Sathimate</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={productFeedback}
            onChange={(e) => setProductFeedback(e.target.value)}
            placeholder="What felt broken? What is missing?"
            rows={3}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Only we read this. The group never sees it.
          </p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* ---- Serious report ---- */}
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div>
          <p className="font-medium">Did something serious happen?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Harassment, threats or money fraud — do not put it in a review. Report it directly and we look within 24 hours.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => router.push(`/report?groupId=${groupId}`)}
          >
            Report
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={submitting || ratings.overall === 0}
      >
        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Submit review
      </Button>
      {ratings.overall === 0 && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Please give at least an overall rating.
        </p>
      )}
    </div>
  );
}
