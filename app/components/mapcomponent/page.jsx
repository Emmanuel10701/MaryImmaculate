'use client';

import dynamic from 'next/dynamic';
import { FiNavigation } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Dynamically import ALL react-leaflet components with NO SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then(mod => mod.Circle),
  { ssr: false }
);

// School location - Katwanyaa High School in Kambusu, Matungulu, Machakos
const schoolLocation = [-1.312, 37.266];

// Nearby landmarks in Kambusu/Matungulu area
const nearbyLandmarks = [
  { position: [-1.311, 37.267], name: 'Kambusu Trading Center', type: 'commercial' },
  { position: [-1.313, 37.265], name: 'Kambusu Primary School', type: 'education' },
  { position: [-1.310, 37.264], name: 'Matungulu Health Center', type: 'health' },
  { position: [-1.309, 37.268], name: 'Tala-Kangundo Road', type: 'transport' },
  { position: [-1.314, 37.269], name: 'Kambusu Market', type: 'market' },
  { position: [-1.315, 37.263], name: 'A.I.C Kambusu Church', type: 'religious' },
];

// LegendItem component
function LegendItem({ color, border, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-3 h-3 rounded-full ${
          border ? 'border-2 border-orange-600' : color
        }`}
      ></span>
      <span className="text-[10px] xs:text-xs">{label}</span>
    </div>
  );
}

function calculateDistance(coord1, coord2) {
  const R = 6371e3;
  const φ1 = (coord1[0] * Math.PI) / 180;
  const φ2 = (coord2[0] * Math.PI) / 180;
  const Δφ = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const Δλ = ((coord2[1] - coord1[1]) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

  return Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getMarkerIcon(type) {
  switch (type) {
    case 'education':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
    case 'health':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
    case 'transport':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png';
    case 'commercial':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
    case 'religious':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
    case 'security':
      return 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
    default:
      return 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
  }
}

export default function MapComponent() {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState(null);

  // Load Leaflet only on client side
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      // Dynamically import Leaflet
      import('leaflet').then(leaflet => {
        // Fix Leaflet icon issues
        delete leaflet.Icon.Default.prototype._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        setL(leaflet);
      });
    }
  }, []);

  // Show loading state on server
  if (!isClient || !L) {
    return (
      <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-600">Loading map of Katwanyaa High School...</p>
        </div>
      </div>
    );
  }

  // Create custom icons for landmarks
  const createCustomIcon = (type) => {
    return new L.Icon({
      iconUrl: getMarkerIcon(type),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  };

  return (
    <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
      {/* TOP LEGEND - Reduced z-index to appear behind navbar */}
      <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-[40] w-[95%] max-w-xs sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-gray-200 px-3 py-2 sm:px-4 sm:py-3 flex flex-wrap gap-2 sm:gap-3 items-center justify-center text-[10px] xs:text-xs">
          <span className="font-semibold text-gray-700 text-[10px] xs:text-xs">Map Legend:</span>
          <LegendItem color="bg-orange-600" label="School" />
          <LegendItem border label="200m Radius" />
          <LegendItem color="bg-green-500" label="Education" />
          <LegendItem color="bg-red-500" label="Health" />
          <LegendItem color="bg-yellow-500" label="Transport" />
          <LegendItem color="bg-violet-500" label="Religious" />
          <LegendItem color="bg-orange-500" label="Security" />
        </div>
      </div>

      <MapContainer
        center={schoolLocation}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* School Marker */}
        <Marker position={schoolLocation}>
          <Popup>
            <div className="p-3 min-w-[200px] sm:min-w-[240px]">
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                🏫 A.I.C Katwanyaa High School
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                Kambusu, Matungulu, Machakos County
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Along Tala-Kangundo Road, Kambusu Village
              </p>
              <a
                href="https://maps.google.com/?q=AIC+Katwanyaa+High+School,Kambusu+Matungulu+Machakos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:opacity-90 transition"
              >
                <FiNavigation className="w-3 h-3 sm:w-4 sm:h-4" />
                Get Directions
              </a>
            </div>
          </Popup>
        </Marker>

        {/* Radius */}
        <Circle
          center={schoolLocation}
          radius={200}
          pathOptions={{
            color: '#ea580c',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '6,6',
          }}
        />

        {/* Nearby Landmarks */}
        {nearbyLandmarks.map((landmark, index) => (
          <Marker
            key={index}
            position={landmark.position}
            icon={createCustomIcon(landmark.type)}
          >
            <Popup>
              <div className="p-3">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {landmark.name}
                </h4>
                <p className="text-xs text-gray-500 capitalize">
                  {landmark.type}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Approx. distance:{' '}
                  {calculateDistance(schoolLocation, landmark.position)} m
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Bottom Info Bar - Reduced z-index */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-[40] w-[95%] max-w-xs sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 flex flex-col xs:flex-row items-center justify-center gap-1.5 xs:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] xs:text-xs font-medium text-gray-700">Located in Kambusu, Matungulu</span>
          </div>
          <div className="hidden xs:block w-px h-4 bg-gray-300"></div>
          <span className="text-[10px] xs:text-xs text-gray-600 text-center xs:text-left">Coordinates: -1.312, 37.266</span>
        </div>
      </div>
    </div>
  );
}