import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = ({ markers }) => {
    return (
        <MapContainer
            center={[34.0689, -118.4452]} // Centered around UCLA's coordinates
            zoom={15} // Set an appropriate zoom level
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lng]}>
                    <Popup>{marker.popupContent}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
