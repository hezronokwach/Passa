'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Key } from 'lucide-react';
import { AuthLayout } from '@/components/passa/auth-layout';
import { resetPassword } from '@/app/actions/auth';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full font-semibold" type="submit" disabled={pending}>
            <Key className="mr-2 size-4" />
            {pending ? 'Resetting...' : 'Reset Password'}
        </Button>
    )
}

export default function ResetPasswordPage() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [state, formAction] = useActionState(resetPassword, {
        success: false,
        message: '',
        errors: {},
    });

    useEffect(() => {
        if (state?.success) {
            toast({ title: 'Success!', description: state.message });
            router.push('/login');
        } else if (!state.success && state.message) {
            toast({
                title: "Reset Failed",
                description: state.message,
                variant: 'destructive'
            });
        }
    }, [state, toast, router]);

    if (!token) {
        return (
            <AuthLayout
                formPosition="center"
                title="Invalid Reset Link"
                description="This password reset link is invalid or has expired."
            >
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Please request a new password reset link.</p>
                    <Link href="/forgot-password">
                        <Button>Request New Link</Button>
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            formPosition="center"
            title="Reset Password"
            description="Enter your new password below."
        >
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="token" value={token} />
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" name="password" type="password" required minLength={6} />
                    {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
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