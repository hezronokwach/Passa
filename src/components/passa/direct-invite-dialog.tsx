'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Users, Search } from 'lucide-react';
import { createDirectInvite } from '@/app/actions/direct-invite';

// Simple debouncer to avoid excessive API calls
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function DirectInviteDialog({ eventId, children }: { eventId: number; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await createDirectInvite(formData);
    if (result?.success) {
      setTimeout(() => setOpen(false), 1500);
    }
    return result;
  }, null);

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ id: number; name: string; email: string; skills: string[] }>>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/artists/search?q=${encodeURIComponent(debouncedQuery)}`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore) setResults(data);
      } catch {
        // swallow
      }
    }
    run();
    return () => { ignore = true };
  }, [debouncedQuery]);

  // If a user is selected from search, prefill name/email
  useEffect(() => {
    if (selectedUser) {
      // no-op here; we will reflect this in defaultValue fields
    }
  }, [selectedUser]);

  const showManualEntry = !selectedUser;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setQuery(''); setResults([]); setSelectedUser(null); } }}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full">
            <Users className="size-4 mr-2" />
            Invite Artist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="eventId" value={eventId} />
          {selectedUser && <input type="hidden" name="userId" value={selectedUser.id} />}
          <DialogHeader>
            <DialogTitle>Invite Artist to Perform</DialogTitle>
            <DialogDescription>Search by name or email, or invite by email if they’re not on Passa yet.</DialogDescription>
          </DialogHeader>

          {state?.success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Invitation sent successfully!
              </AlertDescription>
            </Alert>
          )}

          {state?.success === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {state.message || 'Failed to send invitation. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 py-4">
            {/* Search */}
            <div>
              <Label>Search Artist (name or email)</Label>
              <div className="relative mt-1">
                <Input
                  placeholder="Search by name or email"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedUser(null); }}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
              {results.length > 0 && (
                <div className="mt-2 max-h-44 overflow-auto border rounded-md bg-background">
                  {results.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser({ id: u.id, name: u.name, email: u.email });
                        setQuery(`${u.name} • ${u.email}`);
                        setResults([]);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted"
                    >
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                      {u.skills?.length ? (
                        <div className="mt-1 text-xs text-muted-foreground">Skills: {u.skills.join(', ')}</div>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Manual entry fields (or prefilled when selected) */}
            <div>
              <Label htmlFor="artistName">Artist Name <span className="text-red-500">*</span></Label>
              <Input name="artistName" required className="mt-1" defaultValue={selectedUser?.name || ''} />
            </div>
            <div>
              <Label htmlFor="artistEmail">Artist Email <span className="text-red-500">*</span></Label>
              <Input name="artistEmail" type="email" required className="mt-1" defaultValue={selectedUser?.email || ''} />
            </div>
            <div>
              <Label htmlFor="proposedFee">Performance Fee ($) <span className="text-red-500">*</span></Label>
              <Input
                name="proposedFee"
                type="number"
                step="0.01"
                min="0"
                placeholder="1000"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                name="message"
                placeholder="We'd love to have you perform at our event..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending || state?.success}>
              {pending ? 'Sending...' : state?.success ? 'Sent!' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}