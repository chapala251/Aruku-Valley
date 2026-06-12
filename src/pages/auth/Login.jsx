import { useState } from 'react';
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
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Attempting Supabase Auth login for:", data.email);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        console.error("Auth error:", authError);
        if (authError.message.includes('Email not confirmed')) {
          toast.error('Please confirm your email first. Check your inbox for the confirmation link.');
        } else {
          toast.error(authError.message || "Incorrect email or password");
        }
        setIsLoading(false);
        return;
      }

      console.log("Login successful for:", authData.user.email);
      
      // Store in localStorage for backward compatibility with other parts of the app
      localStorage.setItem('user', JSON.stringify({
        isLoggedIn: true,
        id: authData.user.id,
        email: authData.user.email,
      }));

      toast.success('Welcome back! 🌿');
      if (authData.user.email === 'arakuecostays@gmail.com') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('An error occurred during sign in.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast('Google login available after backend setup.', { icon: 'ℹ️' });
  };

  return (
    <div className="min-h-screen bg-[#EFF7F2] pt-28 pb-36 px-5 md:px-8 flex flex-col" id="login-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md my-auto mx-auto bg-[#FFFBF4] rounded-3xl shadow-2xl border border-[#F4E9D8] overflow-hidden"
      >
        <div className="bg-[#2D6A4F] p-8 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf size={28} color="white" />
          </div>
          <h1 className="font-playfair font-bold text-white text-2xl">Welcome Back</h1>
          <p className="text-white/70 text-sm mt-1">Sign in to your Araku Valley account</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="login-form">
            <div>
              <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Email Address</label>
              <input
                {...register('email')}
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-[#1C1C1E]">Password</label>
                <a href="#" className="text-xs text-[#2D6A4F] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-5 md:px-8 py-3 pr-11 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1C1C1E] transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('remember')} id="login-remember" type="checkbox" className="rounded border-[#F4E9D8] text-[#2D6A4F]" />
              <span className="text-sm text-[#6B7280]">Remember me</span>
            </label>

            <button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#245a41] disabled:opacity-60 transition-all hover:shadow-lg"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#F4E9D8]" />
            <span className="text-xs text-[#6B7280]">or</span>
            <div className="flex-1 h-px bg-[#F4E9D8]" />
          </div>

          <button
            onClick={handleGoogleLogin}
            id="login-google"
            className="w-full py-3 rounded-xl border border-[#F4E9D8] bg-white text-[#1C1C1E] font-medium text-sm hover:bg-[#EFF7F2] transition-colors flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '13px',
            color: '#6B5744',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Not registered?{' '}
            <Link
              to="/auth/signup"
              style={{
                color: '#C4622D',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
