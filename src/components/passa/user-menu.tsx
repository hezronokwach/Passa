'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/app/actions/auth';
import { User } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import React from 'react';

interface UserMenuProps {
  user: {
    name?: string | null;
    email: string;
    role: string;
  };
}

function LogoutButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            variant="ghost"
            className="w-full justify-start"
            type="submit"
            disabled={pending}
        >
            {pending ? 'Logging out...' : 'Log out'}
        </Button>
    );
}

export function UserMenu({ user }: UserMenuProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(logout, { success: false, message: '' });

  React.useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user.name || user.email} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <form action={formAction} className="w-full">
                <LogoutButton />
            </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}