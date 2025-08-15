'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AuthLayout } from '@/components/passa/auth-layout';
import { Mail, Wallet } from 'lucide-react';
import { signup } from '@/app/actions/auth';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full font-semibold" type="submit" disabled={pending}>
            <Mail />
            {pending ? 'Creating Account...' : 'Create Account'}
        </Button>
    )
}

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [state, formAction] = useActionState(signup, {
      success: false,
      message: '',
  });

  useEffect(() => {
    if (state?.success) {
      toast({ title: 'Success!', description: state.message });
      // Server-side redirect will handle navigation based on role
    } else if (state && !state.success && state.message) {
      toast({
        title: "Registration Failed",
        description: state.message,
        variant: "destructive"
      });
    }
  }, [state, toast, router]);

  return (
    <AuthLayout
        formPosition="left"
        title="Create an Account"
        description="Join Passa to start buying tickets, creating events, or finding your next gig."
    >
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required/>
            {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label>I am a...</Label>
            <RadioGroup defaultValue="FAN" name="role" className="grid grid-cols-3 gap-4 pt-2">
              <Label htmlFor="fan" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                <RadioGroupItem value="FAN" id="fan" className="sr-only" />
                Fan
              </Label>
              <Label htmlFor="creator" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                <RadioGroupItem value="CREATOR" id="creator" className="sr-only" />
                Creator
              </Label>
               <Label htmlFor="organizer" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                <RadioGroupItem value="ORGANIZER" id="organizer" className="sr-only" />
                Organizer
              </Label>
            </RadioGroup>
            {state?.errors?.role && <p className="text-sm text-destructive">{state.errors.role[0]}</p>}
          </div>
          <SubmitButton/>
           <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or sign up with
                </span>
            </div>
            </div>
           <Button variant="secondary" className="w-full font-semibold" disabled>
            <Wallet />
            Sign Up with Wallet
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Sign In
            </Link>
          </p>
    </AuthLayout>
  );
}
