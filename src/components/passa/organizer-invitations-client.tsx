'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, MapPin, DollarSign, Eye, User } from 'lucide-react';
import { OrganizerResponseDialog } from './organizer-response-dialog';
import { useToast } from '@/components/ui/use-toast';

type Invitation = {
  id: number;
  artistName: string;
  artistEmail: string;
  proposedFee: number;
  message: string;
  status: string;
  artistComments: string;
  createdAt: string;
  event: {
    title: string;
    date: string;
    location: string;
    country: string;
  };
};

interface OrganizerInvitationsClientProps {
  invitations: Invitation[];
}

export function OrganizerInvitationsClient({ invitations }: OrganizerInvitationsClientProps) {
  const [selectedInvitation, setSelectedInvitation] = React.useState<any>(null);
  const { toast } = useToast();

  const handleViewDetails = async (invitationId: number) => {
    try {
      const response = await fetch(`/api/organizer-invitations/${invitationId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const invitation = await response.json();
        setSelectedInvitation(invitation);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load invitation details',
          variant: 'destructive'
        });
      }
    } catch (error) {
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
            <TableHead>Artist</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Proposed Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{invitation.artistName}</p>
                    <p className="text-sm text-muted-foreground">{invitation.artistEmail}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{invitation.event.title}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(invitation.event.date).toLocaleDateString()}
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
        <OrganizerResponseDialog
          invitation={selectedInvitation}
          open={!!selectedInvitation}
          onOpenChange={(open) => !open && setSelectedInvitation(null)}
          onResponse={() => {
            setSelectedInvitation(null);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}