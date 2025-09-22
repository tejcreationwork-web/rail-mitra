import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

export default function ChartsScreen() {
  const handleSslError = (event :any) => {
    // Android-only: instruct the native SslErrorHandler to proceed.
    // NOTE: This bypasses SSL validation — only for testing.
    try {
      // event has methods on the native side; this is the recommended pattern used by many RN WebView examples
      // call preventDefault then proceed to instruct native handler
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      if (event && typeof event.proceed === "function") {
        event.proceed();
      }
    } catch (e) {
      console.warn("Failed to bypass SSL error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IRCTC Retiring Rooms</Text>
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
            source={{ uri: "https://www.rr.irctc.co.in/home" }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            // allow loading mixed content (http resources on https page). helps sometimes.
            mixedContentMode="always"
            // Android-only hook to handle SSL errors
            onReceivedSslError={handleSslError}
            // optionally handle other errors
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn("WebView error: ", nativeEvent);
            }}
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
    width: 32,
  },
  content: {
    flex: 1,
  },
  webviewWrapper: {
    width: width * 0.95,
    height: 600,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  webview: {
    flex: 1,
  },
});
