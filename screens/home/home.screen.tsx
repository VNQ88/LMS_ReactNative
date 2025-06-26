import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header";
import { ScrollView } from "react-native";
import SearchInput from "@/components/common/search.input";
import HomeBannerSlider from "@/components/home/home.banner.slider";
import AllCourses from "@/components/courses/all.courses";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 50 }}
    >
      <Header></Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchInput></SearchInput>
        <HomeBannerSlider></HomeBannerSlider>
        <AllCourses></AllCourses>
      </ScrollView>
    </LinearGradient>
  );
}
