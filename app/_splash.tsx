import React, { useEffect } from "react";
import { View, StyleSheet, ImageBackground, ActivityIndicator, Dimensions } from "react-native";
import { useRouter } from "expo-router";


const { width, height } = Dimensions.get("window");

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
    width: width,     
    height: height,    
  },
  spinnerContainer: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
});
