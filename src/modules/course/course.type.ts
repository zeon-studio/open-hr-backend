export type Course = {
  _id: string;
  name: string;
  price: number;
  currency: string;
  users: string[];
  purchase_date: Date;
  expire_date: Date;
};

export type CourseType = {
  platform: string;
  website: string;
  email: string;
  password: string;
  courses: Course[];
};

export type CourseFilterOptions = {
  search?: string;
  platform?: string;
};
