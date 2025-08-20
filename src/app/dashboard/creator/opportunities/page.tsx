
import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Briefcase, DollarSign } from 'lucide-react';
import { OpportunityCard } from '@/components/passa/opportunity-card';
import { opportunities } from '@/lib/mock-data';

export default function OpportunitiesPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/30">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                         <h1 className="font-headline text-4xl font-bold md:text-5xl">
                           Find Your Next Creative Gig
                         </h1>
                         <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            Browse creative briefs from top event organizers and apply your skills to the most exciting events in Africa.
                         </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <Card className="p-4 mb-8">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search by title or keyword..." className="pl-10" />
                            </div>
                            <Select>
                                <SelectTrigger>
                                    <Briefcase className="mr-2 text-muted-foreground"/>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video">Video & Animation</SelectItem>
                                    <SelectItem value="design">Graphic Design</SelectItem>
                                    <SelectItem value="writing">Writing & Translation</SelectItem>
                                    <SelectItem value="photo">Photography</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <DollarSign className="mr-2 text-muted-foreground"/>
                                    <SelectValue placeholder="Any Budget" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<1000">Under $1,000</SelectItem>
                                    <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                                    <SelectItem value=">5000">Over $5,000</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="font-bold w-full">Search</Button>
                        </div>
                    </Card>

                    {/* Opportunities Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {opportunities.map(job => (
                            <OpportunityCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
