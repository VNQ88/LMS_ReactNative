type onboardingSwiperDataType = {
  id: number;
  title: string;
  description: string;
  sortDescrition: string;
  sortDescrition2?: string;
  image: any;
};
type BannerDataTypes = {
  bannerImageUrl: any;
};

type Role = "Student" | "Teacher" | "Admin"; // Enum tương ứng nếu bạn có trong backend

type User = {
  id: number;
  fullName: string;
  email: string;
  avatar: string;
  role: Role;
  created_at?: string; // thường backend trả ISO string
  updated_at?: string;
};
