import useUser from "@/hooks/auth/useUser";
import { Redirect } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";
import Loader from "@/components/loader";
export default function App() {
  const [isLoggedIn, setIsLoggedInsetIsLoggedIn] = useState(true);

  return (
    <Redirect href={!isLoggedIn ? "/routes/onboarding" : "/(tabs)"}></Redirect>
  );

  // const { loading, user } = useUser();
  // return (
  //   <>
  //     {loading ? (
  //      <Loader />
  //     ) : (
  //       <Redirect href={!user ? "/(routes)/onboarding" : "/(tabs)"} />
  //     )}
  //   </>
  // );
}
