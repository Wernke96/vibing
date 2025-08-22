"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import MapCard, { Place } from "../components/MapCard";

const places: Place[] = [
  {
    name: "Kyoto, Japan",
    fact: "Kyoto has over 1,600 Buddhist temples.",
    insight: "Respect for tradition is deeply woven into daily life.",
    challenge: "Try saying 'Konnichiwa' to someone today!",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    latitude: 35.0116,
    longitude: 135.7681
  },
  {
    name: "Reykjavik, Iceland",
    fact: "Iceland runs almost entirely on renewable energy.",
    insight: "Hot springs are a big part of Icelandic culture.",
    challenge: "Take a cold shower for 10 seconds!",
    imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    latitude: 64.1466,
    longitude: -21.9426
  },
  {
    name: "Marrakech, Morocco",
    fact: "The medina of Marrakech is a UNESCO World Heritage site.",
    insight: "Haggling in markets is expected and part of the fun.",
    challenge: "Try a new spice in your next meal.",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
    latitude: 31.6295,
    longitude: -7.9811
  },
  {
    name: "Cusco, Peru",
    fact: "Cusco was the historic capital of the Inca Empire.",
    insight: "Altitude can affect how you feel—take it slow!",
    challenge: "Learn how to say 'hello' in Quechua: 'Rimaykullayki'!",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
    latitude: -13.5319,
    longitude: -71.9675
  },
  {
    name: "Cape Town, South Africa",
    fact: "Table Mountain is one of the oldest mountains in the world.",
    insight: "South Africa has 11 official languages.",
    challenge: "Greet someone in a new language today!",
    imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    latitude: -33.9249,
    longitude: 18.4241
  },
  {
    name: "Venice, Italy",
    fact: "Venice is built on more than 100 small islands.",
    insight: "There are no cars in the historic center—boats rule!",
    challenge: "Try making or eating Italian food today!",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    latitude: 45.4408,
    longitude: 12.3155
  },
  {
    name: "Sydney, Australia",
    fact: "Sydney Opera House hosts over 1,500 performances a year.",
    insight: "Aussies love the outdoors and beach culture.",
    challenge: "Go for a walk or spend time outside!",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
    latitude: -33.8688,
    longitude: 151.2093
  },
];

function getRandomPlace(currentIndex: number | null = null) {
  let idx = Math.floor(Math.random() * places.length);
  // Avoid repeating the same place
  if (currentIndex !== null && places.length > 1) {
    while (idx === currentIndex) {
      idx = Math.floor(Math.random() * places.length);
    }
  }
  return { place: places[idx], idx };
}

export default function Home() {
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const { place, idx } = getRandomPlace(currentIdx);

  const handleGenerateNew = () => {
    setCurrentIdx(idx);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 p-6">
      <MapCard place={place} onGenerateNew={handleGenerateNew} />
      <footer className="mt-10 text-gray-500 text-xs">Open the app again for a new adventure!</footer>
    </div>
  );
}
