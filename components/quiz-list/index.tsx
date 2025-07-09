import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";
import { router } from "expo-router";
import { set } from "lodash";

interface QuizResponse {
  quiz: Quiz;
  questions: responseQuizQuestionDto[];
}
export default function QuizList({ currentLesson }: { currentLesson: Lesson }) {
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("access_token");
        if (!accessToken) {
          Toast.show("Please log in to access this feature.", {
            type: "danger",
            placement: "bottom",
            duration: 4000,
          });
          return;
        }
        const quizIdResponse = await axios.get(
          `${SERVER_URI}/quiz/by-lesson/${currentLesson.id}`
        );
        const res = await axios.get(
          `${SERVER_URI}/quiz/${quizIdResponse.data.data.quizId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setQuizData(res.data.data);
        // Gọi API kiểm tra quiz completion ngay sau khi có quizData

        if (res.data.data?.quiz?.id) {
          console.log(
            "Checking quiz completion for ID:",
            res.data.data.quiz.id
          );
          await checkQuizCompletion(res.data.data.quiz.id);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
        }
      }
    };

    fetchLessons();
  }, [currentLesson.id]);
  const checkQuizCompletion = async (quizId: number) => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      await axios.get(`${SERVER_URI}/quiz/answer/${quizId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setIsQuizCompleted(true);
      console.log("✅ Quiz is completed", isQuizCompleted);
    } catch (error) {
      setIsQuizCompleted(false);
    }
  };
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
              <View style={{ width: "75%" }}>
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
                {isQuizCompleted && (
                  <Text
                    style={{
                      padding: 10,
                      color: "#2467EC",
                      fontSize: 14,
                      fontFamily: "Raleway_400Regular",
                    }}
                  >
                    Quiz Completed. You can view your result.
                  </Text>
                )}
              </View>
              <View>
                {isQuizCompleted ? (
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: "/routes/quiz/quiz-result",
                        params: { quizId: quizData.quiz.id.toString() },
                      });
                    }}
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Feather
                      name="check-circle"
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
                      View Result
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      if (quizData.questions) {
                        router.push({
                          pathname: "/routes/quiz/do-quiz",
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
                )}
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
