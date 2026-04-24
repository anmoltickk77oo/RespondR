import { MapPin, Clock, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

const AlertCard = ({ incident, onAcknowledge }) => {
    const isPending = incident.status === 'pending';
    const time = new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`group flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border transition-all duration-300 hover:shadow-md
            ${isPending ? 'border-red-100 ring-2 ring-red-50 ring-offset-0 animate-in fade-in slide-in-from-top-4' : 'border-gray-100 opacity-90'}`}>
            
            <div className="flex gap-5 items-start">
                <div className={`p-4 rounded-2xl ${isPending ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {isPending ? <AlertCircle size={28} className="animate-pulse" /> : <ShieldCheck size={28} />}
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">{incident.incident_type}</h3>
                        {isPending && (
                            <span className="px-2 py-0.5 bg-red-600 text-[10px] font-black text-white rounded-full uppercase tracking-tighter">Live</span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{incident.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={16} className="text-gray-400" />
                            <span>{time}</span>
                        </div>
                    </div>
                    
                    <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${isPending ? 'text-red-500' : 'text-green-600'}`}>
                        {incident.status}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center">
                {isPending ? (
                    <button 
                        onClick={() => onAcknowledge(incident.id)}
                        className="px-6 py-3 font-bold text-white bg-gray-900 rounded-2xl shadow-lg hover:bg-black transition-all active:scale-95 flex items-center gap-2"
                    >
                        <CheckCircle size={18} />
                        Acknowledge
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl">
                        <CheckCircle size={20} />
                        <span>Resolved</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertCard;