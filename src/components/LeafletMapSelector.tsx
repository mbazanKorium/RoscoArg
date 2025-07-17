// src/components/LeafletMapSelector.tsx
import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix de ícono default de Leaflet para que se vea el marker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface LeafletMapSelectorProps {
  onMapClick: (coords: { lat: number; lng: number }) => void;
  guess: { lat: number; lng: number } | null;
  real: { lat: number; lng: number } | null;
  polylineCoords: Array<[number, number]>;
  isSecondPlayerGuess?: boolean;
  isLocked?: boolean;
}

const player1Icon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Marker del jugador 2 - rojo
const player2Icon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Marker del lugar real - azul
const realIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LeafletMapSelector: React.FC<LeafletMapSelectorProps> = ({
  guess,
  real,
  polylineCoords,
  onMapClick,
  isSecondPlayerGuess = false,
  isLocked,
}) => {
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (isLocked) return;
        const { lat, lng } = e.latlng;
        onMapClick({ lat, lng });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[-34.6, -58.5]}
      zoom={10}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />
      <MapClickHandler />

      {guess && (
        <Marker
          position={[guess.lat, guess.lng]}
          icon={isSecondPlayerGuess ? player2Icon : player1Icon}
        />
      )}

      {real && guess && (
        <Marker position={[real.lat, real.lng]} icon={realIcon} />
      )}

      {polylineCoords?.length === 2 && (
        <Polyline positions={polylineCoords} color="purple" />
      )}
    </MapContainer>
  );
};

export default LeafletMapSelector;
