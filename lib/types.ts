export interface User {
  id: string;
  name: string;
  created_at: string;
}

export interface StudyWeek {
  id: string;
  user_id: string;
  week_start: string;
  streak: number;
  created_at: string;
}

export interface StudyDay {
  id: string;
  week_id: string;
  day_name: string;
  focus: string;
  completed: boolean;
  total_minutes: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  study_day_id: string;
  title: string;
  minutes: number;
  completed: boolean;
}

export interface WeekData {
  week: StudyWeek;
  days: StudyDay[];
  totalMinutes: number;
  completedMinutes: number;
  weekProgress: number;
}
