import { useAuth } from "../context/AuthContext";
import { LogOut, Radio, Shield } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();

    // Do not show navbar if user is not authenticated
    if (!user) return null;

    const roleConfig = {
        user:  { label: "Guest",     icon: Radio,  color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100" },
        staff: { label: "Responder", icon: Shield,  color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        admin: { label: "Admin",     icon: Shield,  color: "text-purple-600",  bg: "bg-purple-50",  border: "border-purple-100" },
    };

    const role = roleConfig[user.role] || roleConfig.user;
    const RoleIcon = role.icon;

    return (
        <nav className="glass sticky top-0 z-50 border-b border-slate-200/50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* BRAND */}
                <div className="flex items-center gap-3">
                    {/* Logo mark */}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-glow-red">
                        <span className="text-white font-black text-sm tracking-tighter">R</span>
                    </div>

                    <span className="text-xl font-black text-slate-900 tracking-tight">
                        Respond<span className="gradient-text">R</span>
                    </span>

                    <span className="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-red-100">
                        Live
                    </span>
                </div>

                {/* USER INFO + ACTIONS */}
                <div className="flex items-center gap-4">
                    {/* Role badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${role.bg} border ${role.border} shadow-sm`}>
                        <RoleIcon className={`w-3.5 h-3.5 ${role.color}`} />
                        <span className={`text-xs font-bold ${role.color}`}>
                            {role.label}
                        </span>
                    </div>

                    {/* User name */}
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-slate-700">
                            {user.name || user.email?.split("@")[0]}
                        </p>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/50 hover:bg-red-50 border border-slate-200/50 hover:border-red-100 text-slate-600 hover:text-red-600 font-bold text-sm transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;