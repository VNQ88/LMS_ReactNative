import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import { widthPercentageToDP } from "react-native-responsive-screen";
import QuestionsCard from "@/components/cards/question.card";
import { Toast } from "react-native-toast-notifications";
import ReviewCard from "@/components/cards/review.card";
import { FontAwesome } from "@expo/vector-icons";
import { mockCourseData } from "@/mock/mockCourseData";
import { mockCourses } from "@/mock/mockCourses";
import QuizList from "../quiz-list";

export default function CourseAccessScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { courseData, lesId } = useLocalSearchParams();
  const lessonId = parseInt(lesId as string, 10);
  const data: Course = JSON.parse(courseData as string);

  const [courseContentData, setCourseContentData] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const [activeButton, setActiveButton] = useState("About");
  const [isExpanded, setIsExpanded] = useState(false);
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [reviewAvailable, setReviewAvailable] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchLessonList(); // Chỉ gọi một lần khi tải trang
    };
    fetchInitialData();
  }, []); // Không có dependency, chỉ chạy lần đầu

  useEffect(() => {
    const fetchCurrentLessonData = async () => {
      // ✅ Kiểm tra cả điều kiện và activeVideo hợp lệ
      if (
        courseContentData.length > 0 &&
        activeVideo < courseContentData.length
      ) {
        await fetchCurrentLesson();
      }
      //  fetchCurrentLesson();
      console.log("Current lesson video data fetched:", currentLesson?.video); // Gọi khi activeVideo thay đổi
    };
    fetchCurrentLessonData();
  }, [courseContentData, activeVideo]); // Chạy lại khi activeVideo thay đổi

  const fetchLessonList = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");

    if (!accessToken) {
      setIsLoading(false);
      Toast.show("No access token available", { type: "danger" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${SERVER_URI}/lesson/course`, {
        params: {
          courseId: data.id,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const lessons = response.data.data || [];
      setCourseContentData(lessons); // Giả định data là mảng lesson
      if (lessons.length > 0) {
        await fetchCurrentLesson(); // Gọi fetchCurrentLesson ngay sau khi có dữ liệu
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching lesson list:", error);
      router.push("/routes/course-details");
    }
  };

  const fetchCurrentLesson = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");

    if (!accessToken) {
      setIsLoading(false);
      Toast.show("No access token available", { type: "danger" });
      return;
    }

    setIsLoading(true);
    try {
      const lessonId = courseContentData[activeVideo]?.id;
      if (!lessonId) {
        setIsLoading(false);
        return; // Thoát nếu chưa có lessonId
      }

      const response = await axios.get(`${SERVER_URI}/lesson/${lessonId}`, {
        params: {
          courseId: data.id,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCurrentLesson(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching current lesson:", error);
      router.push("/routes/course-details");
    }
  };

  const handleQuestionSubmit = () => {
    // mock submit question
    if (question.trim() === "") return;
    alert("Question submitted: " + question);
    setQuestion("");
  };

  const renderStars = () => {
    const starts = [];
    for (let i = 1; i <= 5; i++) {
      starts.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <FontAwesome
            name={i <= rating ? "star" : "star-o"}
            size={25}
            color={"#FF8D07"}
            style={{ marginHorizontal: 4, marginTop: -5 }}
          />
        </TouchableOpacity>
      );
    }
    return starts;
  };

  function handleReviewSubmit(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView stickyHeaderIndices={[0]} style={{ flex: 1, padding: 10 }}>
          <View
            style={{ width: "100%", aspectRatio: 16 / 9, borderRadius: 10 }}
          >
            <WebView
              source={{ uri: currentLesson?.video ?? "" }}
              allowsFullscreenVideo={true}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                activeVideo === 0 && {
                  opacity: 0.5,
                },
              ]}
              disabled={activeVideo === 0}
              onPress={() => setActiveVideo(activeVideo - 1)}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                Prev
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                (courseContentData.length === 0 ||
                  activeVideo >= courseContentData.length - 1) && {
                  opacity: 0.5,
                },
              ]}
              disabled={
                courseContentData.length === 0 ||
                activeVideo >= courseContentData.length - 1
              }
              onPress={() => setActiveVideo(activeVideo + 1)}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            {courseContentData.length > 0 && courseContentData[activeVideo] ? (
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {activeVideo + 1}. {courseContentData[activeVideo].title}
              </Text>
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <Text style={{ fontSize: 18, color: "#666", marginBottom: 5 }}>
                  📚 No lessons available
                </Text>
                <Text style={{ fontSize: 14, color: "#999" }}>
                  Please check back later or contact support
                </Text>
              </View>
            )}
          </View>
          <View>
            {currentLesson && <QuizList currentLesson={currentLesson} />}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 25,
              marginHorizontal: 10,
              backgroundColor: "#E1E9F8",
              borderRadius: 50,
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 36,
                backgroundColor:
                  activeButton === "About" ? "#2467EC" : "transparent",
                borderRadius: activeButton === "About" ? 50 : 0,
              }}
              onPress={() => setActiveButton("About")}
            >
              <Text
                style={{
                  color: activeButton === "About" ? "#fff" : "#000",
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 36,
                backgroundColor:
                  activeButton === "Q&A" ? "#2467EC" : "transparent",
                borderRadius: activeButton === "Q&A" ? 50 : 0,
              }}
              onPress={() => setActiveButton("Q&A")}
            >
              <Text
                style={{
                  color: activeButton === "Q&A" ? "#fff" : "#000",
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                Q&A
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 36,
                backgroundColor:
                  activeButton === "Reviews" ? "#2467EC" : "transparent",
                borderRadius: activeButton === "Reviews" ? 50 : 0,
              }}
              onPress={() => setActiveButton("Reviews")}
            >
              <Text
                style={{
                  color: activeButton === "Reviews" ? "#fff" : "#000",
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {activeButton === "About" && (
            <View
              style={{
                marginHorizontal: 16,
                marginVertical: 25,
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                About course
              </Text>
              <Text
                style={{
                  color: "#525258",
                  fontSize: 16,
                  marginTop: 10,
                  textAlign: "justify",
                  fontFamily: "Nunito_500Medium",
                }}
              >
                {isExpanded
                  ? data?.description ?? ""
                  : (data?.description ?? "").slice(0, 302)}
              </Text>
              {data?.description && data.description.length > 302 && (
                <TouchableOpacity
                  style={{ marginTop: 3 }}
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  <Text
                    style={{
                      color: "#2467EC",
                      fontSize: 14,
                    }}
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                    {isExpanded ? "-" : "+"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {activeButton === "Q&A" && (
            <View style={{ flex: 1, margin: 15 }}>
              <View>
                <TextInput
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Ask a question..."
                  style={{
                    marginVertical: 20,
                    flex: 1,
                    textAlignVertical: "top",
                    justifyContent: "flex-start",
                    backgroundColor: "white",
                    borderRadius: 10,
                    height: 100,
                    padding: 10,
                  }}
                  multiline={true}
                />
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <TouchableOpacity
                    style={[styles.button]}
                    disabled={question === ""}
                    onPress={() => handleQuestionSubmit()}
                  >
                    <Text
                      style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ marginBottom: 20 }}>
                {mockCourseData[activeVideo]?.questions
                  ?.slice()
                  .reverse()
                  .map((item: CommentType, index: number) => (
                    <QuestionsCard
                      item={item}
                      key={index}
                      fetchCourseContent={fetchLessonList}
                      courseData={mockCourses[activeVideo]}
                      contentId={mockCourses[activeVideo]._id}
                    />
                  ))}
              </View>
            </View>
          )}
          {activeButton === "Reviews" && (
            <View style={{ marginHorizontal: 16, marginVertical: 25 }}>
              {reviewAvailable && (
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 18,
                        paddingBottom: 10,
                        paddingLeft: 2,
                        paddingRight: 5,
                      }}
                    >
                      Give one rating:
                    </Text>
                    {renderStars()}
                  </View>

                  <TextInput
                    value={review}
                    onChangeText={setReview}
                    placeholder="Give one review..."
                    style={{
                      flex: 1,
                      textAlignVertical: "top",
                      justifyContent: "flex-start",
                      backgroundColor: "white",
                      borderRadius: 10,
                      height: 100,
                      padding: 10,
                    }}
                    multiline={true}
                  />
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <TouchableOpacity
                      style={[styles.button]}
                      disabled={review === ""}
                      onPress={() => handleReviewSubmit()}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 18,
                          fontWeight: "600",
                        }}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View style={{ rowGap: 25 }}>
                {mockCourses[activeVideo]?.reviews?.map(
                  (item: ReviewType, index: number) => (
                    <ReviewCard review={item} key={index} />
                  )
                )}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: widthPercentageToDP("35%"),
    height: 40,
    backgroundColor: "#2467EC",
    marginVertical: 10,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
