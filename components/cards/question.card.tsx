import React from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function QuestionsCard({
  item,
  fetchCourseContent,
  courseData,
  contentId,
}: {
  item: CommentType;
  fetchCourseContent: () => void;
  courseData: CoursesType;
  contentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [showReplies, setshowReplies] = useState(false);

  const handleReplySubmit = (_id: string, reply: string): void => {
    alert("Reply submitted: " + reply);
    setOpen(false);
    setReply("");
  };

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={{
            uri:
              // review.user?.avatar?.url ||
              "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
          }}
        />
        <View style={{ marginHorizontal: 8, flex: 1 }}>
          <View style={{ flex: 1, justifyContent: "space-around" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                  {item.user?.fullName || "Anonymous"}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    paddingVertical: 5,
                    paddingHorizontal: 4,
                  }}
                >
                  {item.question || "No question provided."}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {item?.questionReplies?.length === 0 ? (
        <>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text
              style={{
                fontSize: 16,
                color: "#2467EC",
                paddingLeft: 15,
                paddingBottom: 10,
              }}
            >
              Add Reply
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <TouchableOpacity onPress={() => setshowReplies(!showReplies)}>
            <Text
              style={{
                fontSize: 16,
                color: "#2467EC",
                paddingLeft: 15,
                paddingBottom: 10,
              }}
            >
              {!showReplies ? "Show" : "Hide"} Replies
            </Text>
          </TouchableOpacity>
          {showReplies && (
            <>
              {item?.questionReplies?.map((reply: any, index: number) => (
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                  key={index}
                >
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 100 }}
                    source={{
                      uri:
                        // reply.user?.avatar?.url ||
                        "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
                    }}
                  />
                  <View style={{ marginHorizontal: 8, flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "space-around" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: 18,
                              fontFamily: "Raleway_700Bold",
                            }}
                          >
                            {reply.user.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              paddingVertical: 5,
                              paddingHorizontal: 3,
                            }}
                          >
                            {reply?.question}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              <TouchableOpacity onPress={() => setOpen(!open)}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#2467EC",
                    paddingLeft: 15,
                    paddingBottom: 10,
                  }}
                >
                  Add Reply
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      <Modal animationType="slide" transparent={true} visible={open}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 15,
            backgroundColor: "#ccc",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons
                name="close"
                size={24}
                color="#000"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Type your reply..."
            value={reply}
            onChangeText={setReply}
            style={{
              marginVertical: 10,
              textAlignVertical: "top",
              justifyContent: "flex-start",
              backgroundColor: "#f5f5f5",
              padding: 10,
              borderRadius: 10,
              height: 100,
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleReplySubmit(item._id, reply)}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  button: {
    width: widthPercentageToDP("35%"),
    height: 40,
    backgroundColor: "#2467EC",
    marginVertical: 10,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
