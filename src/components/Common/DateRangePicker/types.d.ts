import { DateRange } from "@Components/App/types";

export interface DateRangePickerProps {
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  openBtnText?: string;
  todayBtnText?: string;
  confirmBtnText?: string;
}

export interface MonthYear {
  month: number;
  year: number;
}

export interface Day {
  id: string;
  label: string;
  value: string;
}
