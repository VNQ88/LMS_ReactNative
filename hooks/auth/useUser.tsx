import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useUser() {
  const [loading, setLoading] = useState(true);
  // const [user, setUser] = useState<User>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    const subscription = async () => {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      await axios
        .get(`${SERVER_URI}/me`, {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        })
        .then((res: any) => {
          // setUser(res.data.user);
          setLoading(false);
          setIsLoggedIn(true);
        })
        .catch((error: any) => {
          setError(error?.message);
          setLoading(false);
        });
    };
    subscription();
  }, [refetch]);

  return { loading, isLoggedIn, error, setRefetch, refetch };
}
