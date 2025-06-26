import { View, Text, StyleSheet } from "react-native";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { onboardingSwiperData } from "@/constants/constants";
import AppIntroSlider from "react-native-app-intro-slider";
import { push } from "expo-router/build/global-state/routing";
import { router } from "expo-router";
import { commonStyles } from "@/styles/common/common.styles";
import styles from "@/styles/onboarding/onboarding.onboarding";
import { Image } from "react-native";
export default function WelcomeIntroScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Raleway_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  const renderItem = ({ item }: { item: onboardingSwiperDataType }) => (
    <LinearGradient
      colors={["#ffffff", "#ffffff", "#ffffff"]}
      style={{ flex: 1, paddingHorizontal: 16 }}
    >
      <View style={{ marginTop: 80 }}>
        <Image source={item.image} style={stylesWelcome.slideImage}></Image>
        <Text style={[commonStyles.title, { fontFamily: "Railway_700Bold" }]}>
          {item.title}
        </Text>
        <View style={{ marginTop: 15 }}>
          <Text
            style={[
              commonStyles.description,
              { fontFamily: "Nunito_400Regular" },
            ]}
          >
            {item.description}
          </Text>
          <Text
            style={[
              commonStyles.description,
              { fontFamily: "Nunito_400Regular" },
            ]}
          >
            {item.sortDescrition}
          </Text>
          <Text
            style={[
              commonStyles.description,
              { fontFamily: "Nunito_400Regular" },
            ]}
          >
            {item.sortDescrition2}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={onboardingSwiperData}
      onDone={() => {
        router.push("/routes/login");
      }}
      onSkip={() => {
        router.push("/routes/login");
      }}
      renderNextButton={() => (
        <View style={[styles.welcomeButtonStyle]}>
          <Text
            style={[styles.buttonText, { fontFamily: "Nunito_600SemiBold" }]}
          >
            Next
          </Text>
        </View>
      )}
      renderDoneButton={() => (
        <View style={styles.welcomeButtonStyle}>
          <Text
            style={[styles.buttonText, { fontFamily: "Nunito_600SemiBold" }]}
          >
            Done
          </Text>
        </View>
      )}
      showSkipButton={false}
      dotStyle={commonStyles.dotStyle}
      bottomButton={true}
      activeDotStyle={commonStyles.activeDotStyle}
    />
  );
}

const stylesWelcome = StyleSheet.create({
  slideImage: {
    alignSelf: "center",
    marginBottom: 30,
  },
});
