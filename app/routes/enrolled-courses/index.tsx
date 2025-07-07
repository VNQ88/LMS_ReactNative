import { FlatList, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "@/components/loader";
import CourseCard from "@/components/cards/course.card";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<Course>>(null);
  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoader(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem("access_token");

        if (!token) {
          setError("Vui lòng đăng nhập để xem khóa học.");
          setLoader(false);
          return;
        }

        const response = await axios.get(`${SERVER_URI}/courses/enrollments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const enrolledCourses = response.data.data as { course: Course }[];
        setCourses(enrolledCourses.map((item) => item.course));
        if (enrolledCourses.length === 0) {
          setError("Bạn chưa đăng ký khóa học nào.");
        }
        console.log("📦 Enrolled courses data:", enrolledCourses);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại.");
        console.error(
          "Failed to fetch enrollments:",
          axios.isAxiosError(error)
            ? error.response?.data || error.message
            : (error as Error).message
        );
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : error ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>{error}</Text>
      ) : (
        <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={courses}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CourseCard item={item} />}
          />
        </LinearGradient>
      )}
    </>
  );
}
