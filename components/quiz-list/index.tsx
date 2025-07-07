import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";
import { router } from "expo-router";

interface QuizResponse {
  quiz: Quiz;
  questions: responseQuizQuestionDto[];
}
export default function QuizList({ currentLesson }: { currentLesson: Lesson }) {
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState<boolean>(false);
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("access_token");
        if (!accessToken) {
          console.error("❌ No access token found");
          alert("Please log in to access this feature.");
          setLoading(false);
          return;
        }
        const res = await axios.get(`${SERVER_URI}/quiz/${currentLesson.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setQuizData(res.data.data); // hoặc `res.data` tuỳ theo backend trả về
      } catch (error) {
        // Xử lý lỗi khi không lấy được dữ liệu
        if (axios.isAxiosError(error)) {
          //   console.error("❌ Axios error:", error.message);
          Toast.show("Cannot get quiz data. Please try again later.", {
            placement: "bottom",
            duration: 3000,
            animationType: "slide-in",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []); // ⬅️ chạy 1 lần duy nhất khi component mount
  //   if (loading) return <Text>Loading...</Text>;
  console.log(quizData?.questions);
  if (!quizData) return <Text>No Quiz Available</Text>;
  return (
    <Fragment>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          borderBottomColor: "#DCDCDC",
        }}
      >
        <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
          Quiz
          {/* {item} */}
        </Text>
        {visible ? (
          <TouchableOpacity onPress={() => toggleVisibility()}>
            <Entypo name="chevron-up" size={23} color={"#6707FE"} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => toggleVisibility()}>
            <Entypo name="chevron-down" size={23} color={"#6707FE"} />
          </TouchableOpacity>
        )}
      </View>
      {visible && (
        <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#E1E2E5",
              borderRadius: 8,
              gap: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "80%" }}>
                <Text
                  style={{
                    padding: 10,
                    fontSize: 16,
                    fontFamily: "Raleway_600SemiBold",
                  }}
                >
                  {quizData?.quiz.title || "No Quiz Available"}
                </Text>
                <Text
                  style={{
                    padding: 10,
                    fontSize: 14,
                    fontFamily: "Raleway_400Regular",
                  }}
                >
                  Description: {quizData?.quiz.description || ""}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (quizData.questions) {
                      router.push({
                        pathname: "/routes/quiz/do-quiz/",
                        params: {
                          questionsData: JSON.stringify(quizData.questions),
                          quizId: quizData.quiz.id.toString(),
                        },
                      });
                    } else {
                      Toast.show("Quiz questions not loaded yet.", {
                        placement: "bottom",
                        duration: 3000,
                        animationType: "slide-in",
                      });
                      console.log(quizData.questions);
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Feather
                    name="play"
                    size={24}
                    color="#2467EC"
                    style={{ padding: 4 }}
                  />
                  <Text
                    style={{
                      paddingRight: 10,
                      fontSize: 14,
                      fontFamily: "Raleway_400Regular",
                    }}
                  >
                    Start
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </Fragment>
  );
}
const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E1E2E5",
    marginHorizontal: 10,
    paddingVertical: 12,
    marginVertical: 4,
  },
  itemContainerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitleText: {
    width: "75%",
    marginLeft: 8,
    color: "#525258",
    fontSize: 16,
  },
  itemDataContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
