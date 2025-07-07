import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { use, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList } from "react-native";
import { mockCartCourses } from "@/mock/mockCartData";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";

export default function CartScreen() {
  const [cartItems, setCartItems] = React.useState<Course[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    const subscription = async () => {
      const cart: any = await AsyncStorage.getItem("cart");
      setCartItems(JSON.parse(cart));
    };
    subscription();
  }, []);

  async function onRefresh(): Promise<void> {
    setRefreshing(true);
    const cart: any = await AsyncStorage.getItem("cart");
    setCartItems(cart);
    setRefreshing(false);
  }

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleCourseDetails = (item: Course) => {
    router.push({
      pathname: "/routes/course-details",
      params: { item: JSON.stringify(item) },
    });
  };

  const handleRemoveItem = async (item: Course) => {
    const existingCartData = await AsyncStorage.getItem("cart");
    const cartData = existingCartData ? JSON.parse(existingCartData) : [];
    const updatedCartData = cartData.filter((i: any) => i.id !== item.id);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCartData));
    setCartItems(updatedCartData);
    console.log("Item from cart:", updatedCartData);
  };

  async function handlePayment() {
    const token = await AsyncStorage.getItem("access_token");
    console.log("🔐 Token:", token);

    if (!token) {
      // Nếu không có token, hiển thị thông báo lỗi
      Toast.show("Authorization failed. You must be logged in.", {
        type: "error",
        duration: 2000,
      });
      return;
    }

    let hasError = false;

    for (const item of cartItems) {
      const url = `${SERVER_URI}/courses/${item.id}/enroll`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.post(url, {}, { headers });
        console.log(`✅ Enrolled in course ${item.id}:`, response.data);
      } catch (error: any) {
        hasError = true;
        console.error(`❌ Failed to enroll course ${item.id}:`, error);
      }
    }

    if (!hasError) {
      // Nếu tất cả enroll thành công
      await AsyncStorage.removeItem("cart");
      setCartItems([]);

      Toast.show("You have enrolled in all courses!", {
        type: "success",
        duration: 2000,
      });
    } else {
      console.log("⚠️ Some courses failed to enroll. Cart not cleared.");
    }
  }

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await AsyncStorage.getItem("cartItems");
        if (items) {
          setCartItems(JSON.parse(items));
        }
      } catch (error) {
        console.error("Failed to load cart items", error);
      }
    };
    fetchCartItems();
  }, []);
  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              flexDirection: "row",
              marginVertical: 8,
              backgroundColor: "white",
              borderRadius: 8,
            }}
          >
            <TouchableOpacity onPress={() => handleCourseDetails(item)}>
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  marginRight: 10,
                }}
                source={{ uri: item.image }}
              />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    // Handle item press
                    handleCourseDetails(item);
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      fontFamily: "NunitoSans_600SemiBold",
                    }}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    <Entypo name="dot-single" size={24} color="#6B7280" />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "NunitoSans_400Regular",
                        color: "#6B7280",
                      }}
                    >
                      Beginner
                      {/* {item.level} */}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    <FontAwesome name="dollar" size={14} color="#6B7280" />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "NunitoSans_400Regular",
                        color: "#6B7280",
                      }}
                    >
                      {item.price}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item)}
                style={{
                  backgroundColor: "#F87171",
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 10,
                  width: 100,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontFamily: "NunitoSans_600SemiBold",
                    textAlign: "center",
                  }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Image
              source={require("@/assets/empty_cart.png")}
              style={{ width: 200, height: 200, resizeMode: "contain" }}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "NunitoSans_600SemiBold",
                marginTop: 10,
              }}
            >
              Your cart is empty
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={{ marginBottom: 25 }}>
        {cartItems?.length === 0 ||
          (cartItems?.length > 0 && (
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                marginTop: 20,
                fontFamily: "Nunito_700Bold",
              }}
            >
              Total Price: ${calculateTotalPrice()}
            </Text>
          ))}
        {cartItems?.length === 0 ||
          (cartItems?.length > 0 && (
            <TouchableOpacity
              style={{
                backgroundColor: "#007BFF",
                borderRadius: 5,
                padding: 10,
                marginTop: 20,
                width: "80%",
                alignSelf: "center",
              }}
              onPress={() => handlePayment()}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  textAlign: "center",
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                Go for payment
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </LinearGradient>
  );
}
