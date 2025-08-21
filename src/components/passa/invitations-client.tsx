'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, MapPin, DollarSign, Eye } from 'lucide-react';
import { InvitationResponseDialog } from './invitation-response-dialog';
import { useToast } from '@/components/ui/use-toast';

type InvitationListItem = {
  id: number;
  artistName: string;
  proposedFee: number;
  message: string | null;
  status: string;
  createdAt: Date;
  sourceBriefId: number | null;
  event: {
    title: string;
    date: Date;
    location: string;
    country: string;
  };
};

type InvitationDetail = {
  id: number;
  artistName: string;
  proposedFee: number;
  message: string | null;
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

interface InvitationsClientProps {
  invitations: InvitationListItem[];
}

export function InvitationsClient({ invitations }: InvitationsClientProps) {
  const [selectedInvitation, setSelectedInvitation] = React.useState<InvitationDetail | null>(null);
  const { toast } = useToast();

  const handleViewDetails = async (invitationId: number) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const invitation: InvitationDetail = await response.json();
        setSelectedInvitation(invitation);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load invitation details',
          variant: 'destructive'
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load invitation details',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date & Location</TableHead>
            <TableHead>Proposed Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{invitation.event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.sourceBriefId ? 'From application' : 'Direct invitation'} • {new Date(invitation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(invitation.event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {invitation.event.location}, {invitation.event.country}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">${invitation.proposedFee.toFixed(2)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    invitation.status === 'ACCEPTED' ? 'default' :
                    invitation.status === 'REJECTED' ? 'destructive' :
                    'secondary'
                  }
                >
                  {invitation.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewDetails(invitation.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedInvitation && (
        <InvitationResponseDialog
          invitation={selectedInvitation}
          open={!!selectedInvitation}
          onOpenChange={(open) => !open && setSelectedInvitation(null)}
          onResponse={() => {
            setSelectedInvitation(null);
            window.location.reload(); // Refresh the page to show updated data
          }}
        />
      )}
    </>
  );
}