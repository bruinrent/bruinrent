import GoogleMap from 'google-maps-react-markers'
import React from "react";
import { useState, useRef} from "react";


const APIKey = process.env;


const Marker = ({ text }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
    <div className="pin" style={{zIndex:'9999'}}/>
    <p>{text}</p>

  </div>
)

const App = ( {markers} ) => {

if (!APIKey) {
  console.error('Did you set the required environment variables in .env?');
  process.exit(1); // Exit the application with an error code
}
  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)




  /**
   * @description This function is called when the map is ready
   * @param {Object} map - reference to the map instance
   * @param {Object} maps - reference to the maps library
   */
  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map
    setMapReady(true)
  }

  

  const onMarkerClick = (e, { markerId, lat, lng }) => {
    console.log('This is ->', markerId)

    // inside the map instance you can call any google maps method
    mapRef.current.setCenter({ lat, lng })
    // rif. https://developers.google.com/maps/documentation/javascript/reference?hl=it
  }

  return (
    <>
      {mapReady}
      <GoogleMap
        apiKey={APIKey}
        defaultCenter={{ lat: 34.0689, lng: -118.4452 }}
        defaultZoom={15}
        mapMinHeight="100vh"
        onGoogleApiLoaded={onGoogleApiLoaded}
        onChange={(map) => console.log('Map moved', map)}
      >
        {markers.map(({ lat, lng, text }, index) => (
          <Marker
            key={index}
            lat= {lat}
            lng={lng}
            markerId={text}
            text={text}
            // onClick={onMarkerClick} // you need to manage this prop on your Marker component!
            // draggable={true}
            // onDragStart={(e, { latLng }) => {}}
            // onDrag={(e, { latLng }) => {}}
            // onDragEnd={(e, { latLng }) => {}}
          /> 
        ))}   
      </GoogleMap>
    </>
  )
}

export default App