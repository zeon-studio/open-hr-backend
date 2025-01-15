export type Event = {
  name: string;
  start_date: Date;
  end_date: Date;
  day_count: number;
  reason: string;
};

export type CalendarType = {
  year: number;
  holidays: Event[];
  events: Event[];
};
