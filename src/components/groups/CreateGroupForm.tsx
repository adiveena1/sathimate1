'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/firebase';
import { createTravelGroup } from '@/firebase/firestore';

// ── Schema ────────────────────────────────────────────────────────────────────

export const createGroupSchema = z
  .object({
    destination: z
      .string()
      .min(3, { message: 'Destination must be at least 3 characters.' }),
    dateRange: z.object({
      from: z.date({ required_error: 'A start date is required.' }),
      to: z.date({ required_error: 'An end date is required.' }),
    }),
    groupSize: z.coerce
      .number()
      .min(3, { message: 'Group size must be at least 3.' })
      .max(6, { message: 'Group size cannot exceed 6.' }),
    groupType: z.enum(['Budget', 'Backpacking', 'Luxury', 'Local Explore']),
    description: z
      .string()
      .min(20, { message: 'Description must be at least 20 characters.' })
      .max(500, { message: 'Description cannot exceed 500 characters.' }),
    safetyPref: z.enum(['Any', 'Women-Only']),
  })
  .refine((data) => data.dateRange.to > data.dateRange.from, {
    message: 'End date must be after start date.',
    path: ['dateRange'],
  });

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

// ── Constants ─────────────────────────────────────────────────────────────────

const GROUP_TYPES = ['Budget', 'Backpacking', 'Luxury', 'Local Explore'] as const;
const SAFETY_PREFS = ['Any', 'Women-Only'] as const;

// ── Component ─────────────────────────────────────────────────────────────────

interface CreateGroupFormProps {
  onSuccess?: () => void;
}

export function CreateGroupForm({ onSuccess }: CreateGroupFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const today = new Date(new Date().setHours(0, 0, 0, 0));

  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      destination: '',
      groupSize: 4,
      groupType: 'Budget',
      description: '',
      safetyPref: 'Any',
    },
  });

  async function onSubmit(values: CreateGroupFormValues): Promise<void> {
    if (!auth?.currentUser?.uid) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You must be logged in to create a group.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createTravelGroup({
        creatorId: auth.currentUser.uid,
        destination: values.destination,
        dateRange: values.dateRange,
        groupSize: 1,
        maxGroupSize: values.groupSize,
        groupType: values.groupType,
        description: values.description,
        safetyPref: values.safetyPref,
        members: [auth.currentUser.uid],
        status: 'active',
      });

      toast({
        title: 'Group created! 🎉',
        description: `Your group for ${values.destination} is now live.`,
      });

      form.reset();
      setDateRange(undefined);
      onSuccess?.();
      router.push('/groups');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create group. Please try again.';

      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-h-[70vh] overflow-y-auto pr-1"
        noValidate
      >
        {/* Destination */}
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Spiti Valley, Himachal Pradesh"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Travel Dates */}
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Travel Dates</FormLabel>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value?.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, 'LLL dd, y')} —{' '}
                            {format(field.value.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(field.value.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  side="bottom"
                  avoidCollisions={false}
                >
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range: DateRange | undefined) => {
                      setDateRange(range);
                      if (range?.from && range?.to) {
                        field.onChange({ from: range.from, to: range.to });
                        setPopoverOpen(false);
                      } else {
                        field.onChange(undefined);
                      }
                    }}
                    initialFocus
                    numberOfMonths={2}
                    disabled={
                      isMounted
                        ? (date: Date) => date < today
                        : undefined
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Group Type + Safety Preference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="groupType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GROUP_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyPref"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Safety Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SAFETY_PREFS.map((pref) => (
                      <SelectItem key={pref} value={pref}>
                        {pref}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Group Size */}
        <FormField
          control={form.control}
          name="groupSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Group Size: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={3}
                  max={6}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value: number[]) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription>
                Small groups of 3–6 members ensure better connection.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the trip's vibe, key activities, and what kind of people you're looking for..."
                  className="resize-y"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Group...' : 'Create Group'}
        </Button>
      </form>
    </Form>
  );
}