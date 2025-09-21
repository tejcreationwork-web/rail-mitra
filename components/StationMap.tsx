import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface StationMapProps {
  lat: number;
  lon: number;
  stationName: string;
  zoom?: number; // optional
}

export default function StationMap({
  lat,
  lon,
  stationName,
  zoom = 16,
}: StationMapProps) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
      <style> html, body, #map { height: 100%; margin: 0; padding: 0; } </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        // Initialize map
        var map = L.map('map', {
          center: [${lat}, ${lon}],
          zoom: ${zoom},
          zoomControl: true,
          dragging: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true
        });

        // Add OSM tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        // Custom pin icon (simple map pin)
        var stationIcon = L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          iconSize: [35, 35],
          iconAnchor: [17, 35],
          popupAnchor: [0, -35]
        });

        // Add marker with popup
        L.marker([${lat}, ${lon}], { icon: stationIcon })
          .addTo(map)
          .bindPopup('${stationName}')
          .openPopup();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, height: 300, borderRadius: 12, overflow: "hidden" },
});
