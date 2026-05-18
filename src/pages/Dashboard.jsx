import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Phone, Mail, Calendar, LogOut, Edit } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
    navigate('/auth/login');
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-28 md:pt-36 bg-[#EFF7F2]" id="dashboard-page">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">
        
        {/* Profile Card */}
        <div className="bg-[#FFFBF4] rounded-2xl border border-[#F4E9D8] shadow-sm p-8 mb-8" id="profile-card">
          <h1 className="font-playfair font-bold text-[#1C1C1E] text-3xl mb-6">My Account</h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center text-3xl font-bold font-playfair shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1">
              <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-1">
                {user?.name || 'Traveller'}
              </h2>
              
              <div className="flex flex-col gap-2 mt-4 text-[#6B7280]">
                {user?.email && (
                  <span className="flex items-center gap-2">
                    <Mail size={16} className="text-[#2D6A4F]" /> {user.email}
                  </span>
                )}
                {user?.phone && (
                  <span className="flex items-center gap-2">
                    <Phone size={16} className="text-[#2D6A4F]" /> {user.phone}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#2D6A4F]" /> Member since {joinDate}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full sm:w-auto mt-6 sm:mt-0">
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2D6A4F] text-white text-sm font-medium hover:bg-[#245a41] transition-colors"
                onClick={() => toast('Edit Profile feature coming soon!', { icon: 'ℹ️' })}
              >
                <Edit size={16} /> Edit Profile
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
