'use client';

import React from 'react';
import { useActionState, useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MessageSquare, Edit, History, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { editInvitation } from '@/app/actions/invitation-response';

type InvitationResponse = {
  id: number;
  artistName: string;
  artistEmail: string;
  proposedFee: number;
  message: string | null;
  status: string;
  artistComments: string | null;
  event: {
    title: string;
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

interface OrganizerResponseDialogProps {
  invitation: InvitationResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResponse: () => void;
}

export function OrganizerResponseDialog({ 
  invitation, 
  open, 
  onOpenChange, 
  onResponse 
}: OrganizerResponseDialogProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [newFee, setNewFee] = React.useState(invitation.proposedFee.toString());
  const [newMessage, setNewMessage] = React.useState(invitation.message || '');
  const [isPending, startTransition] = useTransition();
  
  const [state, formAction] = useActionState(editInvitation, {
    message: '',
    errors: {},
    success: false,
  });

  const handleEdit = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.set('invitationId', invitation.id.toString());
      formData.set('proposedFee', newFee);
      formData.set('message', newMessage);
      formAction(formData);
    });
  };

  React.useEffect(() => {
    if (state.success) {
      toast({
        title: 'Invitation Updated!',
        description: state.message,
      });
      setIsEditing(false);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Artist Response</DialogTitle>
          <DialogDescription>
            {invitation.artistName} has responded to your invitation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pb-4">
          {/* Response Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Response Status</span>
                <Badge 
                  variant={invitation.status === 'ACCEPTED' ? 'default' : 'destructive'}
                  className="text-lg px-4 py-2"
                >
                  {invitation.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Artist:</strong> {invitation.artistName}</p>
                <p><strong>Event:</strong> {invitation.event.title}</p>
                <p><strong>Original Fee:</strong> ${invitation.proposedFee.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Artist Comments */}
          {invitation.artistComments && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Artist Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {invitation.artistComments}
                </p>
              </CardContent>
            </Card>
          )}

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
                {invitation.history.map((entry) => (
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
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Edit Invitation */}
          {invitation.status === 'REJECTED' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Update Invitation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    Edit and Resend Invitation
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newFee">New Proposed Fee</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newFee"
                          type="number"
                          step="0.01"
                          value={newFee}
                          onChange={(e) => setNewFee(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newMessage">Updated Message</Label>
                      <Textarea
                        id="newMessage"
                        placeholder="Any additional information or updated terms..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-3 justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleEdit}
                        disabled={isPending}
                      >
                        Update & Resend
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}