const AlertCard = ({ incident, onAcknowledge }) => {
    // Styling based on status
    const isPending = incident.status === 'pending';

    return (
        <div className={`flex items-center justify-between p-5 bg-white border-l-8 rounded-lg shadow-md transition-all ${isPending ? 'border-red-500 animate-pulse' : 'border-green-500 opacity-80'}`}>
            <div>
                <h3 className="text-xl font-extrabold text-gray-800">{incident.incident_type}</h3>
                <p className="text-lg text-gray-600">Location: <span className="font-bold text-black">{incident.location}</span></p>
                <p className={`mt-2 text-sm font-semibold tracking-wider uppercase ${isPending ? 'text-red-500' : 'text-green-600'}`}>
                    Status: {incident.status}
                </p>
                <p className="text-xs text-gray-400 mt-1">ID: {incident.id}</p>
            </div>
            
            {isPending && (
                <button 
                    onClick={() => onAcknowledge(incident.id)}
                    className="px-6 py-3 font-bold text-white transition-colors bg-yellow-500 rounded shadow hover:bg-yellow-600"
                >
                    Acknowledge
                </button>
            )}
            {!isPending && (
                <span className="px-6 py-3 font-bold text-green-700 bg-green-100 rounded">
                    Acknowledged
                </span>
            )}
        </div>
    );
};

export default AlertCard;