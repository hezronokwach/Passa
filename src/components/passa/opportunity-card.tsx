"use client";

import Link from 'next/link';
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Define the shape of the data the card expects.
// This matches the mock data structure from the page.
interface Opportunity {
  id: number | string;
  title: string;
  organizer: string;
  budget: number;
  skills: string[];
  description: string;
}

export const OpportunityCard = ({ job }: { job: Opportunity }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>by {job.organizer}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {job.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {job.skills.map(skill => (
            <div key={skill} className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
              <Tag className="size-3"/>
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="border-t p-4 flex items-center justify-between">
        <p className="text-lg font-bold text-primary">${job.budget}</p>
        <Link href={`/dashboard/creator/opportunities/${job.id}`}>
          <Button>View & Apply</Button>
        </Link>
      </div>
    </Card>
  );
};