'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile, UserProfileFormData } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone, Edit2, Save, X, Check, AlertCircle, Plus } from 'lucide-react';

const TRAVEL_TYPES = ['Adventure', 'Budget', 'Luxury', 'Cultural', 'Nature', 'Beach', 'Mountain'];
const BUDGETS = ['budget', 'mid-range', 'luxury'];
const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];
const LOOKING_FOR_OPTIONS = ['Travel Partner', 'Group', 'Adventure Buddy', 'Co-traveler'];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { profile, loading, fetchProfile, updateProfile } = useUserProfile();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [formData, setFormData] = useState<UserProfileFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    age: undefined,
    gender: undefined,
    city: '',
    country: '',
    bio: '',
    photoURL: '',
    travelFrom: '',
    travelTo: '',
    travelType: [],
    budget: undefined,
    groupSize: '',
    lookingFor: [],
    phoneVerified: false,
    emailVerified: false,
    emergencyContact: '',
    emergencyContactNumber: '',
    isProfileComplete: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  // Fetch profile on mount
  useEffect(() => {
    if (user?.uid) {
      fetchProfile(user.uid).then((data) => {
        if (data) {
          setProfileExists(true);
          setFormData({
            fullName: data.fullName || '',
            email: data.email || user.email || '',
            phoneNumber: data.phoneNumber || '',
            age: data.age,
            gender: data.gender,
            city: data.city || '',
            country: data.country || '',
            bio: data.bio || '',
            photoURL: data.photoURL || user.photoURL || '',
            travelFrom: data.travelFrom || '',
            travelTo: data.travelTo || '',
            travelType: data.travelType || [],
            budget: data.budget,
            groupSize: data.groupSize || '',
            lookingFor: data.lookingFor || [],
            phoneVerified: data.phoneVerified || false,
            emailVerified: data.emailVerified || false,
            emergencyContact: data.emergencyContact || '',
            emergencyContactNumber: data.emergencyContactNumber || '',
            isProfileComplete: data.isProfileComplete || false,
          });
        } else {
          setProfileExists(false);
          // Pre-fill with user data if no profile exists
          setFormData((prev) => ({
            ...prev,
            fullName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified || false,
          }));
        }
      });
    }
  }, [user, fetchProfile]);

  const isProfileComplete = () => {
    return (
      formData.fullName?.trim() &&
      formData.city?.trim() &&
      formData.country?.trim() &&
      (formData.travelType?.length || 0) > 0
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.country?.trim()) {
      newErrors.country = 'Country is required';
    }
    if ((formData.travelType?.length || 0) === 0) {
      newErrors.travelType = 'Select at least one travel type';
    }
    if (formData.age && (Number(formData.age) < 18 || Number(formData.age) > 120)) {
      newErrors.age = 'Age must be between 18 and 120';
    }
    if (formData.phoneNumber && !/^[+\d\s\-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserProfileFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleTravelTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      travelType: prev.travelType?.includes(type)
        ? prev.travelType.filter((t) => t !== type)
        : [...(prev.travelType || []), type],
    }));
    if (errors.travelType) {
      setErrors((prev) => ({ ...prev, travelType: '' }));
    }
  };

  const handleLookingForToggle = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor?.includes(option)
        ? prev.lookingFor.filter((o) => o !== option)
        : [...(prev.lookingFor || []), option],
    }));
  };

  const handleSave = async () => {
    // Guard: ensure the authenticated user UID is available before attempting any Firestore write.
    // This check uses user.uid from useUser() (onAuthStateChanged), which is the reliable source.
    if (!user?.uid) {
      console.error('[Profile Page] handleSave called but user.uid is undefined. Redirecting to login.');
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to save your profile.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly',
        variant: 'destructive',
      });
      return;
    }

    const profileComplete = Boolean(isProfileComplete());
    console.log(`[Profile Page] handleSave → Initiating save for UID: ${user.uid}`);
    console.log('[Profile Page] handleSave → Form data:', formData);
    console.log(`[Profile Page] handleSave → isProfileComplete: ${profileComplete}`);

    setIsSaving(true);
    try {
      // Pass user.uid explicitly to updateProfile.
      // This eliminates the race condition where auth.currentUser was null inside the hook.
      const success = await updateProfile(user.uid, {
        ...formData,
        isProfileComplete: profileComplete,
      });

      if (success) {
        setProfileExists(true);
        setIsEditing(false);
        console.log(`[Profile Page] handleSave → ✅ Profile saved successfully for UID: ${user.uid}`);
        toast({
          title: 'Success',
          description: profileComplete
            ? 'Your profile is now complete! 🎉'
            : 'Profile saved successfully. Complete your profile to improve discoverability.',
        });
      } else {
        // The hook already logged the real Firebase error. Surface it clearly here.
        console.error(`[Profile Page] handleSave → ❌ updateProfile returned false for UID: ${user.uid}`);
        toast({
          title: 'Error',
          description: 'Failed to save profile. Check the browser console for the exact Firebase error.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  if (userLoading || loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  const showCompleteProfilePrompt = !profileExists || !isProfileComplete();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              {!isEditing && showCompleteProfilePrompt
                ? 'Complete your profile to get discovered by travel partners'
                : 'Manage and update your profile information'}
            </p>
          </div>
          {!isEditing ? (
            <div className="flex gap-2 w-full sm:w-auto">
              {showCompleteProfilePrompt ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white gap-2"
                  size="lg"
                >
                  <Plus className="h-4 w-4" />
                  Complete Profile
                </Button>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex-1 sm:flex-none gap-2"
                  size="lg"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white gap-2"
                size="lg"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 sm:flex-none gap-2"
                size="lg"
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Profile Complete Banner */}
        {isProfileComplete() && !isEditing && (
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">Profile Complete</p>
                <p className="text-sm text-green-700 dark:text-green-300">You're all set! Other travelers can find you now.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Incomplete Profile Warning */}
        {showCompleteProfilePrompt && !isEditing && (
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-200">Complete Your Profile</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Add your information so other travelers can find and connect with you.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Header Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-28 w-28 border-4 border-white dark:border-slate-950 shadow-lg">
                <AvatarImage src={formData.photoURL || ''} alt={formData.fullName} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  {formData.fullName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left space-y-3">
                {isEditing ? (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                      Full Name *
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Your full name"
                      className={`text-2xl font-bold ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>
                ) : (
                  <h2 className="text-3xl font-bold">{formData.fullName || 'Welcome'}</h2>
                )}
                <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="h-4 w-4" />
                  {formData.email}
                </p>
                {(formData.city || formData.country) && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
                    <MapPin className="h-4 w-4" />
                    {formData.city && formData.country
                      ? `${formData.city}, ${formData.country}`
                      : formData.city || formData.country}
                  </p>
                )}
              </div>
              {formData.emailVerified && (
                <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                  <Check className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Personal details to help others know you better</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Age"
                required={false}
                isEditing={isEditing}
                error={errors.age}
                value={isEditing ? (
                  <Input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Age"
                    min="18"
                    max="120"
                    className={errors.age ? 'border-red-500' : ''}
                  />
                ) : (
                  <p>{formData.age || 'Not specified'}</p>
                )}
              />

              <FormField
                label="Gender"
                required={false}
                isEditing={isEditing}
                error={errors.gender}
                value={isEditing ? (
                  <Select value={formData.gender || ''} onValueChange={(val) => handleInputChange('gender', val || undefined)}>
                    <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{formData.gender ? formData.gender.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Not specified'}</p>
                )}
              />

              <FormField
                label="City"
                required={true}
                isEditing={isEditing}
                error={errors.city}
                value={isEditing ? (
                  <Input
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Your city"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                ) : (
                  <p>{formData.city || 'Not specified'}</p>
                )}
              />

              <FormField
                label="Country"
                required={true}
                isEditing={isEditing}
                error={errors.country}
                value={isEditing ? (
                  <Input
                    value={formData.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Your country"
                    className={errors.country ? 'border-red-500' : ''}
                  />
                ) : (
                  <p>{formData.country || 'Not specified'}</p>
                )}
              />

              <FormField
                label="Phone Number"
                required={false}
                isEditing={isEditing}
                error={errors.phoneNumber}
                value={isEditing ? (
                  <Input
                    value={formData.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                ) : (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {formData.phoneNumber || 'Not specified'}
                  </p>
                )}
              />
            </div>

            <div>
              <FormField
                label="Bio"
                required={false}
                isEditing={isEditing}
                error={errors.bio}
                value={isEditing ? (
                  <Textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell travelers about yourself, your travel style, and interests..."
                    rows={4}
                    className={errors.bio ? 'border-red-500' : ''}
                  />
                ) : (
                  <p className="text-muted-foreground">{formData.bio || 'No bio added yet'}</p>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Travel Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Travel Preferences</CardTitle>
            <CardDescription>Help us match you with compatible travelers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Travel From"
                required={false}
                isEditing={isEditing}
                error={errors.travelFrom}
                value={isEditing ? (
                  <Input
                    value={formData.travelFrom || ''}
                    onChange={(e) => handleInputChange('travelFrom', e.target.value)}
                    placeholder="Starting city or region"
                    className={errors.travelFrom ? 'border-red-500' : ''}
                  />
                ) : (
                  <p>{formData.travelFrom || 'Not specified'}</p>
                )}
              />

              <FormField
                label="Travel To"
                required={false}
                isEditing={isEditing}
                error={errors.travelTo}
                value={isEditing ? (
                  <Input
                    value={formData.travelTo || ''}
                    onChange={(e) => handleInputChange('travelTo', e.target.value)}
                    placeholder="Destination"
                    className={errors.travelTo ? 'border-red-500' : ''}
                  />
                ) : (
                  <p>{formData.travelTo || 'Not specified'}</p>
                )}
              />

              <FormField
                label="Budget"
                required={false}
                isEditing={isEditing}
                error={errors.budget}
                value={isEditing ? (
                  <Select value={formData.budget || ''} onValueChange={(val) => handleInputChange('budget', val || undefined)}>
                    <SelectTrigger className={errors.budget ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Budget Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGETS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{formData.budget ? formData.budget.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-') : 'Not specified'}</p>
                )}
              />

              <FormField
                label="Group Size"
                required={false}
                isEditing={isEditing}
                error={errors.groupSize}
                value={isEditing ? (
                  <Input
                    value={formData.groupSize || ''}
                    onChange={(e) => handleInputChange('groupSize', e.target.value)}
                    placeholder="e.g., 2-4 people"
                    className={errors.groupSize ? 'border-red-500' : ''}
                  />
                ) : (
                  <p>{formData.groupSize || 'Not specified'}</p>
                )}
              />
            </div>

            <div>
              <div className="mb-3">
                <label className="text-sm font-semibold block mb-2">
                  Travel Types <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-3">Select at least one travel style</p>
              </div>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_TYPES.map((type) => (
                    <Badge
                      key={type}
                      variant={formData.travelType?.includes(type) ? 'default' : 'outline'}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleTravelTypeToggle(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.travelType && formData.travelType.length > 0 ? (
                    formData.travelType.map((type) => <Badge key={type}>{type}</Badge>)
                  ) : (
                    <p className="text-muted-foreground italic">No travel types selected</p>
                  )}
                </div>
              )}
              {errors.travelType && (
                <p className="text-xs text-red-500 mt-2">{errors.travelType}</p>
              )}
            </div>

            <div>
              <div className="mb-3">
                <label className="text-sm font-semibold block mb-2">Looking For</label>
                <p className="text-xs text-muted-foreground mb-3">What are you looking for?</p>
              </div>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR_OPTIONS.map((option) => (
                    <Badge
                      key={option}
                      variant={formData.lookingFor?.includes(option) ? 'default' : 'outline'}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleLookingForToggle(option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.lookingFor && formData.lookingFor.length > 0 ? (
                    formData.lookingFor.map((option) => <Badge key={option}>{option}</Badge>)
                  ) : (
                    <p className="text-muted-foreground italic">No preferences selected</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Safety & Trust */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Safety & Trust</CardTitle>
            <CardDescription>Emergency information and verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Emergency Contact Name"
                required={false}
                isEditing={isEditing}
                error={errors.emergencyContact}
                value={isEditing ? (
                  <Input
                    value={formData.emergencyContact || ''}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Contact name"
                    className={errors.emergencyContact ? 'border-red-500' : ''}
                  />
                ) : (
                  <p>{formData.emergencyContact || 'Not specified'}</p>
                )}
              />

              <FormField
                label="Emergency Contact Number"
                required={false}
                isEditing={isEditing}
                error={errors.emergencyContactNumber}
                value={isEditing ? (
                  <Input
                    value={formData.emergencyContactNumber || ''}
                    onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                    placeholder="Phone number"
                    className={errors.emergencyContactNumber ? 'border-red-500' : ''}
                  />
                ) : (
                  <p>{formData.emergencyContactNumber || 'Not specified'}</p>
                )}
              />
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <CardContent className="pt-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <p className="font-semibold">Keep your profile safe</p>
                  <p>Never share sensitive information with unknown travelers. Always verify profiles before meeting in person.</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Action Buttons at Bottom */}
        {isEditing && (
          <div className="flex gap-2 justify-end sticky bottom-4 bg-white dark:bg-black/80 p-4 rounded-lg border backdrop-blur-sm">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isSaving}
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              size="lg"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  isEditing: boolean;
  error?: string;
  value: React.ReactNode;
}

function FormField({ label, required = false, isEditing, error, value }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={isEditing ? '' : 'py-2 text-sm'}>
        {value}
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
