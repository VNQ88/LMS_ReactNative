import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

export default function CourseCard({ item }: { item: CoursesType }) {
  return (
    <TouchableOpacity style={styles.container}>
      <View>
        <Image
          style={{
            width: responsiveWidth(39),
            height: responsiveHeight(15),
            borderRadius: 5,
            alignSelf: "center",
            objectFit: "cover",
          }}
          source={{
            uri: item?.thumbnail?.url!,
          }}
        ></Image>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFF",
    marginHorizontal: 6,
    borderRadius: 12,
    width: "95%",
    height: "auto",
    overflow: "hidden",
    margin: "auto",
    marginVertical: 15,
    padding: 8,
  },
  ratingText: {
    color: "white",
    fontSize: 14,
  },
});
