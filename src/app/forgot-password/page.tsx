'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { AuthLayout } from '@/components/passa/auth-layout';
import { forgotPassword } from '@/app/actions/auth';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full font-semibold" type="submit" disabled={pending}>
            <Mail className="mr-2 size-4" />
            {pending ? 'Sending...' : 'Send Reset Link'}
        </Button>
    )
}

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [state, formAction] = useActionState(forgotPassword, {
        success: false,
        message: '',
        errors: {},
    });

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? 'Success!' : 'Error',
                description: state.message,
                variant: state.success ? 'default' : 'destructive'
            });
        }
    }, [state, toast]);

    return (
        <AuthLayout
            formPosition="center"
            title="Forgot Password"
            description="Enter your email address and we'll send you a link to reset your password."
        >
            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
                </div>
                <SubmitButton />
            </form>
            <p className="mt-8 text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}