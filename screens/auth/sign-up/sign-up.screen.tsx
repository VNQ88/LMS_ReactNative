import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  GestureResponderEvent,
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
import { useState } from "react";
import { commonStyles } from "@/styles/common/common.styles";
import { router } from "expo-router";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

// import axios from "axios";
// import { SERVER_URI } from "@/utils/uri";
// import { Toast } from "react-native-toast-notifications";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// Định nghĩa type
interface UserInfo {
  fullName: string;
  email: string;
  password: string;
}

interface ErrorState {
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
  const [required, setRequired] = useState("");
  const [error, setError] = useState<ErrorState>({
    password: "",
  });
  function handlePasswordValidation(text: string): void {
    const password = text;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{3,})/;

    // if (!passwordSpecialCharacter.test(password)) {
    //   setError({
    //     ...error,
    //     password: "Write at least one special character",
    //   });
    //   setUserInfo({ ...userInfo, password: "" });
    // } else
    if (!passwordOneNumber.test(password)) {
      setError({ ...error, password: "Write at least one number" });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!passwordSixValue.test(password)) {
      setError({ ...error, password: "Write at least 3 characters" });
      setUserInfo({ ...userInfo, password: "" });
    } else {
      setError({ ...error, password: "" });
      setUserInfo({ ...userInfo, password: text });
    }
  }

  const handleSignUp = async () => {
    if (!userInfo.fullName || !userInfo.email || !userInfo.password) {
      Toast.show("Please fill all fields", { type: "danger" });
      console.log(userInfo);
      return;
    }

    setButtonSpinner(true);
    try {
      const response = await axios.post(
        `${SERVER_URI}/auth/register`,
        userInfo
      );

      Toast.show("Sign up successful! Let's get started", {
        type: "success",
        placement: "top",
        duration: 5000,
      });
      setUserInfo({
        fullName: "",
        email: "",
        password: "",
      });
      // router.push("/routes/verifyAccount");
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        Toast.show("Sign up failed!", { type: "danger" });
      } else {
        Toast.show("An error occurred. Please try again.", { type: "danger" });
      }
    } finally {
      setButtonSpinner(false);
    }
  };

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 20 }}
    >
      <ScrollView>
        <Image
          style={styles.signInImage}
          source={require("@/assets/sign-in/sign_in.png")}
        ></Image>
        <Text
          style={[
            styles.welcomeText,
            { fontFamily: "Railway_700Bold", fontWeight: "bold" },
          ]}
        >
          Let's get started
        </Text>
        <Text
          style={[styles.learningText, { fontFamily: "Railway_400Regular" }]}
        >
          Create your new account to get all features
        </Text>
        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[styles.input, { paddingLeft: 40, marginBottom: -12 }]}
              keyboardType="default"
              value={userInfo.fullName}
              placeholder="nguyen van a"
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, fullName: text })
              }
            ></TextInput>
            <AntDesign
              style={{ position: "absolute", left: 26, top: 17.8 }}
              name="user"
              size={20}
              color="#A1A1A1"
            ></AntDesign>
          </View>
          <View>
            <TextInput
              style={[styles.input, { paddingLeft: 40 }]}
              keyboardType="email-address"
              value={userInfo.email}
              placeholder="example@gmail.com"
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
            ></TextInput>
            <Fontisto
              style={{ position: "absolute", left: 26, top: 17.8 }}
              name="email"
              size={20}
              color="#A1A1A1"
            ></Fontisto>
            {required && (
              <View style={commonStyles.errorContainer}>
                <Entypo name="cross" size={18} color="red"></Entypo>
              </View>
            )}
            <View style={{ marginTop: 15 }}>
              <TextInput
                style={commonStyles.input}
                keyboardType="default"
                secureTextEntry={!isPasswordVisible}
                defaultValue=""
                placeholder="************"
                onChangeText={handlePasswordValidation}
              ></TextInput>
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
              <SimpleLineIcons
                style={styles.icon2}
                name="lock"
                size={20}
                color="#A1A1A1"
              ></SimpleLineIcons>
            </View>
            {error.password && (
              <View style={[commonStyles.errorContainer, { top: 145 }]}>
                <Entypo name="cross" size={18} color="red"></Entypo>
                <Text style={{ color: "red" }}>{error.password}</Text>
              </View>
            )}

            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                marginHorizontal: 16,
                backgroundColor: "#2467EC",
                marginTop: 15,
              }}
              onPress={handleSignUp}
            >
              {buttonSpinner ? (
                <ActivityIndicator size="small" color={"white"} />
              ) : (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 16,
                    fontFamily: "Raleway_700Bold",
                  }}
                >
                  Sign up
                </Text>
              )}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
                gap: 10,
              }}
            >
              <TouchableOpacity>
                <FontAwesome name="google" size={30} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome name="github" size={30} />
              </TouchableOpacity>
            </View>

            <View style={styles.signupRedirect}>
              <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/routes/login")}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Raleway_600SemiBold",
                    color: "#2467EC",
                    marginLeft: 5,
                  }}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  signInImage: {
    width: "60%",
    height: 250,
    alignSelf: "center",
    marginTop: 50,
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
  },
  learningText: {
    textAlign: "center",
    color: "#575757",
    fontSize: 15,
    marginTop: 5,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    rowGap: 30,
  },
  input: {
    height: 55,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingLeft: 35,
    fontSize: 16,
    backgroundColor: "white",
    color: "#A1A1A1",
  },
  visibleIcon: {
    position: "absolute",
    right: 30,
    top: 15,
  },
  icon2: {
    position: "absolute",
    left: 23,
    top: 17.8,
    marginTop: -2,
  },
  forgotSection: {
    marginHorizontal: 16,
    textAlign: "right",
    fontSize: 16,
    marginTop: 10,
  },
  signupRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },
});
