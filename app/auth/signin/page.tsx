'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FloatingInput } from '@/components/auth/floating-input';
import { SocialButton } from '@/components/auth/social-button';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function SignInPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate inputs
    let hasErrors = false;
    const newErrors: { email?: string; password?: string; general?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Sign in
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toast({
          title: 'Sign in successful',
          description: 'Welcome back!',
        });
        router.push('/dashboard');
      } else {
        const errorMessage = result.error || 'Sign in failed';
        
        // Handle specific error types
        if (errorMessage.toLowerCase().includes('email') && 
            (errorMessage.toLowerCase().includes('not registered') || 
             errorMessage.toLowerCase().includes('not found'))) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.toLowerCase().includes('verification') || 
                   errorMessage.toLowerCase().includes('verified')) {
          setErrors({ email: errorMessage });
        } else {
          setErrors({ password: errorMessage });
        }

        toast({
          title: 'Sign in failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setErrors({
        general: 'An unexpected error occurred. Please try again later.',
      });

      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    if (provider === 'Google') {
      try {
        window.location.href =
          process.env.NEXT_PUBLIC_API_URL + '/api/auth/google';
      } catch (error) {
        toast({
          title: 'Connection Error',
          description:
            'Unable to connect to the authentication server. Please try again later.',
          variant: 'destructive',
        });
      }
    } else if (provider === 'Meta') {
      // Will be implemented when backend is ready
      toast({
        title: 'Meta login',
        description: 'Meta login will be available soon.',
      });
    }
  };

  return (
    <AuthLayout
      title='Sign In to TestGenius AI'
      subtitle='Welcome back! Please enter your details.'
    >
      <div className='space-y-6'>
        {errors.general && (
          <div className='rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
            {errors.general}
          </div>
        )}

        <div className='space-y-4'>
          <form onSubmit={handleSubmit}>
            <FloatingInput
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className='h-5 w-5' />}
              autoComplete='email'
              disabled={isSubmitting}
            />

            <FloatingInput
              label='Password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='focus:outline-none'
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              }
              autoComplete='current-password'
              disabled={isSubmitting}
            />

            <div className='mb-6 flex items-center justify-end'>
              <Link
                href='/auth/forgot-password'
                className='text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20'
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type='submit'
              size='lg'
              className='w-full text-base'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <div className='relative flex items-center justify-center'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t' />
          </div>
          <div className='relative bg-background px-4 text-sm text-muted-foreground'>
            or continue with
          </div>
        </div>

        <div className='grid gap-3'>
          <SocialButton
            provider='google'
            icon={
              <svg viewBox='0 0 24 24' className='h-5 w-5'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
            }
            onClick={() => handleSocialSignIn('Google')}
            disabled={isSubmitting}
          >
            Continue with Google
          </SocialButton>

          {/*
            <SocialButton
            provider="meta"
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
            d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"
            fill="#1877F2"
            />
              </svg>
            }
            onClick={() => handleSocialSignIn("Meta")}
            disabled={isSubmitting}
            >
            Continue with Meta
            </SocialButton>
            */}
        </div>

        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>Don't have an account?</span>{' '}
          <Link
            href='/auth/signup'
            className='font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20'
          >
            Sign up
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className='mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground'>
            <p className='font-medium'>Development Mode</p>
            <p className='mt-1'>
              Backend API endpoint: {process.env.NEXT_PUBLIC_API_URL + '/api/auth/login'}
            </p>
            <p>Make sure your backend server is running.</p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
