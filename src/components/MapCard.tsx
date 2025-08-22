import ChatGptAsk from "./ChatGptAsk";
// ...existing code...
import React from "react";
import MapPin from "./MapPin";

export type Place = {
  name: string;
  fact: string;
  insight: string;
  challenge: string;
  imageUrl?: string;
  latitude?: number; // real latitude
  longitude?: number; // real longitude
};

interface MapCardProps {
  place: Place;
  onGenerateNew: () => void;
}

// ...existing code...
const MapCard: React.FC<MapCardProps> = ({ place, onGenerateNew }) => {
  return (
    <div className="bg-white/80 rounded-3xl shadow-xl p-8 max-w-md w-full flex flex-col items-center gap-6">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center drop-shadow">🌍 Your Exploration Map</h1>
      {/* Simple world map background with pin */}
      <div className="relative w-full h-40 mb-2 rounded-xl overflow-hidden bg-blue-200 flex items-center justify-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/600px-Equirectangular_projection_SW.jpg"
          alt="World map"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        {place.latitude !== undefined && place.longitude !== undefined && (
          <MapPin latitude={place.latitude} longitude={place.longitude} label={place.name} />
        )}
      </div>
      {place.imageUrl && (
        <img src={place.imageUrl} alt={place.name} className="rounded-xl w-full h-40 object-cover mb-2" />
      )}
      <div className="w-full flex flex-col gap-2 text-center">
        <h2 className="text-xl font-bold text-pink-700">{place.name}</h2>
        <p className="text-base text-gray-700">{place.fact}</p>
        <p className="italic text-sm text-yellow-700">Cultural Insight: {place.insight}</p>
        <div className="mt-4 flex items-center gap-3 bg-gradient-to-r from-yellow-300 via-pink-200 to-blue-200 border-l-8 border-pink-500 p-4 rounded-xl shadow-md animate-pulse">
          <span className="text-2xl">🎯</span>
          <div className="text-lg font-bold text-pink-700">
            Mini-Challenge:
            <span className="block text-base font-medium text-blue-900 mt-1">{place.challenge}</span>
          </div>
        </div>
      </div>
      <button
        className="mt-6 px-6 py-2 bg-pink-500 text-white rounded-full font-semibold shadow hover:bg-pink-600 transition"
        onClick={onGenerateNew}
      >
        Generate New Map
      </button>
      <ChatGptAsk region={place.name} />
    </div>
  );
};

export default MapCard;
