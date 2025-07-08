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
import {
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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";
import { SERVER_URI } from "@/utils/uri";

// import axios from "axios";
// import { SERVER_URI } from "@/utils/uri";
// import { Toast } from "react-native-toast-notifications";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [required, setRequired] = useState("");
  const [error, setError] = useState({
    password: "",
  });
  function handlePasswordValidation(text: string): void {
    const password = text;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;
    setError({ ...error, password: "" });
    setUserInfo({ ...userInfo, password: text });
  }
  const params = new URLSearchParams();
  params.append("email", userInfo.email);
  params.append("password", userInfo.password);

  const handleSignIn = async () => {
    await axios
      .post(`${SERVER_URI}/auth/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(async (res) => {
        console.log("RESPONSE DATA:", res.data);
        const { access_token, refresh_token } = res.data;

        if (!access_token || !refresh_token) {
          throw new Error("Token not received from server.");
        }
        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("refresh_token", refresh_token);
        router.push("/(tabs)");
      })
      .catch((error) => {
        console.log(error);
        Toast.show("Email or password is not correct!", {
          type: "danger",
        });
      });
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
        <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
          Welcome back
        </Text>
        <Text
          style={[styles.learningText, { fontFamily: "Raleway_400Regular" }]}
        >
          Login to your existing account of KMA LMS
        </Text>
        <View style={styles.inputContainer}>
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
                style={[styles.input, { paddingLeft: 40 }]}
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

            // onPress={() => {
            //   router.push("/routes/forgot-password");
            // }}
            >
              <Text
                style={[
                  styles.forgotSection,
                  { fontFamily: "Nunito_600SemiBold" },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                marginHorizontal: 16,
                backgroundColor: "#2467EC",
                marginTop: 15,
              }}
              onPress={handleSignIn}
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
                  Sign in
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
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/routes/sign-up")}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Raleway_600SemiBold",
                    color: "#2467EC",
                    marginLeft: 5,
                  }}
                >
                  Sign up
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
    marginLeft: 5,
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
