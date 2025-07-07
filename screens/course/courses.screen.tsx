import React, { use, useEffect } from "react";
import { mockCourses } from "@/mock/mockCourses";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_500Medium,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import Loader from "@/components/loader";
import { LinearGradient } from "expo-linear-gradient";
import CourseCard from "@/components/cards/course.card";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
export default function CoursesScreen() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  useEffect(() => {
    axios
      .get(`${SERVER_URI}/courses`)
      .then((res: any) => {
        setCourses(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Raleway_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
          <ScrollView>
            {courses.map((course) => (
              <CourseCard key={course.id} item={course} />
            ))}
          </ScrollView>
        </LinearGradient>
      )}
    </>
  );
}
