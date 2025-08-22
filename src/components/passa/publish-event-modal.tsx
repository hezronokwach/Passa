'use client';

import React from 'react';
import { useActionState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Users, DollarSign, Search, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendArtistInvitations } from '@/app/actions/artist-invitations';

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  country: string;
};

type Artist = {
  id: string;
  name: string;
  email: string;
  fee: string;
  isExisting: boolean;
  userId?: number;
};

type ExistingArtist = {
  id: number;
  name: string;
  email: string;
  skills: string[];
};

interface PublishEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
}

export function PublishEventModal({ open, onOpenChange, event }: PublishEventModalProps) {
  const { toast } = useToast();
  const [totalBudget, setTotalBudget] = React.useState('');
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [eventMessage, setEventMessage] = React.useState('');
  const [existingArtists, setExistingArtists] = React.useState<ExistingArtist[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [, setIsSearching] = React.useState(false);
  const [validationError, setValidationError] = React.useState('');
  
  const [invitationState, sendInvitations] = useActionState(sendArtistInvitations, {
    message: '',
    errors: {},
    success: false,
  });

  const addArtist = (existingArtist?: ExistingArtist) => {
    const newArtist: Artist = {
      id: Date.now().toString(),
      name: existingArtist?.name || '',
      email: existingArtist?.email || '',
      fee: '',
      isExisting: !!existingArtist,
      userId: existingArtist?.id
    };
    setArtists([...artists, newArtist]);
  };

  const searchArtists = async (query: string) => {
    if (!query.trim()) {
      setExistingArtists([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/artists/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const artists = await response.json();
        setExistingArtists(artists);
      } else {
        setExistingArtists([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setExistingArtists([]);
    } finally {
      setIsSearching(false);
    }
  };

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      searchArtists(searchQuery);
    }, 300);
    
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const removeArtist = (id: string) => {
    setArtists(artists.filter(artist => artist.id !== id));
  };

  const updateArtist = (id: string, field: keyof Artist, value: string | boolean) => {
    setArtists(artists.map(artist => 
      artist.id === id ? { ...artist, [field]: value } : artist
    ));
  };

  const totalFees = artists.reduce((sum, artist) => sum + (parseFloat(artist.fee) || 0), 0);
  const remainingBudget = (parseFloat(totalBudget) || 0) - totalFees;
  const budgetExceeded = remainingBudget < 0;

  const handleSendInvitations = (formData: FormData) => {
    setValidationError(''); // Clear previous errors
    
    // Validate message to artists
    if (!eventMessage.trim()) {
      const error = 'Please add a message to artists explaining the opportunity.';
      setValidationError(error);
      toast({
        title: 'Message Required',
        description: error,
        variant: 'destructive'
      });
      return;
    }

    // Validate budget
    if (!totalBudget || parseFloat(totalBudget) <= 0) {
      const error = 'Please enter a valid budget amount.';
      setValidationError(error);
      toast({
        title: 'Budget Required',
        description: error,
        variant: 'destructive'
      });
      return;
    }

    // Validate artists
    if (artists.length === 0) {
      const error = 'Please add at least one artist to invite.';
      setValidationError(error);
      toast({
        title: 'No Artists Added',
        description: error,
        variant: 'destructive'
      });
      return;
    }

    // Validate artist details
    const incompleteArtists = artists.filter(artist => 
      !artist.name.trim() || !artist.email.trim() || !artist.fee || parseFloat(artist.fee) <= 0
    );
    
    if (incompleteArtists.length > 0) {
      const error = 'Please fill in all required fields for each artist (name, email, fee).';
      setValidationError(error);
      toast({
        title: 'Incomplete Artist Information',
        description: error,
        variant: 'destructive'
      });
      return;
    }

    if (budgetExceeded) {
      const error = 'Total artist fees exceed the available budget.';
      setValidationError(error);
      toast({
        title: 'Budget Exceeded',
        description: error,
        variant: 'destructive'
      });
      return;
    }

    formData.set('eventId', event.id.toString());
    formData.set('totalBudget', totalBudget);
    formData.set('eventMessage', eventMessage);
    formData.set('artists', JSON.stringify(artists));
    
    sendInvitations(formData);
  };

  React.useEffect(() => {
    if (invitationState?.success) {
      toast({
        title: 'Invitations Sent!',
        description: invitationState.message,
      });
      setCurrentStep(2);
    } else if (invitationState?.message && !invitationState?.success) {
      toast({
        title: 'Error',
        description: invitationState.message,
        variant: 'destructive'
      });
    }
  }, [invitationState, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Publish Event</DialogTitle>
          <DialogDescription>
            Invite artists and set up revenue splits for your event
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <div className={`h-px flex-1 ${currentStep > 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
          </div>

          {currentStep === 1 && (
            <>
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Title</Label>
                      <p className="text-sm text-muted-foreground">{event.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Date</Label>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm text-muted-foreground">
                        {event.location}{event.country && `, ${event.country}`}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventMessage">Message to Artists <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="eventMessage"
                      placeholder="Tell artists about this opportunity, your vision, and what you're looking for..."
                      value={eventMessage}
                      onChange={(e) => setEventMessage(e.target.value)}
                      rows={3}
                      className={!eventMessage.trim() ? "border-red-300" : ""}
                      required
                    />
                    {!eventMessage.trim() && (
                      <p className="text-sm text-orange-600">Message to artists is required</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Budget Setup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Budget Setup
                  </CardTitle>
                  <CardDescription>Set your total budget for artist fees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Total Budget (USD) <span className="text-red-500">*</span></Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="10000.00"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className={!totalBudget ? "border-red-300" : ""}
                      required
                    />
                    {!totalBudget && (
                      <p className="text-sm text-orange-600">Budget is required to publish event</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Artist Invitations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Artist Invitations
                  </CardTitle>
                  <CardDescription>Search existing artists or add new ones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="search" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="search">Search Artists</TabsTrigger>
                      <TabsTrigger value="manual">Add Manually</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="search" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Search Platform Artists</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      {existingArtists.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {existingArtists.map((artist) => (
                            <div key={artist.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <User className="h-8 w-8 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{artist.name}</p>
                                  <p className="text-sm text-muted-foreground">{artist.email}</p>
                                  <div className="flex gap-1 mt-1">
                                    {artist.skills.slice(0, 2).map((skill) => (
                                      <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => addArtist(artist)}
                                disabled={artists.some(a => a.userId === artist.id)}
                              >
                                {artists.some(a => a.userId === artist.id) ? 'Added' : 'Add'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="manual">
                      <Button type="button" variant="outline" onClick={() => addArtist()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Artist
                      </Button>
                    </TabsContent>
                  </Tabs>

                  {/* Added Artists */}
                  {artists.length > 0 && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Added Artists</Label>
                      {artists.map((artist) => (
                        <div key={artist.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {artist.isExisting && <Badge variant="secondary">Platform Artist</Badge>}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArtist(artist.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Artist Name <span className="text-red-500">*</span></Label>
                              <Input
                                placeholder="Artist name"
                                value={artist.name}
                                onChange={(e) => updateArtist(artist.id, 'name', e.target.value)}
                                disabled={artist.isExisting}
                                className={!artist.name && !artist.isExisting ? "border-red-300" : ""}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email <span className="text-red-500">*</span></Label>
                              <Input
                                type="email"
                                placeholder="artist@example.com"
                                value={artist.email}
                                onChange={(e) => updateArtist(artist.id, 'email', e.target.value)}
                                disabled={artist.isExisting}
                                className={!artist.email && !artist.isExisting ? "border-red-300" : ""}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Fee (USD) <span className="text-red-500">*</span></Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="5000.00"
                                value={artist.fee}
                                onChange={(e) => updateArtist(artist.id, 'fee', e.target.value)}
                                className={!artist.fee ? "border-red-300" : ""}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Budget Summary */}
                  {totalBudget && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Budget:</span>
                        <span>${parseFloat(totalBudget).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Artist Fees:</span>
                        <span>${totalFees.toFixed(2)}</span>
                      </div>
                      <div className={`flex justify-between text-sm font-medium ${
                        budgetExceeded ? 'text-destructive' : 'text-foreground'
                      }`}>
                        <span>Remaining:</span>
                        <span>${remainingBudget.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {validationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-red-800 font-medium">Error</p>
                  </div>
                  <p className="text-red-700 mt-1">{validationError}</p>
                </div>
              )}

              <form action={handleSendInvitations}>
                <div className="flex justify-end">
                  <Button type="submit">
                    Send Invitations
                  </Button>
                </div>
              </form>
            </>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Invitations Sent</CardTitle>
                <CardDescription>
                  Artists will receive notifications and can respond through their dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {artists.map((artist) => (
                  <div key={artist.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{artist.name}</p>
                      <p className="text-sm text-muted-foreground">{artist.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${parseFloat(artist.fee).toFixed(2)}</p>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                  <Button onClick={() => onOpenChange(false)}>
                    Manage Invitations
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}