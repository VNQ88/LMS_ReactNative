import Loader from "@/components/loader";
import useUser from "@/hooks/auth/useUser";
import { Redirect } from "expo-router";
import { useState } from "react";

export default function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(true);
  // return (
  //   <Redirect href={!isLoggedIn ? "/routes/onboarding" : "/(tabs)"}></Redirect>
  // );

  const { loading, isLoggedIn } = useUser();
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Redirect href={!isLoggedIn ? "/routes/onboarding" : "/(tabs)"} />
      )}
    </>
  );
}
