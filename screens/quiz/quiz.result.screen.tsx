import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";

interface QuestionResult {
  id: number;
  question: {
    id: number;
    text: string;
    order: number;
  };
  selected_choice: { id: number; text: string; isCorrect: boolean }[];
  answeredAt: string;
  choices: { id: number; text: string; isCorrect: boolean }[];
}

interface QuizResult {
  quiz: {
    id: number;
    title: string;
    description: string;
    long_time: number;
    timeInSeconds: number;
    course: Course;
  };
  questions: QuestionResult[];
  score: number;
}

export default function QuizResultScreen() {
  const { quizId } = useLocalSearchParams();
  const id = parseInt(quizId as string, 10);
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = await AsyncStorage.getItem("access_token");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          `${SERVER_URI}/quiz/answer/${quizId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setQuizResult(response.data.data);
      } catch (err) {
        setError("Failed to load results. Please try again.");
        if (axios.isAxiosError(err)) {
          Toast.show(err.message || "Network error", {
            type: "danger",
            placement: "bottom",
            duration: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);
  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!quizResult) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading quiz results...</Text>
      </View>
    );
  }

  const totalQuestions = quizResult.questions.length;
  const correctAnswers = quizResult.score;

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/routes/course-access",
              params: { courseData: JSON.stringify(quizResult.quiz.course) },
            })
          }
        >
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Result</Text>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Quiz Result: {correctAnswers}/{totalQuestions}
        </Text>
      </View>

      {/* Questions List */}
      <ScrollView style={styles.content}>
        {quizResult.questions.map((questionResult, index) => {
          const selectedChoice = questionResult.selected_choice[0];
          const isCorrect = selectedChoice.isCorrect;

          return (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>
                Question {index + 1}: {questionResult.question.text}
              </Text>
              <Text style={styles.selectedChoiceText}>
                Your Answer: {selectedChoice.text}
              </Text>
              {!selectedChoice.isCorrect && (
                <Text style={styles.selectedChoiceText}>
                  Correct Answer:{" "}
                  {questionResult.choices
                    .filter((choice) => choice.isCorrect)
                    .map((choice) => choice.text)
                    .join(", ")}
                </Text>
              )}
              <Text
                style={[
                  styles.resultText,
                  isCorrect ? styles.correct : styles.incorrect,
                ]}
              >
                Result: {isCorrect ? "Correct" : "Incorrect"}
              </Text>
              <Text style={styles.answeredAtText}>
                Answered at:{" "}
                {new Date(questionResult.answeredAt).toLocaleString()}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#2467EC",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: "#000",
  },
  summary: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDE2EC",
  },
  summaryText: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
    color: "#2467EC",
  },
  content: {
    flex: 1,
  },
  questionContainer: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDE2EC",
  },
  questionText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    marginBottom: 10,
  },
  selectedChoiceText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#555",
    marginBottom: 5,
  },
  resultText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 5,
  },
  correct: {
    color: "#28A745",
  },
  incorrect: {
    color: "#DC3545",
  },
  answeredAtText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#888",
  },
});
