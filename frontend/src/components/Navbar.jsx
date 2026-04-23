import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="bg-white border-b border-slate-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black text-red-600 tracking-tighter">RespondR</span>
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase">MVP</span>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Role</p>
                        <p className="text-sm font-black text-slate-700 capitalize">{user.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
