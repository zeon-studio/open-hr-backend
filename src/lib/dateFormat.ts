import { add, format, parseISO } from "date-fns";

export const dateFormat = (
  date: string | number | Date,
  pattern = "EEEE, dd MMMM, yyyy"
) => {
  if (!date || typeof date !== "string") return;
  const dateObj = new Date(date);
  const output = format(dateObj, pattern);
  return output;
};

export const dateConvert = (date: any) => {
  const utcDate = parseISO(date);
  const dhakaTime = add(utcDate, { hours: 6 });
  const formattedDate = format(dhakaTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
  return formattedDate;
};
