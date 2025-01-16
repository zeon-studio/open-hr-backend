import { add, format } from "date-fns";

export const formatDate = (
  date: string | number | Date,
  pattern: string = "EEEE, dd MMMM, yyyy"
) => {
  if (!date) return;
  const dateObj = new Date(date);
  const output = format(dateObj, pattern);
  return output;
};

export const localDate = (date: Date) => {
  const removeTime = new Date(date).toISOString().split("T")[0];
  const utcDate = new Date(removeTime);
  const dhakaTime = add(utcDate, { hours: 6 });
  console.log("dhakaTime", dhakaTime);
  return dhakaTime;
};
