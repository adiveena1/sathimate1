
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { createPlan } from '@/services/sathi-space-service';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '../ui/badge';
import { useFirestore, useUser } from '@/firebase';
import { Skeleton } from '../ui/skeleton';

const interestsList = [ 'Adventure', 'Peace', 'Party', 'Spiritual', 'Culture', 'Backpacking', 'Luxury', 'Foodie', 'History', 'Nature', 'Weekend Trips', 'Budget Trips' ];

const createPlanSchema = z.object({
  destination: z.string().min(3, 'Destination must be at least 3 characters.'),
  fromCity: z.string().min(3, 'Starting city is required.'),
  dateRange: z.object({
    from: z.date({ required_error: 'A start date is required.' }),
    to: z.date({ required_error: 'An end date is required.' }),
  }),
  budget: z.enum(['low', 'mid', 'premium']),
  interests: z.array(z.string()).min(1, 'Select at least one interest.'),
  groupSizeMin: z.coerce.number().min(2).max(20),
  groupSizeMax: z.coerce.number().min(2).max(20),
  groupType: z.enum(['mixed', 'women-only']),
  description: z.string().min(20, 'Description must be at least 20 characters.').max(500),
}).refine(data => data.groupSizeMax >= data.groupSizeMin, {
    message: "Max group size must be greater than or equal to min size.",
    path: ["groupSizeMax"],
});

export function CreatePlanForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof createPlanSchema>>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      destination: '',
      fromCity: '',
      budget: 'mid',
      interests: [],
      groupSizeMin: 2,
      groupSizeMax: 6,
      groupType: 'mixed',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof createPlanSchema>) {
    if (!db || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create a plan.' });
        return;
    }
    
    setIsSubmitting(true);
    try {
        const planData = {
            ...values,
            startDate: values.dateRange.from,
            endDate: values.dateRange.to,
        };
        // @ts-ignore
        delete planData.dateRange;

      await createPlan(db, user, planData);
      toast({
        title: 'Plan Created!',
        description: `Your plan for ${values.destination} is now live.`,
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating plan:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create your plan. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="destination" render={({ field }) => (
                <FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="e.g., Spiti Valley" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="fromCity" render={({ field }) => (
                <FormItem><FormLabel>Starting From (City)</FormLabel><FormControl><Input placeholder="e.g., Delhi" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <FormField control={form.control} name="dateRange" render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabel>Travel Dates</FormLabel>
              <Popover><PopoverTrigger asChild><FormControl>
                  <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !field.value?.from && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (field.value.to ? (<>{format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}</>) : (format(field.value.from, 'LLL dd, y'))) : (<span>Pick a date range</span>)}
                  </Button>
              </FormControl></PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    numberOfMonths={2}
                    disabled={isMounted ? (date) => date < new Date(new Date().setHours(0, 0, 0, 0)) : undefined}
                />
              </PopoverContent></Popover><FormMessage />
            </FormItem>
        )}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="budget" render={({ field }) => (
                <FormItem><FormLabel>Budget</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select budget range" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="low">Low (Under $50/day)</SelectItem><SelectItem value="mid">Mid ($50 - $150/day)</SelectItem><SelectItem value="premium">Premium ($150+/day)</SelectItem></SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="interests" render={({ field }) => (
                <FormItem><FormLabel>Interests</FormLabel>
                    <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value.length && "text-muted-foreground")}>
                            {field.value.length > 0 ? `${field.value.length} selected` : "Select interests"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl></PopoverTrigger>
                    <PopoverContent className="w-full p-0"><Command>
                        <CommandInput placeholder="Search interests..." />
                        <CommandEmpty>No interest found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>{interestsList.map(interest => (
                                <CommandItem key={interest} onSelect={() => {
                                    const selected = field.value.includes(interest) ? field.value.filter(i => i !== interest) : [...field.value, interest];
                                    field.onChange(selected);
                                }}>
                                    <Check className={cn("mr-2 h-4 w-4", field.value.includes(interest) ? "opacity-100" : "opacity-0")} />
                                    {interest}
                                </CommandItem>
                            ))}</CommandGroup>
                        </CommandList>
                    </Command></PopoverContent></Popover>
                    <div className="flex flex-wrap gap-1">{field.value.map(i => <Badge key={i}>{i}</Badge>)}</div>
                <FormMessage /></FormItem>
            )}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField control={form.control} name="groupSizeMin" render={({ field }) => (
                <FormItem><FormLabel>Min Group Size</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="groupSizeMax" render={({ field }) => (
                <FormItem><FormLabel>Max Group Size</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="groupType" render={({ field }) => (
                <FormItem><FormLabel>Group Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="mixed">Mixed</SelectItem><SelectItem value="women-only">Women-Only</SelectItem></SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
        </div>
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Trip Description</FormLabel><FormControl>
                <Textarea placeholder="Describe the trip's vibe, key activities, and what kind of people you're looking for..." className="resize-y" rows={4} {...field}/>
            </FormControl><FormMessage /></FormItem>
        )}/>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating Plan...' : 'Create Plan'}</Button>
      </form>
    </Form>
  );
}
