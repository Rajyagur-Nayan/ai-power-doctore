"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface Hospital {
  name: string;
  type: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  rating?: number;
}

interface HospitalMapProps {
  userLocation: { lat: number; lng: number } | null;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  routePoints: [number, number][];
  onHospitalClick: (hospital: Hospital) => void;
}

// Internal component to handle center updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

const HospitalMap: React.FC<HospitalMapProps> = ({
  userLocation,
  hospitals,
  selectedHospital,
  routePoints,
  onHospitalClick,
}) => {
  const hospitalIcon = typeof window !== 'undefined' ? L.divIcon({
    html: `<div class="w-8 h-8 bg-indigo-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
             <div class="w-2 h-2 bg-white rounded-full"></div>
           </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }) : null;

  const userIcon = typeof window !== 'undefined' ? L.divIcon({
    html: `<div class="relative">
             <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
             <div class="absolute -inset-2 bg-blue-500/20 rounded-full animate-ping"></div>
           </div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }) : null;

  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [20.5937, 78.9629]; // Default to center of India if no location

  return (
    <div className="w-full h-full relative z-10">
      <MapContainer
        center={center}
        zoom={userLocation ? 14 : 5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && userIcon && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="font-bold">Your Bio-Location</div>
              <div className="text-xs opacity-70">Sensor Grid Active</div>
            </Popup>
          </Marker>
        )}

        {hospitals.map((h, i) => (
          hospitalIcon && (
            <Marker
              key={`${h.name}-${i}`}
              position={[h.lat, h.lng]}
              icon={hospitalIcon}
              eventHandlers={{
                click: () => onHospitalClick(h),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <div className="font-bold text-indigo-900">{h.name}</div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-indigo-400 mt-1">
                    {h.type}
                  </div>
                  <div className="text-xs mt-2 font-bold text-indigo-600">
                    {h.distance} KM AWAY
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            pathOptions={{ color: "#312e81", weight: 4, opacity: 0.6, dashArray: "10, 10" }}
          />
        )}

        {selectedHospital && (
          <MapUpdater center={[selectedHospital.lat, selectedHospital.lng]} />
        )}
      </MapContainer>
    </div>
  );
};

export default HospitalMap;
