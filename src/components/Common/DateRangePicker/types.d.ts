import { DateRange } from "@Components/App/types";

export interface DateRangePickerProps {
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
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
