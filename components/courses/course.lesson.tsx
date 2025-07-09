import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { router } from "expo-router";

export default function CourseLesson({
  courseDetails,
  isPurchased,
}: {
  courseDetails: Course;
  isPurchased: boolean;
}) {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>()
  );
  const [lessonData, setLessonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get(`${SERVER_URI}/lesson/course`, {
          params: {
            courseId: courseDetails.id,
          },
        });
        setLessonData(res.data.data); // hoặc `res.data` tuỳ theo backend trả về
      } catch (error) {
        console.error("❌ Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []); // ⬅️ chạy 1 lần duy nhất khi component mount
  if (loading) return <Text>Loading...</Text>;
  const videoSections: string[] = [
    ...new Set<string>(lessonData.map((item: Lesson) => item.video)),
  ];

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }
    setVisibleSections(newVisibleSections);
  };

  return (
    <View style={{ flex: 1, rowGap: 10, marginBottom: 10 }}>
      <View
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: "#E1E2E5",
          borderRadius: 8,
        }}
      >
        <View>
          {videoSections.map((item: string, index: number) => {
            const isSectionVisible = visibleSections.has(item);

            // Filter videos by section
            const sectionVideos: any[] = lessonData?.filter(
              (i: any) => i.video === item
            );

            return (
              <Fragment key={index}>
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    borderBottomColor: "#DCDCDC",
                    borderBottomWidth:
                      index === videoSections.length - 1 ? 0 : 1,
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}
                  >
                    Video
                    {/* {item} */}
                  </Text>
                  {isSectionVisible ? (
                    <TouchableOpacity onPress={() => toggleSection(item)}>
                      <Entypo name="chevron-up" size={23} color={"#6707FE"} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => toggleSection(item)}>
                      <Entypo name="chevron-down" size={23} color={"#6707FE"} />
                    </TouchableOpacity>
                  )}
                </View>
                {isSectionVisible && (
                  <>
                    {sectionVideos.map((item: Lesson) => (
                      <TouchableOpacity
                        disabled={!isPurchased}
                        // onPress={() => {
                        //   // Handle video click
                        //   router.push({
                        //     pathname: "/routes/course-access",
                        //     params: {
                        //       courseData: JSON.stringify(courseDetails),
                        //       lesId: item.id.toString(),
                        //     },
                        //   });
                        // }}
                        key={item.id}
                        style={{
                          borderWidth: 1,
                          borderColor: "#E1E2E5",
                          borderRadius: 8,
                          gap: 10,
                        }}
                      >
                        <View style={styles.itemContainer}>
                          <View style={styles.itemContainerWrapper}>
                            <View style={styles.itemTitleWrapper}>
                              <Feather
                                name="video"
                                size={20}
                                color={"#8a8a8a"}
                              />
                              <Text
                                style={[
                                  styles.itemTitleText,
                                  { fontFamily: "Nunito_500Medium" },
                                ]}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                              >
                                {item.title}
                              </Text>
                            </View>
                            <View style={styles.itemDataContainer}>
                              <Text
                                style={{
                                  marginRight: 6,
                                  color: "#818181",
                                  fontFamily: "Nunito_400Regular",
                                }}
                              >
                                {" "}
                                {Math.floor(Math.random() * (55 - 20)) + 20} min
                                {/* {item?.videoLength > 60
                                    ? Math.floor(item.videoLength / 60) + " min"
                                    : item?.videoLength + " sec"} */}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E1E2E5",
    marginHorizontal: 10,
    paddingVertical: 12,
    marginVertical: 4,
  },
  itemContainerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitleText: {
    width: "75%",
    marginLeft: 8,
    color: "#525258",
    fontSize: 16,
  },
  itemDataContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
