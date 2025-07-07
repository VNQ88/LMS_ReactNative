export const mockReviews: ReviewType[] = [
  {
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
    rating: 5,
    comment: "Excellent course, I learned a lot!",
    commentReplies: [
      {
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
          createdAt: new Date("2024-02-01T12:00:00Z"),
          updatedAt: new Date("2024-06-10T08:00:00Z"),
        },
        rating: 4,
        comment: "I agree, especially the final project!",
      },
    ],
  },
  {
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
      createdAt: new Date("2024-03-01T14:00:00Z"),
      updatedAt: new Date("2024-06-20T09:30:00Z"),
    },
    rating: 4.5,
    comment: "Very practical content. Could use more quizzes.",
  },
  {
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
      createdAt: new Date("2024-04-01T16:00:00Z"),
      updatedAt: new Date("2024-06-25T11:15:00Z"),
    },
    rating: 3.5,
    comment: "Good introduction, but some videos are outdated.",
    commentReplies: [],
  },
];
