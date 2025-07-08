import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useCallback } from "react";
import { commonStyles } from "@/styles/common/common.styles";
import { router } from "expo-router";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

interface UserInfo {
  fullName: string;
  email: string;
  password: string;
}

interface ErrorState {
  fullName: string;
  email: string;
  password: string;
}

export default function SignUpScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ErrorState>({
    fullName: "",
    email: "",
    password: "",
  });

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePasswordValidation = useCallback((text: string) => {
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (!passwordOneNumber.test(text)) {
      setErrors({ ...errors, password: "At least one number required" });
    } else if (!passwordSixValue.test(text)) {
      setErrors({ ...errors, password: "At least 6 characters required" });
    } else {
      setErrors({ ...errors, password: "" });
    }
    setUserInfo({ ...userInfo, password: text });
  }, []);

  const SetUserInfo = useCallback((field: keyof UserInfo, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateInputs = useCallback(() => {
    let valid = true;
    const newErrors = { fullName: "", email: "", password: "" };

    if (!userInfo.fullName) {
      newErrors.fullName = "Full name is required";
      valid = false;
    }
    if (!userInfo.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!isValidEmail(userInfo.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }
    if (!userInfo.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }, [userInfo]);

  const handleSignUp = useCallback(async () => {
    if (!validateInputs()) {
      Toast.show("Please fix the errors", { type: "danger" });
      return;
    }

    setButtonSpinner(true);
    try {
      await axios.post(`${SERVER_URI}/auth/register`, userInfo);
      Toast.show("Sign up successful! Let's get started", {
        type: "success",
        placement: "top",
        duration: 5000,
      });
      setUserInfo({ fullName: "", email: "", password: "" });
      router.push("/routes/verifyAccount");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          Toast.show(data.message || "Sign up failed!", { type: "danger" });
        } else if (status === 429) {
          Toast.show("Too many requests, please try again later", {
            type: "danger",
          });
        } else {
          Toast.show("An error occurred. Please try again.", {
            type: "danger",
          });
        }
      } else {
        Toast.show("Network error, please check your connection", {
          type: "danger",
        });
      }
    } finally {
      setButtonSpinner(false);
    }
  }, [userInfo, validateInputs]);

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: responsiveHeight(2) }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Image
          style={styles.signInImage}
          source={require("@/assets/sign-in/sign_in.png")}
        />
        <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
          Let's get started
        </Text>
        <Text
          style={[styles.learningText, { fontFamily: "Raleway_400Regular" }]}
        >
          Create your new account to get all features
        </Text>
        <View style={styles.inputContainer}>
          {errors.fullName && (
            <View style={styles.errorContainer}>
              <Entypo name="cross" size={18} color="red" />
              <Text style={styles.errorText}>{errors.fullName}</Text>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <AntDesign
              name="user"
              size={20}
              color="#A1A1A1"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, commonStyles.input]}
              keyboardType="default"
              value={userInfo.fullName}
              placeholder="nguyen van a"
              onChangeText={(text) => SetUserInfo("fullName", text)}
            />
          </View>

          {errors.email && (
            <View style={styles.errorContainer}>
              <Entypo name="cross" size={18} color="red" />
              <Text style={styles.errorText}>{errors.email}</Text>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <Fontisto
              name="email"
              size={20}
              color="#A1A1A1"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, commonStyles.input]}
              keyboardType="email-address"
              value={userInfo.email}
              placeholder="example@gmail.com"
              onChangeText={(text) => SetUserInfo("email", text)}
            />
          </View>

          {errors.password && (
            <View style={styles.errorContainer}>
              <Entypo name="cross" size={18} color="red" />
              <Text style={styles.errorText}>{errors.password}</Text>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <SimpleLineIcons
              name="lock"
              size={20}
              color="#A1A1A1"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, commonStyles.input]}
              secureTextEntry={!isPasswordVisible}
              placeholder="************"
              onChangeText={handlePasswordValidation}
            />
            <TouchableOpacity
              style={styles.visibleIcon}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <Ionicons name="eye-off" size={24} color="#A1A1A1" />
              ) : (
                <Ionicons name="eye" size={24} color="#A1A1A1" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            {buttonSpinner ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.signUpText}>Sign up</Text>
            )}
          </TouchableOpacity>
          <View style={styles.socialButtons}>
            <TouchableOpacity>
              <FontAwesome name="google" size={30} />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="github" size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.signupRedirect}>
            <Text style={styles.redirectText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/routes/login")}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  signInImage: {
    width: "40%",
    height: responsiveHeight(20),
    alignSelf: "center",
    marginTop: responsiveHeight(6),
  },
  welcomeText: {
    textAlign: "center",
    fontSize: responsiveHeight(3),
  },
  learningText: {
    textAlign: "center",
    color: "#575757",
    fontSize: responsiveHeight(2),
    marginTop: responsiveHeight(1),
  },
  inputContainer: {
    marginHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(4),
    rowGap: responsiveHeight(2),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingLeft: responsiveWidth(-2),
  },
  inputIcon: {
    marginLeft: responsiveWidth(4),
  },
  visibleIcon: {
    padding: responsiveWidth(2),
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(-1),
  },
  errorText: {
    color: "red",
    fontSize: responsiveHeight(1.8),
    marginLeft: responsiveWidth(1),
  },
  signUpButton: {
    padding: responsiveHeight(2),
    borderRadius: 8,
    backgroundColor: "#2467EC",
  },
  signUpText: {
    color: "white",
    textAlign: "center",
    fontSize: responsiveHeight(2),
    fontFamily: "Raleway_700Bold",
  },
  socialButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: responsiveWidth(4),
  },
  signupRedirect: {
    flexDirection: "row",
    marginHorizontal: responsiveWidth(4),
    justifyContent: "center",
    marginBottom: responsiveHeight(2),
  },
  redirectText: {
    fontSize: responsiveHeight(2.2),
    fontFamily: "Raleway_600SemiBold",
  },
  signInText: {
    fontSize: responsiveHeight(2.2),
    fontFamily: "Raleway_600SemiBold",
    color: "#2467EC",
    marginLeft: responsiveWidth(1),
  },
});
