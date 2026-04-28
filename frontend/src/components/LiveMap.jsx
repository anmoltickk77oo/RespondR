import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Siren, User, Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Icons
const incidentIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const responderIcon = (team) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 ${team === 'medical' ? 'bg-emerald-500' : 'bg-blue-500'} rounded-xl flex items-center justify-center border-2 border-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center]);
  return null;
};

const LiveMap = ({ incidents = [], responders = [], userLocation = null }) => {
  const defaultCenter = [19.0760, 72.8777]; // Default to Mumbai or user current position

  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner relative group">
      <MapContainer 
        center={userLocation || defaultCenter} 
        zoom={13} 
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <ChangeView center={userLocation} />

        {/* User Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
            <Circle center={userLocation} radius={200} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }} />
          </Marker>
        )}

        {/* Incident Markers */}
        {incidents.map(inc => (
          <React.Fragment key={inc.id}>
            <Marker 
              position={[inc.lat || 19.08, inc.lng || 72.88]} 
              icon={incidentIcon}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-black text-rose-600 uppercase text-[10px] tracking-widest mb-1">{inc.incident_type}</h4>
                  <p className="text-xs font-bold text-slate-800">{inc.location}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Status: {inc.status}</p>
                </div>
              </Popup>
            </Marker>
            <Circle 
                center={[inc.lat || 19.08, inc.lng || 72.88]} 
                radius={500} 
                pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.05, weight: 1 }} 
            />
          </React.Fragment>
        ))}

        {/* Active Responders */}
        {responders.map(resp => (
          resp.location && (
            <Marker 
              key={resp.socketId} 
              position={[resp.location.lat, resp.location.lng]} 
              icon={responderIcon(resp.team?.toLowerCase())}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-1">{resp.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Team: {resp.team || 'General'}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* Decorative Overlay */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
          <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Geo-Sync Active</span>
          </div>
          <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg flex items-center gap-3">
              <Navigation className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Telemetry</span>
          </div>
      </div>
    </div>
  );
};

export default LiveMap;
