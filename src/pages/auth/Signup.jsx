import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import bcrypt from 'bcryptjs';
import { Eye, EyeOff, Leaf } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Signup() {
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // 1. Check if email is already taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();

      if (existingUser) {
        toast.error('This email is already registered. Please sign in.');
        setIsLoading(false);
        return;
      }

      // 2. Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // 3. Insert into Supabase
      const { error } = await supabase
        .from('users')
        .insert([{
          full_name: data.name,
          email: data.email,
          mobile_number: data.phone || null,
          password_hash: passwordHash
        }])
        .select();

      if (error) {
        console.error("Sign-up error:", error);
        toast.error(error.message);
      } else {
        toast.success("Account created successfully!");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      toast.error('Something went wrong during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast('Google sign-up available after backend setup.', { icon: 'ℹ️' });
  };

  const inputClass = "w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition";

  return (
    <div className="min-h-screen bg-[#EFF7F2] pt-20 pb-20 px-5 md:px-8 flex flex-col" id="signup-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md my-auto mx-auto bg-[#FFFBF4] rounded-3xl shadow-2xl border border-[#F4E9D8] overflow-hidden"
      >
        <div className="bg-[#2D6A4F] p-6 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf size={20} color="white" />
          </div>
          <h1 className="font-playfair font-bold text-white text-2xl">Create Account</h1>
          <p className="text-white/70 text-sm mt-1">Join and start planning your Araku adventure</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="signup-form">
            <div>
              <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Full Name *</label>
              <input {...register('name')} id="signup-name" placeholder="Your full name" className={inputClass} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Email Address *</label>
              <input {...register('email')} id="signup-email" type="email" placeholder="you@example.com" className={inputClass} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Phone Number (optional)</label>
              <input {...register('phone')} id="signup-phone" placeholder="+91 98765 43210" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Password *</label>
              <div className="relative">
                <input
                  {...register('password')}
                  id="signup-password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className={`${inputClass} pr-11`}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Confirm Password *</label>
              <input {...register('confirmPassword')} id="signup-confirm-password" type="password" placeholder="Re-enter password" className={inputClass} />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input {...register('terms')} id="signup-terms" type="checkbox" className="mt-0.5 rounded border-[#F4E9D8] text-[#2D6A4F]" />
              <span className="text-sm text-[#6B7280]">
                I agree to the{' '}
                <a href="#" className="text-[#2D6A4F] hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-[#2D6A4F] hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="text-red-500 text-xs -mt-2">{errors.terms.message}</p>}

            <button
              type="submit"
              id="signup-submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#245a41] disabled:opacity-60 transition-all hover:shadow-lg"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#F4E9D8]" />
            <span className="text-xs text-[#6B7280]">or</span>
            <div className="flex-1 h-px bg-[#F4E9D8]" />
          </div>

          <button
            onClick={handleGoogleSignup}
            id="signup-google"
            className="w-full py-3 rounded-xl border border-[#F4E9D8] bg-white text-[#1C1C1E] font-medium text-sm hover:bg-[#EFF7F2] transition-colors flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Already have an account?{' '}
            <Link to="/auth/login" id="signup-login-link" className="text-[#2D6A4F] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
