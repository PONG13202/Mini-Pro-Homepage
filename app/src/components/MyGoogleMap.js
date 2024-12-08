import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    display: "flex",
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    height: "500px", // ปรับความสูงตามที่ต้องการ
    maxwidth: "100vh", // ปรับความกว้างตามที่ต้องการ
    position: "relative", // ใช้ position relative
    margin: "20px", // ทำให้กลางแนวนอน
};

const center = {
    lat: 12.709222, 
  lng: 99.647694 
};

const MyGoogleMap = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MyGoogleMap; // ส่งออกแบบค่าเริ่มต้น
