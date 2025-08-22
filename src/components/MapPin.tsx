import React from "react";


interface MapPinProps {
  latitude: number; // -90 (bottom) to 90 (top)
  longitude: number; // -180 (left) to 180 (right)
  label?: string;
}

// Convert lat/lng to x/y percent for equirectangular map
function latLngToPercent(latitude: number, longitude: number) {
  // y: 0% (top) = 90N, 100% (bottom) = 90S
  // x: 0% (left) = -180, 100% (right) = 180
  const y = ((90 - latitude) / 180) * 100;
  const x = ((longitude + 180) / 360) * 100;
  return { x, y };
}

const MapPin: React.FC<MapPinProps> = ({ latitude, longitude, label }) => {
  const { x, y } = latLngToPercent(latitude, longitude);
  return (
    <div className="absolute z-10" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}>
      <span className="text-2xl">📍</span>
      {label && <div className="text-xs bg-white/80 rounded px-1 mt-1 shadow">{label}</div>}
    </div>
  );
};

export default MapPin;
