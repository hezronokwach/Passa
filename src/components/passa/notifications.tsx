'use client';

import React from 'react';
import { Bell, DollarSign, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { InvitationResponseDialog } from './invitation-response-dialog';
import { OrganizerResponseDialog } from './organizer-response-dialog';

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data: { invitationId?: number; eventId?: number; organizerId?: number };
  createdAt: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [selectedInvitation, setSelectedInvitation] = React.useState<Record<string, unknown> | null>(null);
  const [selectedOrganizerInvitation, setSelectedOrganizerInvitation] = React.useState<Record<string, unknown> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const { toast } = useToast();

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        return data.authenticated;
      }
    } catch {
      setIsAuthenticated(false);
    }
    return false;
  };

  const fetchNotifications = React.useCallback(async () => {
    const authenticated = await checkAuth();
    if (!authenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const response = await fetch('/api/notifications', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch {
      // Silently fail
    }
  }, []);

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
        credentials: 'include'
      });
      fetchNotifications();
    } catch {
      console.error('Failed to mark as read');
    }
  };

  const handleInvitationClick = async (notification: Notification) => {
    if (notification.type === 'ARTIST_INVITATION') {
      // Only show dialog for artists receiving invitations
      try {
        const response = await fetch(`/api/invitations/${notification.data.invitationId}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const invitation = await response.json();
          setSelectedInvitation(invitation);
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load invitation details',
          variant: 'destructive'
        });
      }
    } else if (notification.type === 'INVITATION_RESPONSE') {
      // For organizers receiving responses, fetch invitation details
      try {
        const response = await fetch(`/api/organizer-invitations/${notification.data.invitationId}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const invitation = await response.json();
          setSelectedOrganizerInvitation(invitation);
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load invitation details',
          variant: 'destructive'
        });
      }
    } else if (notification.type === 'ARTIST_APPLICATION') {
      // Redirect organizer to event management page
      markAsRead(notification.id);
      window.location.href = `/dashboard/organizer/events/${notification.data.eventId}`;
      return;
    }
    markAsRead(notification.id);
  };

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  if (isAuthenticated === null) {
    // Still checking authentication, render placeholder
    return (
      <Button variant="ghost" size="sm" className="relative opacity-50">
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b">
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <ScrollArea className="h-96">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                      !notification.read ? 'bg-muted/30' : ''
                    }`}
                    onClick={() => handleInvitationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {notification.type === 'ARTIST_INVITATION' && (
                          <DollarSign className="h-4 w-4 text-primary" />
                        )}
                        {notification.type === 'INVITATION_RESPONSE' && (
                          <User className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selectedInvitation && (
        <InvitationResponseDialog
          invitation={selectedInvitation as never}
          open={!!selectedInvitation}
          onOpenChange={(open) => !open && setSelectedInvitation(null)}
          onResponse={() => {
            setSelectedInvitation(null);
            fetchNotifications();
          }}
        />
      )}

      {selectedOrganizerInvitation && (
        <OrganizerResponseDialog
          invitation={selectedOrganizerInvitation as never}
          open={!!selectedOrganizerInvitation}
          onOpenChange={(open) => !open && setSelectedOrganizerInvitation(null)}
          onResponse={() => {
            setSelectedOrganizerInvitation(null);
            fetchNotifications();
          }}
        />
      )}
    </>
  );
}