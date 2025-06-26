import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
  Image,
} from "react-native";
import { useFonts, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { router } from "expo-router";
//   import CourseCard from "../cards/course.card";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function SearchInput({ homeScreen }: { homeScreen?: boolean }) {
  const [value, setValue] = useState("");
  const [courses, setcourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  let [fontsLoaded, fontError] = useFonts({
    Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <View style={styles.filteringContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { fontFamily: "Nunito_700Bold" }]}
          placeholder="Search"
          placeholderTextColor={"#C67cc"}
        ></TextInput>
        <TouchableOpacity style={styles.searchIconContainer}>
          <AntDesign name="search1" size={20} color={"#fff"}></AntDesign>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  filteringContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },

  searchIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: "#2467EC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "black",
    paddingVertical: 10,
    width: 271,
    height: 48,
  },
});
