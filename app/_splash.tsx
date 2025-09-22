import React, { useEffect } from "react";
import { View, StyleSheet, ImageBackground, ActivityIndicator} from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
    router.replace("/(tabs)/home"); // 👈 navigate to main app
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ImageBackground
      source={require("../assets/images/splash-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,             
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 80,
  },
});
