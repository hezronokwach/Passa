'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { createEvent } from '@/app/actions/organizer';
import { ClientHeader } from '@/components/passa/client-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type TicketTier = {
  id: string;
  name: string;
  price: string;
  quantity: string;
};

const PRESET_TIERS = [
  { name: 'Free', price: '0' },
  { name: 'Early Bird', price: '5' },
  { name: 'General Admission', price: '10' },
  { name: 'VIP', price: '25' },
  { name: 'VVIP', price: '50' },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? 'Creating Event...' : 'Create Event'}
    </Button>
  );
}

export default function CreateEventPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);

  const [dateInput, setDateInput] = React.useState('');
  const [timeInput, setTimeInput] = React.useState('');
  const [ticketTiers, setTicketTiers] = React.useState<TicketTier[]>([
    { id: '1', name: 'General Admission', price: '10', quantity: '100' }
  ]);
  const [step1Data, setStep1Data] = React.useState({
    title: '',
    description: '',
    location: '',
    country: '',
    imageUrl: ''
  });
  const [uploadedImage, setUploadedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>('');

  const [state, formAction] = useActionState(createEvent, {
    message: '',
    errors: {},
    success: false,
  });

  React.useEffect(() => {
    if (state.success) {
      toast({
        title: '🎉 Event Created Successfully!',
        description: 'Your event has been created and saved as a draft. You can now publish it to invite artists.',
        duration: 4000,
      });
      // Redirect after showing success message
      setTimeout(() => {
        window.location.href = '/dashboard/organizer';
      }, 3000);
    } else if (state.message && !state.success && Object.keys(state.errors).length === 0) {
      toast({ 
        title: 'Error Creating Event', 
        description: state.message, 
        variant: 'destructive',
        duration: 5000
      });
    }
  }, [state, toast]);

  const addTicketTier = (preset?: { name: string; price: string }) => {
    const newTier: TicketTier = {
      id: Date.now().toString(),
      name: preset?.name || 'Custom Tier',
      price: preset?.price || '0',
      quantity: '100'
    };
    setTicketTiers([...ticketTiers, newTier]);
  };

  const removeTicketTier = (id: string) => {
    setTicketTiers(ticketTiers.filter(tier => tier.id !== id));
  };

  const updateTicketTier = (id: string, field: keyof TicketTier, value: string) => {
    setTicketTiers(ticketTiers.map(tier => 
      tier.id === id ? { ...tier, [field]: value } : tier
    ));
  };

  const isStep1Valid = () => {
    const hasValidDate = Boolean(dateInput);
    const hasValidTime = Boolean(timeInput);
    const hasValidImage = step1Data.imageUrl.length > 0 || uploadedImage;
    
    return step1Data.title.length >= 3 && 
           step1Data.description.length >= 10 && 
           step1Data.location.length >= 2 && 
           step1Data.country.length >= 2 && 
           hasValidDate &&
           hasValidTime &&
           hasValidImage;
  };

  const handleStep1Next = () => {
    if (isStep1Valid()) {
      setCurrentStep(2);
    } else {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill in all required fields before proceeding.',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the file immediately
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        if (result.success) {
          setStep1Data({...step1Data, imageUrl: result.imageUrl});
          toast({
            title: 'Image Uploaded',
            description: 'Your event image has been uploaded successfully.',
          });
        } else {
          toast({
            title: 'Upload Failed',
            description: result.error || 'Failed to upload image.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        toast({
          title: 'Upload Error',
          description: 'Failed to upload image. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview('');
    setStep1Data({...step1Data, imageUrl: ''});
  };

  const handleSubmit = async (formData: FormData) => {
    // Add step 1 data
    formData.set('title', step1Data.title);
    formData.set('description', step1Data.description);
    formData.set('location', step1Data.location);
    formData.set('country', step1Data.country);
    formData.set('imageUrl', step1Data.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(step1Data.title)}`);

    // Handle date and time separately
    if (dateInput) {
      formData.set('date', dateInput);
    }
    if (timeInput) {
      formData.set('time', timeInput);
    }

    // Use uploaded image URL or fallback to placeholder
    if (step1Data.imageUrl) {
      formData.set('imageUrl', step1Data.imageUrl);
    } else {
      formData.set('imageUrl', `https://placehold.co/600x400.png?text=${encodeURIComponent(step1Data.title)}`);
    }

    formData.set('tickets', JSON.stringify(ticketTiers));
    formAction(formData);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
      <ClientHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/dashboard/organizer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>
            
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  1
                </div>
                <div className={cn(
                  "h-px flex-1",
                  currentStep > 1 ? "bg-primary" : "bg-muted"
                )} />
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  2
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm font-medium">Event Details</span>
                <span className="text-sm font-medium">Ticket Setup</span>
              </div>
            </div>

            <form action={handleSubmit}>
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-3xl">Event Details</CardTitle>
                    <CardDescription>Tell us about your event</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                      <Input 
                        id="title" 
                        name="title" 
                        placeholder="e.g., Afrochella Festival" 
                        value={step1Data.title}
                        onChange={(e) => setStep1Data({...step1Data, title: e.target.value})}
                        className={step1Data.title.length > 0 && step1Data.title.length < 3 ? "border-red-300" : ""}
                      />
                      {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                      {step1Data.title.length > 0 && step1Data.title.length < 3 && (
                        <p className="text-sm text-orange-600">Title must be at least 3 characters</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Event Description <span className="text-red-500">*</span></Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        placeholder="Tell everyone what makes your event special..." 
                        value={step1Data.description}
                        onChange={(e) => setStep1Data({...step1Data, description: e.target.value})}
                        className={step1Data.description.length > 0 && step1Data.description.length < 10 ? "border-red-300" : ""}
                      />
                      {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
                      {step1Data.description.length > 0 && step1Data.description.length < 10 && (
                        <p className="text-sm text-orange-600">Description must be at least 10 characters</p>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                        <Input 
                          id="location" 
                          name="location" 
                          placeholder="e.g., Nairobi" 
                          value={step1Data.location}
                          onChange={(e) => setStep1Data({...step1Data, location: e.target.value})}
                          className={step1Data.location.length > 0 && step1Data.location.length < 2 ? "border-red-300" : ""}
                        />
                        {state.errors?.location && <p className="text-sm text-destructive">{state.errors.location[0]}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                        <Input 
                          id="country" 
                          name="country" 
                          placeholder="e.g., Kenya" 
                          value={step1Data.country}
                          onChange={(e) => setStep1Data({...step1Data, country: e.target.value})}
                          className={step1Data.country.length > 0 && step1Data.country.length < 2 ? "border-red-300" : ""}
                        />
                        {state.errors?.country && <p className="text-sm text-destructive">{state.errors.country[0]}</p>}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="eventDate">Event Date <span className="text-red-500">*</span></Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={dateInput}
                          onChange={(e) => setDateInput(e.target.value)}
                          min={new Date().toISOString().slice(0, 10)}
                        />
                        {state.errors?.date && <p className="text-sm text-destructive">{state.errors.date[0]}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eventTime">Event Time <span className="text-red-500">*</span></Label>
                        <Input
                          id="eventTime"
                          type="time"
                          value={timeInput}
                          onChange={(e) => setTimeInput(e.target.value)}
                        />
                        {state.errors?.time && <p className="text-sm text-destructive">{state.errors.time[0]}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Event Image <span className="text-red-500">*</span></Label>
                      <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="upload">Upload Image</TabsTrigger>
                          <TabsTrigger value="url">Image URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="space-y-4">
                          {!imagePreview ? (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                              <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <div className="mt-4">
                                  <Label htmlFor="image-upload" className="cursor-pointer">
                                    <span className="mt-2 block text-sm font-medium text-foreground">
                                      Click to upload an image
                                    </span>
                                    <span className="mt-1 block text-xs text-muted-foreground">
                                      PNG, JPG, GIF up to 10MB
                                    </span>
                                  </Label>
                                  <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <Image
                                src={imagePreview}
                                alt="Event preview"
                                width={600}
                                height={192}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="url">
                          <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input 
                              id="imageUrl" 
                              name="imageUrl" 
                              placeholder="https://placehold.co/600x400.png" 
                              value={step1Data.imageUrl}
                              onChange={(e) => setStep1Data({...step1Data, imageUrl: e.target.value})}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                      {state.errors?.imageUrl && <p className="text-sm text-destructive">{state.errors.imageUrl[0]}</p>}
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={handleStep1Next}
                        disabled={!isStep1Valid()}
                      >
                        Next: Ticket Setup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-3xl">Ticket Setup</CardTitle>
                    <CardDescription>Configure your ticket tiers and pricing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {PRESET_TIERS?.map((preset) => (
                          <Button
                            key={preset.name}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addTicketTier(preset)}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add {preset.name}
                          </Button>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTicketTier()}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Custom Tier
                        </Button>
                      </div>

                      {ticketTiers?.map((tier) => (
                        <Card key={tier.id}>
                          <CardContent className="pt-6">
                            <div className="grid md:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label>Tier Name <span className="text-red-500">*</span></Label>
                                <Input
                                  value={tier.name}
                                  onChange={(e) => updateTicketTier(tier.id, 'name', e.target.value)}
                                  placeholder="Tier name"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Price (XLM) <span className="text-red-500">*</span></Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={tier.price}
                                  onChange={(e) => updateTicketTier(tier.id, 'price', e.target.value)}
                                  placeholder="0.00"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Quantity <span className="text-red-500">*</span></Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={tier.quantity}
                                  onChange={(e) => updateTicketTier(tier.id, 'quantity', e.target.value)}
                                  placeholder="100"
                                  required
                                />
                              </div>
                              <div className="flex items-end">
                                {ticketTiers && ticketTiers.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeTicketTier(tier.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {state.errors?.tickets && <p className="text-sm text-destructive">{state.errors.tickets[0]}</p>}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        📝 <strong>Note:</strong> After creating your event, remember to publish it from your dashboard to make it visible to attendees.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      <SubmitButton />
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
