type Quiz = {
  id: number;
  title: string;
  description: string;
  lesson: Lesson;
  course: Course;
  long_time: number; // có thể là tổng thời gian định danh (VD: 10 phút)
  timeInSeconds: number; // thời gian làm bài còn lại (ví dụ: 600s)
};

interface responseQuizChoiceDto {
  id: number;
  text: string;
}

type responseQuizQuestionDto = {
  id: number;
  text: string;
  order: number;
  courseId?: number;
  choices?: responseQuizChoiceDto[];
};
