import GoogleMap from "google-maps-react-markers";
import React from "react";
import { useState, useRef } from "react";
import pin from "../assets/Google_Maps_pin.svg";
import MapMarker from "../assets/MapMarker.png";
import { Link, useNavigate } from "react-router-dom";
import "./GoogleMap.css";

const APIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// const Marker = ({ text, onClick }) => (
//     <div className="pin-container" onClick={onClick}>
//         <img src={MapMarker} alt="Pin" />
//         {/* <div className="pin" style={{zIndex:'9999'}}/> */}
//         <p style={{ textAlign: "center", width: "5rem" }}>{text}</p>
//     </div>
// );

const Marker = ({ text, onClick }) => {
  return (
    <div className="pin-container" onClick={onClick}>
      <img src={MapMarker} alt="Pin" />
      <p>{text}</p>
    </div>
  );
};

const App = ({ mapWidth = "100%", mapHeight = "100vh", markers }) => {
  const navigate = useNavigate();

  if (!APIKey) {
    console.error("Did you set the required environment variables in .env?");
    process.exit(1); // Exit the application with an error code
  }
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  /**
   * @description This function is called when the map is ready
   * @param {Object} map - reference to the map instance
   * @param {Object} maps - reference to the maps library
   */
  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    setMapReady(true);
  };

  const onMarkerClick = (id, lat, lng) => {
    // console.log('This is ->', id)
    // console.log(lat)
    // console.log(lng)
    navigate(`/apartment/${id}`);

    // inside the map instance you can call any google maps method
    mapRef.current.setCenter({ lat, lng });
    // rif. https://developers.google.com/maps/documentation/javascript/reference?hl=it
  };

  return (
    <div
      style={{
        width: mapWidth,
        height: mapHeight,
        alignContent: "center",
        boxSizing: "border-box",
      }}
    >
      {mapReady}
      <GoogleMap
        apiKey={APIKey}
        defaultCenter={{ lat: 34.0689, lng: -118.45 }}
        defaultZoom={16}
        onGoogleApiLoaded={onGoogleApiLoaded}
        onChange={(map) => console.log("Map moved", map)}
        style={{
          width: mapWidth,
          minHeight: mapHeight,
          boxSizing: "border-box",
        }}
      >
        {markers.map(({ lat, lng, text, id }, index) => (
          <Marker
            key={index}
            lat={lat}
            lng={lng}
            text={text}
            onClick={() => onMarkerClick(id, lat, lng)} // you need to manage this prop on your Marker component!
            // draggable={true}
            // onDragStart={(e, { latLng }) => {}}
            // onDrag={(e, { latLng }) => {}}
            // onDragEnd={(e, { latLng }) => {}}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default App;
