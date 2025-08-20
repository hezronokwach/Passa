import { Header } from '@/components/passa/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { applications } from '@/lib/mock-data';
import { Eye } from 'lucide-react';
import Link from 'next/link';

// A helper to determine badge color based on status
const getStatusVariant = (status: 'Pending' | 'Approved' | 'Rejected') => {
  switch (status) {
    case 'Approved':
      return 'default'; // Green
    case 'Pending':
      return 'secondary'; // Gray
    case 'Rejected':
      return 'destructive'; // Red
    default:
      return 'outline';
  }
};

export default function ApplicationsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">
              My Applications
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Track the status of all your submitted applications for creative opportunities.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Submission History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opportunity Title</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Date Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.opportunityTitle}</TableCell>
                      <TableCell>{app.organizer}</TableCell>
                      <TableCell>{new Date(app.dateApplied).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(app.status)}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {app.status === 'Approved' && (
                          <Link href={`/dashboard/creator/tickets/${app.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 size-4" />
                              View Ticket
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}