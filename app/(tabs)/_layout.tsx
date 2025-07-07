import { View, Text, Image } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "index") {
            iconName = require("@/assets/icons/HouseSimple.png");
          } else if (route.name === "profile/index") {
            iconName = require("@/assets/icons/User.png");
          } else if (route.name === "courses/index") {
            iconName = require("@/assets/icons/BookBookmark.png");
          }
          return (
            <Image
              style={{ width: 25, height: 25, tintColor: color }}
              source={iconName}
            />
          );
        },
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen
        name="courses/index"
        options={{
          headerShown: true,
          title: "All Courses",
        }}
      />
      {/* <Tabs.Screen
        name="search/index"
        options={{
          headerShown: true,
          title: "Search Courses",
        }}
      /> */}
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}
