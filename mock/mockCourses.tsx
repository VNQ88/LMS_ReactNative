export const mockCourses: CoursesType[] = [
  {
    _id: "course_001",
    name: "Mastering React Native",
    description: "A complete guide to building mobile apps using React Native.",
    categories: "Mobile Development",
    price: 149.99,
    estimatedPrice: 199.99,
    thumbnail: {
      public_id: "thumb001",
      url: "https://www.excelptp.com/wp-content/uploads/2021/05/react-native-banner-img.jpg",
    },
    tags: "react native, mobile, cross-platform",
    level: "Intermediate",
    demoUrl: "https://example.com/demo/react-native",
    benefits: [
      { title: "Build cross-platform apps" },
      { title: "Hands-on project experience" },
    ],
    prerequisites: [
      { title: "Basic knowledge of JavaScript" },
      { title: "Familiarity with React" },
    ],
    reviews: [],
    courseData: [],
    ratings: 4.8,
    purchased: 134,
  },
  {
    _id: "course_002",
    name: "Python for Data Science",
    description:
      "Learn Python from scratch and use it for data science and analysis.",
    categories: "Data Science",
    price: 89.99,
    estimatedPrice: 129.99,
    thumbnail: {
      public_id: "thumb002",
      url: "https://www.classcentral.com/report/wp-content/uploads/2023/09/bcg_python_banner.png",
    },
    tags: "python, data science, pandas, numpy",
    level: "Beginner",
    demoUrl: "https://example.com/demo/python",
    benefits: [
      { title: "Analyze real datasets" },
      { title: "Foundations for machine learning" },
    ],
    prerequisites: [{ title: "Basic math knowledge" }],
    reviews: [
      {
        user: {
          _id: "user002",
          name: "Jane Smith",
          email: "jane@example.com",
          avatar: {
            public_id: "avatar002",
            url: "https://example.com/avatar2.jpg",
          },
          password: undefined,
          courses: [],
          createdAt: new Date("2024-02-15T11:00:00Z"),
          updatedAt: new Date("2024-05-25T09:45:00Z"),
        },
        rating: 5,
        comment: "Great explanation and pacing.",
        commentReplies: [],
      },
    ],
    courseData: [],
    ratings: 5.0,
    purchased: 340,
  },
  {
    _id: "course_003",
    name: "DevOps Essentials with Docker & Kubernetes",
    description:
      "Get started with modern DevOps tools like Docker and Kubernetes.",
    categories: "DevOps",
    price: 119.99,
    estimatedPrice: 159.99,
    thumbnail: {
      public_id: "thumb003",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS46iDesi8tZRYn3yo_q5RNIq7NwUFnBX3C2Q&s",
    },
    tags: "docker, kubernetes, devops, ci/cd",
    level: "Advanced",
    demoUrl: "https://example.com/demo/devops",
    benefits: [
      { title: "Deploy scalable apps" },
      { title: "Understand container orchestration" },
    ],
    prerequisites: [
      { title: "Linux basics" },
      { title: "Familiarity with command line" },
    ],
    reviews: [
      {
        user: {
          _id: "user003",
          name: "Alice Johnson",
          email: "alice@example.com",
          avatar: {
            public_id: "avatar003",
            url: "https://example.com/avatar3.jpg",
          },
          password: undefined,
          courses: [],
          createdAt: new Date("2024-03-12T13:00:00Z"),
          updatedAt: new Date("2024-06-15T10:15:00Z"),
        },
        rating: 4.5,
        comment: "Good overview of concepts.",
        commentReplies: [
          {
            user: {
              _id: "user004",
              name: "Tom Lee",
              email: "tom@example.com",
              avatar: {
                public_id: "avatar004",
                url: "https://example.com/avatar4.jpg",
              },
              password: undefined,
              courses: [],
              createdAt: new Date("2024-04-18T14:00:00Z"),
              updatedAt: new Date("2024-06-20T15:45:00Z"),
            },
            rating: 4,
            comment: "I agree, great intro to Kubernetes!",
          },
        ],
      },
    ],
    courseData: [],
    ratings: 4.6,
    purchased: 278,
  },
];
