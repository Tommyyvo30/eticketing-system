import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, HeatmapLayer } from "@react-google-maps/api";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import fetchWithAuth from "../utils/api";
const mapContainerStyle = {
  height: "600px",
  width: "1180px",
};

const center = {
  lat: 49.2827, // Coordinates for Vancouver
  lng: -123.1207,
};

const libraries = ["visualization"];

const Heatmap = ({ onBack }) => {
  const [locations, setLocations] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBesNlwFe749CyepPgg2GcRnruEO4f4-cA", // ENTER API Key
    libraries,
  });

  const geocodeAddress = (address, geocoder) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          resolve(results[0].geometry.location);
        } else {
          reject(status);
        }
      });
    });
  };

  useEffect(() => {
    if (!isLoaded) return;

    const geocoder = new window.google.maps.Geocoder();
    fetchWithAuth("http://localhost:3000/routes/tickets")
      .then((response) => response.json())
      .then(async (data) => {
        const promises = data.map((ticket) => {
          if (!ticket.address) {
            console.error("Ticket address is undefined or empty:", ticket);
            return Promise.resolve(null);
          }
          return geocodeAddress(ticket.address, geocoder).catch((status) => {
            console.error("Geocoding failed:", ticket.address, status);
            return null;
          });
        });

        Promise.all(promises)
          .then((results) => {
            const validLocations = results.filter((latLng) => latLng !== null);
            setLocations(validLocations);
            const newHeatmapData = validLocations.map((latLng) => {
              return new window.google.maps.LatLng(latLng.lat(), latLng.lng());
            });
            setHeatmapData(newHeatmapData);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }, [isLoaded]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: "Courier New, monospace", fontWeight: "bold" }}
      >
        Heat Map
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginBottom: "10px" }}
        onClick={onBack}
      >
        &larr; Back
      </Button>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
      >
        {heatmapData.length > 0 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 20,
              opacity: 0.6,
            }}
          />
        )}
      </GoogleMap>
    </>
  );
};

export default Heatmap;
