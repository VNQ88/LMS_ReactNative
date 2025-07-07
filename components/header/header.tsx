import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { useEffect, useState } from "react";

export default function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }
  useEffect(() => {
    // Fetch current user when component mounts
    fetchCurrentUser()
      .then((user) => {
        console.log("Current user:", user);
      })
      .catch((error) => {
        console.error("Failed to fetch current user:", error);
      });
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await axios.get(`${SERVER_URI}/user/1`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity>
          <Image
            source={require("@/assets/icons/User.png")}
            style={styles.image}
          ></Image>
        </TouchableOpacity>
        <View>
          <Text style={[styles.helloText, { fontFamily: "Raleway_700Bold" }]}>
            Hello
          </Text>
          <Text style={[styles.text, { fontFamily: "Raleway_700Bold" }]}>
            {currentUser ? currentUser.fullName : "User"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/routes/cart")}
        style={styles.bellButton}
      >
        <View>
          <Feather name="shopping-cart" size={26} color={"black"}></Feather>
          <View style={styles.bellContainer}></View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
    width: "90%",
  },

  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: 45,
    height: 45,
    marginRight: 8,
    borderRadius: 100,
  },

  text: {
    fontSize: 16,
  },

  bellButton: {
    borderWidth: 1,
    borderColor: "#E1E2E5",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  bellIcon: {
    alignSelf: "center",
  },

  bellContainer: {
    width: 15,
    height: 15,
    backgroundColor: "#2467EC",
    position: "absolute",
    borderRadius: 50,
    right: -5,
    top: -5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  helloText: { color: "#7C7C80", fontSize: 14 },
});
