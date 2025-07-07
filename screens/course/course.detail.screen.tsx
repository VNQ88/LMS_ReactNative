import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Image } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import CourseLesson from "@/components/courses/course.lesson";
import ReviewCard from "@/components/cards/review.card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockCourses } from "@/mock/mockCourses";
import { Toast } from "react-native-toast-notifications";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";

export default function CourseDetailScreen() {
  const mockData = mockCourses[0];
  const { item } = useLocalSearchParams();
  const courseData: Course = JSON.parse(item as string);
  const [activeButton, setActiveButton] = React.useState("About");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [checkPurchased, setCheckPurchased] = React.useState(false);

  const handleAddToCart = async () => {
    const existingCartData = await AsyncStorage.getItem("cart");
    const cartData = existingCartData ? JSON.parse(existingCartData) : [];
    const itemExists = cartData.some((item: any) => item.id === courseData.id);
    if (!itemExists) {
      cartData.push(courseData);
      await AsyncStorage.setItem("cart", JSON.stringify(cartData));
      // router.push("/routes/cart");
      Toast.show("Item added to cart", {
        type: "success",
      });
    } else {
      Toast.show("Item already in cart", {
        type: "warning",
      });
    }
  };

  React.useEffect(() => {
    const checkIfEnrolled = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");

        if (!token) {
          console.warn("Token missing");
          return;
        }

        const response = await axios.get(`${SERVER_URI}/courses/enrollments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const enrolledCourses = response.data.data || []; // Giả định API trả về { data: [...] }

        const isEnrolled = enrolledCourses.some(
          (enrolled: any) => enrolled.course.id === courseData.id
        );

        setCheckPurchased(isEnrolled);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Failed to fetch enrollments:",
            error.response?.data || error.message
          );
        } else {
          console.error(
            "Failed to fetch enrollments:",
            (error as Error).message || error
          );
        }
      }
    };

    checkIfEnrolled();
  }, []);
  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 20 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: 16 }}>
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              backgroundColor: "orange",
              borderRadius: 54,
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginTop: 10,
              marginLeft: 10,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 14,
                fontFamily: "Nunito_600SemiBold",
              }}
            >
              Best Seller
            </Text>
          </View>
          {/* <View style={{ position: "absolute", zIndex: 14, right: 0 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#141517",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 3,
                marginTop: 8,
                marginRight: 8,
              }}
            >
              <FontAwesome name="star" size={14} color="#FFB800" />
              <Text
                style={{
                  color: "white",
                  marginLeft: 4,
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                {courseData?.ratings}
              </Text>
            </View>
          </View> */}
          <Image
            source={{ uri: courseData?.image }}
            style={{ width: "100%", height: 200, borderRadius: 12 }}
            resizeMode="cover"
          />
        </View>
        <Text
          style={{
            color: "black",
            fontSize: 22,
            fontFamily: "Raleway_700Bold",
            marginTop: 15,
            marginHorizontal: 16,
          }}
        >
          {courseData?.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: "#2467EC",
                fontSize: 16,
                fontFamily: "Nunito_400Regular",
                paddingVertical: 8,
                fontStyle: "italic",
                width: "100%",
              }}
            >
              ${courseData?.price}
            </Text>
            {/* <Text
              style={{
                color: "#808080",
                fontSize: 16,
                fontFamily: "Nunito_400Regular",
                marginLeft: 10,
                paddingVertical: 8,
                textDecorationLine: "line-through",
              }}
            >
              ${courseData?.estimatedPrice}
            </Text> */}
          </View>
          {/* <Text style={{ fontSize: 14 }}>
            {courseData?.purchased} students enrolled
          </Text> */}
        </View>
        <View>
          <Text
            style={{
              paddingVertical: 8,
              paddingHorizontal: 18,
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            Course Prerequisites
          </Text>
          {mockData?.prerequisites.map(
            (item: PrerequisiteType, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 18,
                  width: "90%",
                }}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={18}
                  color="#4CAF50"
                  paddingVertical={5}
                />
                <Text style={{ marginLeft: 5, fontSize: 16 }}>
                  {item.title}
                </Text>
              </View>
            )
          )}
        </View>
        <View>
          <Text
            style={{
              paddingVertical: 8,
              marginHorizontal: 18,
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            Course Benefits
          </Text>
          {mockData?.benefits.map((item: BenefitType, index: number) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 18,
                width: "90%",
              }}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={18}
                color="#4CAF50"
                paddingVertical={5}
              />
              <Text style={{ marginLeft: 5, fontSize: 16 }}>{item.title}</Text>
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 25,
            marginHorizontal: 16,
            backgroundColor: "#E1E9F8",
            borderRadius: 50,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveButton("About")}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 36,
              borderRadius: 50,
              backgroundColor:
                activeButton === "About" ? "#2467EC" : "transparent",
            }}
          >
            <Text
              style={{
                color: activeButton === "About" ? "white" : "#141517",
                fontSize: 16,
                fontFamily: "Nunito_600SemiBold",
              }}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveButton("Lesson")}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 36,
              borderRadius: 50,
              backgroundColor:
                activeButton === "Lesson" ? "#2467EC" : "transparent",
            }}
          >
            <Text
              style={{
                color: activeButton === "Lesson" ? "white" : "#141517",
                fontSize: 16,
                fontFamily: "Nunito_600SemiBold",
              }}
            >
              Lesson
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveButton("Review")}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 36,
              borderRadius: 50,
              backgroundColor:
                activeButton === "Review" ? "#2467EC" : "transparent",
            }}
          >
            <Text
              style={{
                color: activeButton === "Review" ? "white" : "#141517",
                fontSize: 16,
                fontFamily: "Nunito_600SemiBold",
              }}
            >
              Review
            </Text>
          </TouchableOpacity>
        </View>
        {activeButton === "About" && (
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
              About Course
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Nunito_400Regular",
                color: "#141517",
                marginVertical: 4,
              }}
            >
              {isExpanded
                ? courseData?.description ?? ""
                : courseData?.description
                ? courseData.description.slice(0, 300)
                : ""}
            </Text>
            {courseData?.description && courseData.description.length > 300 && (
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                <Text
                  style={{
                    color: "#2467EC",
                    fontSize: 16,
                    fontFamily: "Nunito_600SemiBold",
                  }}
                >
                  {isExpanded ? "Show Less" : "Read More"}
                  {isExpanded ? " ▲" : " ▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {activeButton === "Lesson" && (
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
            }}
          >
            <CourseLesson courseDetails={courseData} />
          </View>
        )}
        {activeButton === "Review" && mockData?.reviews.length > 0 && (
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
            }}
          >
            <View style={{ rowGap: 20 }}>
              {mockData?.reviews.map((review: ReviewType, index: number) => (
                <ReviewCard key={index} review={review} />
              ))}
            </View>
          </View>
        )}
        {activeButton === "Review" && mockData?.reviews.length === 0 && (
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Raleway_700Bold",
                color: "#141517",
              }}
            >
              No Reviews Yet
            </Text>
          </View>
        )}
      </ScrollView>
      <View
        style={{
          backgroundColor: "#FFF",
          marginHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 10,
        }}
      >
        {checkPurchased ? (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/routes/course-access",
                params: { courseData: JSON.stringify(courseData) },
              })
            }
            style={{
              backgroundColor: "#2467EC",
              paddingVertical: 12,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Nunito_600SemiBold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Go to Course
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleAddToCart}
            style={{
              backgroundColor: "#2467EC",
              paddingVertical: 12,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Nunito_600SemiBold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Add to Cart
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}
