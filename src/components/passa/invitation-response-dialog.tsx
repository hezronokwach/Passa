'use client';

import React from 'react';
import { useActionState, useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, User, Check, X, History, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { respondToInvitation } from '@/app/actions/invitation-response';

type Invitation = {
  id: number;
  artistName: string;
  proposedFee: number;
  message: string;
  status: string;
  event: {
    title: string;
    description: string;
    date: string;
    location: string;
    country: string;
  };
  history: Array<{
    id: number;
    action: string;
    oldStatus: string;
    newStatus: string;
    oldFee: number;
    newFee: number;
    comments: string;
    createdAt: string;
  }>;
};

interface InvitationResponseDialogProps {
  invitation: Invitation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResponse: () => void;
}

export function InvitationResponseDialog({ 
  invitation, 
  open, 
  onOpenChange, 
  onResponse 
}: InvitationResponseDialogProps) {
  const { toast } = useToast();
  const [comments, setComments] = React.useState('');
  const [isPending, startTransition] = useTransition();
  
  const [state, formAction] = useActionState(respondToInvitation, {
    message: '',
    errors: {},
    success: false,
  });

  const handleResponse = (status: 'ACCEPTED' | 'REJECTED') => {
    startTransition(() => {
      const formData = new FormData();
      formData.set('invitationId', invitation.id.toString());
      formData.set('status', status);
      formData.set('comments', comments);
      formAction(formData);
    });
  };

  React.useEffect(() => {
    if (state.success) {
      toast({
        title: 'Response Sent!',
        description: state.message,
      });
      onResponse();
    } else if (state.message && !state.success) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive'
      });
    }
  }, [state, toast, onResponse]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Artist Invitation</DialogTitle>
          <DialogDescription>
            Review the event details and respond to the invitation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {invitation.event.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{invitation.event.location}, {invitation.event.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(invitation.event.date).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{invitation.event.description}</p>
            </CardContent>
          </Card>

          {/* Invitation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Invitation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Proposed Fee:</span>
                <Badge variant="secondary" className="text-lg font-bold">
                  ${invitation.proposedFee.toFixed(2)}
                </Badge>
              </div>
              {invitation.message && (
                <div>
                  <Label className="text-sm font-medium">Message from Organizer:</Label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                    {invitation.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History Trail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Negotiation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invitation.history?.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                    <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {entry.action}
                        </Badge>
                        {entry.oldFee !== entry.newFee && (
                          <span className="text-xs text-muted-foreground">
                            ${entry.oldFee?.toFixed(2)} → ${entry.newFee?.toFixed(2)}
                          </span>
                        )}
                        {entry.oldStatus !== entry.newStatus && (
                          <span className="text-xs text-muted-foreground">
                            {entry.oldStatus} → {entry.newStatus}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{entry.comments}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>

          {/* Response Section */}
          {invitation.status === 'PENDING' && (
            <Card>
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
                <CardDescription>
                  Add any comments or questions for the organizer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments (Optional)</Label>
                  <Textarea
                    id="comments"
                    placeholder="Any questions or comments about this opportunity..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => handleResponse('REJECTED')}
                    disabled={isPending}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </Button>
                  <Button 
                    onClick={() => handleResponse('ACCEPTED')}
                    disabled={isPending}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Accept Invitation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Display */}
          {invitation.status !== 'PENDING' && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Badge 
                    variant={invitation.status === 'ACCEPTED' ? 'default' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {invitation.status === 'ACCEPTED' ? 'Accepted' : 'Declined'}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    You have already responded to this invitation
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}