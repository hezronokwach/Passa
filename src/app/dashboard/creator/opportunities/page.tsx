
'use client';

import { Header } from '@/components/passa/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag, Search, Briefcase, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function OpportunitiesPage() {
    // Mock data - replace with actual data fetching from Prisma
    const opportunities = [
        {
            id: 1,
            title: 'Promotional Video for Afrochella',
            organizer: 'Afrochella Events',
            budget: 5000,
            skills: ['Videography', 'Video Editing', 'Storytelling'],
            description: 'We need a stunning 2-minute promotional video to capture the vibrant energy of the Afrochella festival. The video should highlight key performances, audience reactions, and the overall cultural experience.'
        },
        {
            id: 2,
            title: 'Social Media Graphics Pack',
            organizer: 'Sauti Sol Management',
            budget: 1500,
            skills: ['Graphic Design', 'Branding', 'Social Media'],
            description: 'Create a pack of 10 high-quality social media graphics (Instagram posts, stories, Twitter banners) for Sauti Sol\'s upcoming concert. Must adhere to their brand guidelines.'
        },
        {
            id: 3,
            title: 'Blog Post: "The Rise of Amapiano"',
            organizer: 'Amapiano Night Fest',
            budget: 500,
            skills: ['Writing', 'Music Journalism', 'SEO'],
            description: 'Write an engaging and informative 1500-word blog post about the cultural impact and global rise of the Amapiano music genre. The article will be featured on our event website.'
        },
        {
            id: 4,
            title: 'Live Event Photographer',
            organizer: 'Lagos Music Week',
            budget: 2500,
            skills: ['Photography', 'Event Photography', 'Photo Editing'],
            description: 'Capture high-resolution photos of performances, crowd, and behind-the-scenes moments during the 3-day Lagos Music Week. A portfolio of live event work is required.'
        }
    ];

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
                            <Card key={job.id} className="flex flex-col">
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
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
