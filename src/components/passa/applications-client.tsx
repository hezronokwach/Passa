'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { InvitationResponseDialog } from './invitation-response-dialog';
import { useToast } from '@/components/ui/use-toast';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'ACCEPTED':
      return 'default';
    case 'PENDING':
      return 'secondary';
    case 'REJECTED':
      return 'destructive';
    default:
      return 'outline';
  }
};

type InvitationListItem = {
  id: number;
  proposedFee: number;
  status: string;
  createdAt: Date;
  event: {
    title: string;
    date: Date;
    location: string;
    organizer: {
      name: string | null;
    };
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

interface ApplicationsClientProps {
  invitations: InvitationListItem[];
  type: 'invitations' | 'applications';
}

export function ApplicationsClient({ invitations, type }: ApplicationsClientProps) {
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
            <TableHead>Organizer</TableHead>
            <TableHead>{type === 'invitations' ? 'Date & Location' : 'Date Applied'}</TableHead>
            {type === 'invitations' && <TableHead>Proposed Fee</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell className="font-medium">{invitation.event.title}</TableCell>
              <TableCell>{invitation.event.organizer.name || 'Unknown Organizer'}</TableCell>
              <TableCell>
                {type === 'invitations' ? (
                  <div className="text-sm">
                    <div>{new Date(invitation.event.date).toLocaleDateString()}</div>
                    <div className="text-muted-foreground">{invitation.event.location}</div>
                  </div>
                ) : (
                  new Date(invitation.createdAt).toLocaleDateString()
                )}
              </TableCell>
              {type === 'invitations' && (
                <TableCell>${invitation.proposedFee.toFixed(2)}</TableCell>
              )}
              <TableCell>
                <Badge variant={getStatusVariant(invitation.status)}>
                  {invitation.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(invitation.id)}
                >
                  <Eye className="mr-2 size-4" />
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
            window.location.reload();
          }}
        />
      )}
    </>
  );
}