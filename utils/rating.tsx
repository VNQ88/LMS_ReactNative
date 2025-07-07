import { View, Text } from "react-native";
import React from "react";

export default function Rating({ rating }: { rating: number | undefined }) {
  const stars = [];
  if (rating === undefined) {
    return <Text style={{ color: "gray" }}>No rating</Text>;
  }
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={{ color: i <= (rating || 0) ? "gold" : "gray" }}>
        ★
      </Text>
    );
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
}
