import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";

export default function DetailProfileScreen() {
  const { user } = useLocalSearchParams();
  const userData: User = JSON.parse(user as string);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Full Name:</Text>
        <Text style={styles.value}>
          {userData?.fullName || "Not available"}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData?.email || "Not available"}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{userData?.role || "Not available"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F9",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#2467EC",
  },
  title: {
    fontSize: 24,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
    flex: 1,
  },
  detailContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#575757",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#000",
  },
});
