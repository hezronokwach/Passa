
import { Header } from '@/components/passa/header';
import { Footer } from '@/components/passa/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full bg-secondary/30 py-20 md:py-32">
                     <div className="absolute inset-0 z-0 opacity-10 dark:[opacity-20] bg-grid-glow"></div>
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            Get in Touch
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                            Have a question, a partnership idea, or just want to say hello? We&apos;d love to hear from you.
                        </p>
                    </div>
                </section>

                <section className="w-full bg-background py-16 md:py-24">
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="order-2 md:order-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send us a Message</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input id="name" placeholder="Your Name" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" placeholder="you@example.com" />
                                            </div>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" placeholder="What's this about?" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea id="message" placeholder="Your message here..." rows={6} />
                                        </div>
                                        <Button type="submit" className="w-full font-bold">
                                            <Send className="mr-2" />
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Info */}
                        <div className="order-1 md:order-2">
                            <h2 className="font-headline text-3xl font-bold">Contact Information</h2>
                            <p className="mt-4 text-muted-foreground">
                                For direct inquiries, you can reach us through the following channels. We aim to respond within 24 hours.
                            </p>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <Mail className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">General Inquiries</h3>
                                        <p className="text-muted-foreground">
                                            <Link href="mailto:hello@passa.one" className="hover:text-primary">hello@passa.one</Link>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <MessageSquare className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Press & Media</h3>
                                         <p className="text-muted-foreground">
                                            <Link href="mailto:press@passa.one" className="hover:text-primary">press@passa.one</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-primary py-16 text-primary-foreground md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">
                            Ready to Start Your Journey?
                        </h2>
                        <Button size="lg" variant="secondary" className="mt-8 font-bold text-primary hover:bg-white/90" asChild>
                             <Link href="/register">Create an Account</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
