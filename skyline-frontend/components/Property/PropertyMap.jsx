"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons (Leaflet's default asset paths break under bundlers)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ properties }) {
  const map = useMap();
  useEffect(() => {
    const withCoords = properties.filter((p) => p.latitude && p.longitude);
    if (withCoords.length === 0) return;
    const bounds = L.latLngBounds(withCoords.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [properties, map]);
  return null;
}

export default function PropertyMap({ properties = [] }) {
  const withCoords = properties.filter((p) => p.latitude && p.longitude);
  const center = withCoords.length > 0 ? [withCoords[0].latitude, withCoords[0].longitude] : [26.7606, 83.3732];

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 h-[500px]">
      <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds properties={withCoords} />
        {withCoords.map((p) => (
          <Marker key={p.id} position={[p.latitude, p.longitude]} icon={markerIcon}>
            <Popup>
              <div className="text-sm">
                <b className="block mb-1">{p.title}</b>
                <span className="block text-slate-500 text-xs mb-1.5">{p.area}, {p.city}</span>
                <span className="block font-semibold text-brand mb-2">{p.priceDisplay}</span>
                <Link href={`/properties/${p.slug}`} className="text-brand text-xs font-semibold underline">
                  View Details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
