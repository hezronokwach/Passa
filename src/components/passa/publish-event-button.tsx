'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PublishEventModal } from './publish-event-modal';

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  country: string;
};

interface PublishEventButtonProps {
  event: Event;
}

export function PublishEventButton({ event }: PublishEventButtonProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <Button size="sm" variant="default" onClick={() => setModalOpen(true)}>
        Publish
      </Button>
      <PublishEventModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        event={event}
      />
    </>
  );
}