import React from "react";
import { Platform, View, StyleSheet } from "react-native";

type MapProps = {
  latitude: number;
  longitude: number;
};

let Map: React.FC<MapProps>;

if (Platform.OS === "web") {
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  const L = require("leaflet");

  // Fix default icon paths
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  Map = ({ latitude, longitude }) => (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer center={[latitude, longitude]} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
} else {
  const MapView = require("react-native-maps").default;

  Map = ({ latitude, longitude }) => (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default Map;
