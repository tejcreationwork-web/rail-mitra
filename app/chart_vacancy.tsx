import React from "react";
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  StatusBar, 
  TouchableOpacity, 
  ScrollView, 
  Text 
} from "react-native";
import { WebView } from "react-native-webview";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

export default function ChartsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push("/home")} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IRCTC Reservation Chart</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingVertical: 16 }}
      >
        <View style={styles.webviewWrapper}>
          <WebView 
            source={{ uri: "https://www.irctc.co.in/online-charts/" }}
            style={styles.webview}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#2563EB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 32, // keeps title centered by balancing the back button
  },
  content: {
    flex: 1,
  },
  webviewWrapper: {
    width: width * 0.95,   // 95% of screen width
    height: 600,           // fixed height
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  webview: {
    flex: 1,
  },
});
