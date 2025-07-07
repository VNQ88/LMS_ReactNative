import { mockComments } from "./mockQuestionData";

export const mockCourseData: CourseDataType[] = [
  {
    _id: "cd001",
    title: "Introduction to React Native",
    description: "Overview of React Native and its core concepts.",
    videoUrl: "https://www.youtube.com/embed/bbmQPLpDbsA",
    videoThumbnail: {
      public_id: "vid_thumb_001",
      url: "https://example.com/thumbnails/intro.jpg",
    },
    videoSection: "Getting Started",
    videoLength: 600,
    videoPlayer: "vimeo",
    links: [{ title: "React Native Docs", url: "https://reactnative.dev" }],
    suggestion: "Install Expo CLI and set up your environment.",
    questions: mockComments,
  },
  {
    _id: "cd002",
    title: "Components and Styling",
    description: "Learn how to create reusable components and apply styles.",
    videoUrl: "https://example.com/videos/components.mp4",
    videoThumbnail: {
      public_id: "vid_thumb_002",
      url: "https://example.com/thumbnails/components.jpg",
    },
    videoSection: "UI Development",
    videoLength: 840,
    videoPlayer: "youtube",
    links: [
      {
        title: "StyleSheet API",
        url: "https://reactnative.dev/docs/stylesheet",
      },
      {
        title: "Component Basics",
        url: "https://reactnative.dev/docs/components-and-apis",
      },
    ],
    suggestion: "Try creating a Button component with custom styles.",
    questions: [],
  },
  {
    _id: "cd003",
    title: "Navigation in React Native",
    description: "Implement stack and tab navigation using React Navigation.",
    videoUrl: "https://example.com/videos/navigation.mp4",
    videoThumbnail: {
      public_id: "vid_thumb_003",
      url: "https://example.com/thumbnails/navigation.jpg",
    },
    videoSection: "Navigation",
    videoLength: 720,
    videoPlayer: "youtube",
    links: [{ title: "React Navigation", url: "https://reactnavigation.org" }],
    suggestion: "Practice with stack navigator before moving to tabs.",
    questions: [],
  },
];
