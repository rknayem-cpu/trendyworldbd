'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-3 w-full h-screen justify-center">
        <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border border-white/20" />
        <span className="text-xs text-white font-bold">{session.user.name}</span>
        <button 
          onClick={() => signOut()} 
          className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full h-screen justify-center">
    <button 
      onClick={() => signIn('google')} 
      className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold shadow-lg hover:bg-gray-200 transition-all flex items-center gap-2"
    >
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" />
      Login with Google
    </button>
    </div>
  );
}