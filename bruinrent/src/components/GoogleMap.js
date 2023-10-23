import React from "react";
import GoogleMapReact from 'google-map-react';
import "./screens/Apartment.css"

const AnyComp = ({ text }) => (
<div>
  {text}
</div>);

export default function GoogleMap({ markers }){
  const defaultProps = {
    center: {
      lat: 34.0689,
      lng: -118.4452
    },
    zoom: 15
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={{ key: "AIzaSyA5pc3UpR2pjZVAJWbS0kbTu-WW0CepOE8" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >

      {markers.map((marker, index) => (
                <AnyComp 
                text={marker.text} 
                lat={34.066}
                lng={-118.4452}
                key={index}
                />
            ))}
      </GoogleMapReact>
    </div>
  );
}