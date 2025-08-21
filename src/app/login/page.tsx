
'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Mail, Wallet } from 'lucide-react';
import { AuthLayout } from '@/components/passa/auth-layout';
import { login } from '@/app/actions/auth';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full font-semibold" type="submit" disabled={pending}>
            <Mail />
            {pending ? 'Signing In...' : 'Sign In with Email'}
        </Button>
    )
}

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [state, formAction] = useActionState(login, {
        success: false,
        message: '',
        role: undefined,
        errors: {},
    });

    useEffect(() => {
        if (state?.success) {
            toast({ title: 'Success!', description: state.message });
            
            // Redirect based on role
            switch (state?.role) {
                case 'ADMIN':
                    router.push('/dashboard/admin');
                    break;
                case 'CREATOR':
                    router.push('/dashboard/creator');
                    break;
                case 'ORGANIZER':
                    router.push('/dashboard/organizer');
                    break;
                case 'FAN':
                    router.push('/dashboard/fan');
                    break;
                default:
                    router.push('/dashboard');
            }
        } else if (!state.success && state.message) {
            toast({
                title: "Login Failed",
                description: state.message,
                variant: 'destructive'
            })
        }
    }, [state, toast, router]);

  return (
    <AuthLayout
      formPosition="right"
      title="Welcome Back"
      description="Sign in to access your tickets, events, and creative opportunities."
    >
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required/>
          {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
        </div>
        <SubmitButton />
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="secondary" className="w-full font-semibold" disabled>
          <Wallet />
          Connect Wallet
        </Button>
      </form>
       <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
