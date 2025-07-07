export const mockComments: CommentType[] = [
  {
    _id: "cmt001",
    user: {
      _id: "user001",
      name: "John Doe",
      email: "john@example.com",
      avatar: {
        public_id: "avatar001",
        url: "https://example.com/avatars/john.jpg",
      },
      password: undefined,
      courses: [],
      createdAt: new Date("2024-01-01T10:00:00Z"),
      updatedAt: new Date("2024-06-01T09:00:00Z"),
    },
    question: "What is the best way to handle state in React Native?",
    questionReplies: [
      {
        _id: "cmt001_reply1",
        user: {
          _id: "user002",
          name: "Jane Smith",
          email: "jane@example.com",
          avatar: {
            public_id: "avatar002",
            url: "https://example.com/avatars/jane.jpg",
          },
          password: undefined,
          courses: [],
          createdAt: new Date("2024-01-15T11:30:00Z"),
          updatedAt: new Date("2024-06-01T09:15:00Z"),
        },
        question:
          "You can use Zustand or Redux Toolkit depending on the app size.",
        questionReplies: [],
      },
    ],
  },
  {
    _id: "cmt002",
    user: {
      _id: "user003",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: {
        public_id: "avatar003",
        url: "https://example.com/avatars/alice.jpg",
      },
      password: undefined,
      courses: [],
      createdAt: new Date("2024-02-01T12:00:00Z"),
      updatedAt: new Date("2024-06-10T08:00:00Z"),
    },
    question: "Can I run this course project on Expo Go?",
    questionReplies: [],
  },
  {
    _id: "cmt003",
    user: {
      _id: "user004",
      name: "Bob Lee",
      email: "bob@example.com",
      avatar: {
        public_id: "avatar004",
        url: "https://example.com/avatars/bob.jpg",
      },
      password: undefined,
      courses: [],
      createdAt: new Date("2024-03-10T10:45:00Z"),
      updatedAt: new Date("2024-06-20T09:45:00Z"),
    },
    question: "Why is my video not loading on Android emulator?",
    questionReplies: [
      {
        _id: "cmt003_reply1",
        user: {
          _id: "user001",
          name: "John Doe",
          email: "john@example.com",
          avatar: {
            public_id: "avatar001",
            url: "https://example.com/avatars/john.jpg",
          },
          password: undefined,
          courses: [],
          createdAt: new Date("2024-01-01T10:00:00Z"),
          updatedAt: new Date("2024-06-01T09:00:00Z"),
        },
        question: "Try changing the video URL to an HTTPS link.",
        questionReplies: [],
      },
      {
        _id: "cmt003_reply2",
        user: {
          _id: "user003",
          name: "Alice Johnson",
          email: "alice@example.com",
          avatar: {
            public_id: "avatar003",
            url: "https://example.com/avatars/alice.jpg",
          },
          password: undefined,
          courses: [],
          createdAt: new Date("2024-02-01T12:00:00Z"),
          updatedAt: new Date("2024-06-10T08:00:00Z"),
        },
        question: "Also check your internet connection in emulator settings.",
        questionReplies: [],
      },
    ],
  },
];
