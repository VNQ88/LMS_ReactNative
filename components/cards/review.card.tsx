import { View, Text, Image } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import Rating from "@/utils/rating";

export default function ReviewCard({ review }: { review: ReviewType }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{
          uri:
            // review.user?.avatar?.url ||
            "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
        }}
      />
      <View style={{ marginHorizontal: 8, flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                {review.user?.name || "Anonymous"}
              </Text>
              <View>
                <Rating rating={review.rating} />
              </View>
              <Text>{review.comment || "No comment provided."}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
