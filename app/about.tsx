import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>About Our Service</Text>
        </View>
    
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* About Our Service */}
        
            <Text style={styles.text}>
                RailEase - Your Smart Railway Companion{"\n\n"}
                RailEase is designed to help travelers make better decisions and enjoy a smoother railway journey.{"\n\n"}
                🚉 What We Offer:{"\n"}
                • Train Schedules{"\n"}
                • PNR Status Checker{"\n"}
                • Station Amenities & Layouts{"\n"}
                • Help Desk for Emergencies{"\n"}
                • Q&A Section{"\n\n"}
                🎯 Our Mission:{"\n"}
                To simplify railway travel by combining useful services in one app, helping users save time, reduce stress, and travel with confidence.{"\n\n"}
                ⚠️ Disclaimer:{"\n"}
                RailEase is not an official railway application. While we work to provide accurate and timely information, train schedules, PNR status, and other services may sometimes vary from official railway sources.{"\n\n"}
            </Text>

        {/* Privacy & Policies */}
            <Text style={styles.title}>Privacy & Policies</Text>
            <Text style={styles.text}>
                🔒 Privacy & Security{"\n"}
                We value your privacy and are committed to protecting your personal information.{"\n"}
                • We do not sell or share your personal data with third parties.{"\n"}
                • Data collected (like queries in Q&A) is used only to improve the app.{"\n"}
                • Sensitive information like PNR numbers is processed securely.{"\n\n"}
                
                📜 Terms of Use{"\n"}
                By using RailEase, you agree to use the app responsibly and for lawful purposes only.{"\n"}
                • Information is for reference and may vary from official sources.{"\n"}
                • Verify critical details with official Indian Railways platforms.{"\n"}
                • Misuse (spamming Q&A, fraud) may lead to restricted access.{"\n\n"}
                
                📖 Disclaimer{"\n"}
                RailEase is an independent application and is not affiliated with Indian Railways or any government body.{"\n\n"}
                
                🛡️ Your Responsibility{"\n"}
                • Double-check time-sensitive details with official sources.{"\n"}
                • Use Q&A respectfully.{"\n"}
                • Report issues or incorrect info to our support team.{"\n"}
            </Text>
        </ScrollView>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 60,
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
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 20,
    color: "#2563eb",
  },
  text: {
    paddingTop: 20,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
