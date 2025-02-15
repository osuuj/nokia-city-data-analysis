import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Map = ({ companies }) => {
  return (
    <MapContainer center={[60.1695, 24.9354]} zoom={10} className="h-96 w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {companies.map((company, index) => (
        <Marker key={index} position={[company.lat, company.lng]}>
          <Popup>{company.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
