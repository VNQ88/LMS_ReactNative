import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import { SERVER_URI } from "@/utils/uri";

interface Answer {
  questionId: number;
  selected_choice: number;
}

export default function DoQuizScreen() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const progress = useSharedValue(1);
  const { questionsData, quizId } = useLocalSearchParams();
  const router = useRouter();

  let questions: responseQuizQuestionDto[] = [];
  try {
    questions = JSON.parse(questionsData as string);
  } catch (error) {
    console.error("Error parsing questionsData:", error);
    Toast.show("Invalid quiz data", {
      type: "danger",
      placement: "bottom",
      duration: 3000,
    });
  }
  const quiz_id = parseInt(quizId as string);

  useEffect(() => {
    if (isQuizCompleted || questions.length === 0) return;

    progress.value = 1;
    setTimeLeft(10);

    const animation = withTiming(0, {
      duration: 10000,
      easing: Easing.linear,
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
          } else {
            setIsQuizCompleted(true);
            submitAnswers();
          }
        }
        return newTime;
      });
    }, 1000);

    progress.value = animation;

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isQuizCompleted, questions.length]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = {
        questionId: questions[currentQuestionIndex].id,
        selected_choice: index,
      };
      return newAnswers;
    });
  };

  const submitAnswers = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      if (!accessToken) {
        Toast.show("Please log in to submit answers", {
          type: "warning",
          placement: "bottom",
          duration: 3000,
        });
        return;
      }

      const payload = {
        quizId: quiz_id,
        answer: answers,
      };

      await axios.post(`${SERVER_URI}/quiz/answer`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setShowSuccessModal(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Toast.show("Failed to submit answers. Please try again.", {
          type: "danger",
          placement: "bottom",
          duration: 3000,
        });
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsQuizCompleted(true);
      submitAnswers();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!questions.length) {
    return <Text>No questions available</Text>;
  }

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      {!isQuizCompleted && (
        <View style={styles.timerContainer}>
          <Animated.View style={[styles.progressBar, animatedStyle]} />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      )}
      <Text style={[styles.questionText, { textAlign: "left" }]}>
        Question {currentQuestionIndex + 1}/{questions.length}
      </Text>
      <ScrollView style={styles.content}>
        {questions.length > 0 && (
          <>
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex].text}
            </Text>
            {questions[currentQuestionIndex]?.choices?.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.choiceButton,
                  selectedAnswer === index && styles.selectedChoice,
                ]}
                onPress={() => handleAnswer(index)}
                disabled={selectedAnswer !== null || isQuizCompleted}
                accessibilityLabel={`Choice ${index + 1}: ${choice.text}`}
                accessibilityRole="button"
              >
                <Text style={styles.choiceText}>{choice.text}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.buttonContainer}>
              {currentQuestionIndex < questions.length - 1 ? (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextQuestion}
                  disabled={selectedAnswer === null || isQuizCompleted}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleNextQuestion}
                  disabled={selectedAnswer === null || isQuizCompleted}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Popup Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submission Successful!</Text>
            <Text style={styles.modalMessage}>
              Your quiz answers have been submitted successfully.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.push({
                  pathname: "/routes/quiz/result",
                  params: { quizId: quiz_id.toString() },
                });
              }}
            >
              <Text style={styles.modalButtonText}>View Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    height: 20,
  },
  progressBar: {
    height: "50%",
    backgroundColor: "#2467EC",
    borderRadius: 5,
  },
  timerText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    marginLeft: 10,
    color: "#2467EC",
  },
  progressText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    marginLeft: 10,
    color: "#2467EC",
  },
  content: {
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  choiceButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDE2EC",
  },
  selectedChoice: {
    backgroundColor: "#2467EC",
    borderColor: "#2467EC",
  },
  choiceText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#000",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#2467EC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#2467EC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
});
