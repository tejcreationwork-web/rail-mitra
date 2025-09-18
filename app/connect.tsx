import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from "react-native";

export default function ConnectScreen() {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Connect With Us</Text>
        </View>
        
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.text}>
                We'd love to hear from you! Whether you have feedback, questions, or suggestions to make RailEase better, feel free to reach out.
            </Text>

            {/* Contact Options */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📧 Email</Text>
                <TouchableOpacity onPress={() => Linking.openURL("mailto:thekonkanstudios@gmail.com.")}>
                <Text style={styles.link}>thekonkanstudios@gmail.com</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🌐 Website</Text>
                <TouchableOpacity onPress={() => Linking.openURL("https://railease.example.com")}>
                <Text style={styles.link}>https://railease.example.com</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>📱 Social Media</Text>
                <TouchableOpacity onPress={() => Linking.openURL("https://twitter.com/railease")}>
                <Text style={styles.link}>Twitter</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL("https://facebook.com/railease")}>
                <Text style={styles.link}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL("https://instagram.com/railease")}>
                <Text style={styles.link}>Instagram</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>📞 Support</Text>
                <TouchableOpacity onPress={() => Linking.openURL("tel:+918806943843")}>
                <Text style={styles.link}>+91 8806943843</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#2563eb",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },
  link: {
    fontSize: 16,
    color: "#2563eb",
    marginBottom: 6,
  },
});
