import React, { memo, useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import Color from "color";
import { cloneDeep, merge } from "lodash";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Box from "@mui/material/Box";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { Theme } from "@mui/material/styles";

import { I18n } from "./../../tools";

export interface DateRange {
  start: string;
  end: string;
}

interface DateRangePickerProps {
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  theme: Theme;
  locale?: "en" | "zh";
  openBtnText?: string;
  todayBtnText?: string;
  confirmBtnText?: string;
}

interface MonthYear {
  month: number;
  year: number;
}

interface Day {
  id: string;
  label: string;
  value: string;
}

interface Weekday {
  id: string;
  label:
    | "week.sunday"
    | "week.monday"
    | "week.tuesday"
    | "week.wednesday"
    | "week.thursday"
    | "week.friday"
    | "week.saturday";
  value: string;
}

const colorLighten = (base: string, lighten: number) => {
  return Color(base).lighten(lighten).hex();
};
const sortedArr = (arr: string[]) => {
  const date1 = dayjs(arr[0]).valueOf();
  const date2 = dayjs(arr[1]).valueOf();
  const start = date1 - date2 > 0 ? arr[1] : arr[0];
  const end = date1 - date2 > 0 ? arr[0] : arr[1];
  return [start, end];
};
const formatCalendarBody = (year: number, month: number) => {
  // 該月的1號是星期幾
  const monthStartDay = dayjs(`${year}-${month + 1}-1`).get("day");
  const dayInMonth = dayjs(`${year}-${month + 1}-1`).daysInMonth();

  const placeHolder = Array.from({ length: monthStartDay }, (_, i) => ({
    id: "placeHolder-" + i,
    label: "",
    value: "",
  }));
  const displayMonth = Array.from({ length: dayInMonth }, (_, i) => ({
    id: i.toString(),
    label: (i + 1).toString(),
    value: dayjs(`${year}-${month + 1}-${i + 1}`).format("YYYY-MM-DD"),
  }));
  return [...placeHolder, ...displayMonth];
};

const DIALOG_DEFAULT_STATE = false;
const MONTH_LIST = Array.from({ length: 12 }, (_, i) => i);
const YEAR_LIST = Array.from(
  { length: 5 },
  (_, i) => i + dayjs().get("year") - 2
);
const WEEK_LIST: Weekday[] = [
  { id: "0", label: "week.sunday", value: "0" },
  { id: "1", label: "week.monday", value: "1" },
  { id: "2", label: "week.tuesday", value: "2" },
  { id: "3", label: "week.wednesday", value: "3" },
  { id: "4", label: "week.thursday", value: "4" },
  { id: "5", label: "week.friday", value: "5" },
  { id: "6", label: "week.saturday", value: "6" },
];
const CALENDER_BODY: Day[] = [{ id: "", label: "", value: "" }];
const MONTH_YEAR_TODAY: MonthYear = {
  year: dayjs().get("year"),
  month: dayjs().get("month"),
};
export const DATE_RANGE: DateRange = {
  start: "",
  end: "",
};

enum NAVIGATION {
  PREV = "PREV",
  NEXT = "NEXT",
}

function DateRangePicker(props: DateRangePickerProps) {
  /* States */
  const { setDateRange, theme, locale } = props;
  const { openBtnText, todayBtnText, confirmBtnText } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(DIALOG_DEFAULT_STATE);
  const [anchorDialog, setAnchorDialog] = useState<null | HTMLElement>(null);
  const [anchorMonth, setAnchorMonth] = useState<null | HTMLElement>(null);
  const [anchorYear, setAnchorYear] = useState<null | HTMLElement>(null);
  const [calendarBody, setCalendarBody] = useState<Day[]>(CALENDER_BODY);
  const [selectedMonthYear, setSelectedMonthYear] =
    useState<MonthYear>(MONTH_YEAR_TODAY);
  const [selectedDateArr, setSelectedDateArr] = useState<string[]>([]);
  const openMonth = Boolean(anchorMonth);
  const openYear = Boolean(anchorYear);
  const pointStyle = useMemo(
    () => ({
      background: "none",
      position: "relative",
      zIndex: "1",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "0",
        right: "0",
        width: "100%",
        height: "100%",
        background: colorLighten(theme.palette.primary.light, 0.15),
        clipPath: "circle(50%)",
        zIndex: "-1",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        top: "0",
        width: "50%",
        height: "100%",
        background: colorLighten(theme.palette.primary.light, 0.3),
        zIndex: "-2",
      },
    }),
    [theme.palette.primary]
  );
  const btnText = useMemo(
    () => ({
      open:
        openBtnText && openBtnText.length ? openBtnText : "Select Date Range",
      today: todayBtnText && todayBtnText.length ? todayBtnText : "Today",
      confirm:
        confirmBtnText && confirmBtnText.length ? confirmBtnText : "Confirm",
    }),
    [openBtnText, todayBtnText, confirmBtnText]
  );
  const i18n = useMemo(() => new I18n(locale), [locale]);

  /* Functions */
  const handleDatePickerClick =
    (toggle: boolean) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (toggle) {
        setAnchorDialog(event.currentTarget);
        setDialogOpen(true);
        return;
      }

      setDialogOpen(false);
      setAnchorDialog(null);
      // 輸出起始與終止日期
      if (selectedDateArr.length === 2) {
        const [start, end] = sortedArr(selectedDateArr);
        setDateRange({ start, end });
      }
      setSelectedDateArr([]);
    };
  const handleMonthOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorMonth(event.currentTarget);
  };
  const handleMonthSelect = (month: number) => () => {
    setSelectedMonthYear((prev) => ({ ...prev, month }));
    setAnchorMonth(null);
  };
  const handleYearOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorYear(event.currentTarget);
  };
  const handleYearSelect = (year: number) => () => {
    setSelectedMonthYear((prev) => ({ ...prev, year }));
    setAnchorYear(null);
  };
  const handleMonthChange = (navigation: NAVIGATION) => () => {
    const modification = navigation === NAVIGATION.PREV ? -1 : 1;
    const month = dayjs(
      `${selectedMonthYear.year}-${selectedMonthYear.month + 1}-1`
    )
      .add(modification, "month")
      .month();
    const year = dayjs(
      `${selectedMonthYear.year}-${selectedMonthYear.month + 1}-1`
    )
      .add(modification, "month")
      .year();
    setSelectedMonthYear({ year, month });
  };
  const handleDateSelect = (day: string) => () => {
    if (!day.length) return;
    switch (selectedDateArr.length) {
      case 0:
      case 2:
        setSelectedDateArr([day]);
        break;
      case 1:
        setSelectedDateArr([...selectedDateArr, day]);
        break;
      default:
        break;
    }
  };
  const handleDateBgColor = (dateValue: string) => {
    if (selectedDateArr.length === 2) {
      const [start, end] = sortedArr(selectedDateArr);
      if (
        dayjs(dateValue).valueOf() - dayjs(start).valueOf() > 0 &&
        dayjs(dateValue).valueOf() - dayjs(end).valueOf() < 0
      )
        return colorLighten(theme.palette.primary.light, 0.3);
    }
    return "";
  };
  const handleDateSx = (dateValue: string) => {
    // 單選外觀
    if (
      selectedDateArr.length < 2 &&
      selectedDateArr.find((d) => d === dateValue)
    ) {
      return {
        clipPath: "circle(50%)",
        background: colorLighten(theme.palette.primary.light, 0.15),
        position: "relative",
        zIndex: "1",
      } as const;
    }
    // 起終點外觀
    if (selectedDateArr.length === 2) {
      const [start, end] = sortedArr(selectedDateArr);
      if (dateValue === start && start === end) {
        return {
          ...merge(cloneDeep(pointStyle), { "&::after": { all: "unset" } }),
        } as const;
      }
      if (dateValue === start) {
        return {
          ...merge(cloneDeep(pointStyle), { "&::after": { right: "0" } }),
        } as const;
      }
      if (dateValue === end) {
        return {
          ...merge(cloneDeep(pointStyle), { "&::after": { left: "0" } }),
        } as const;
      }
    }
  };
  const handleTodaySx = (dateValue: string) => {
    if (dateValue === dayjs().format("YYYY-MM-DD")) {
      return {
        "::before": {
          content: '""',
          position: "absolute",
          top: "0",
          right: "0",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          borderRadius: "50%",
          border: `1px solid ${theme.palette.primary.main}`,
        },
      } as const;
    }
  };
  const handleStyleUnset = (dateValue: string) => {
    if (dateValue.length) return;
    return {
      "&:hover": {
        background: "unset",
      } as const,
    };
  };
  const handleToToday = () => {
    setSelectedMonthYear(MONTH_YEAR_TODAY);
  };

  /* Hooks */
  // 開啟月曆框時，產生月曆內容
  useEffect(() => {
    if (!dialogOpen) {
      setSelectedMonthYear(MONTH_YEAR_TODAY);
      return;
    }
    const calendarBody = formatCalendarBody(
      MONTH_YEAR_TODAY.year,
      MONTH_YEAR_TODAY.month
    );
    setCalendarBody(calendarBody);
  }, [dialogOpen]);
  // 點選箭頭換月時，更新月曆內容
  useEffect(() => {
    const calendarBody = formatCalendarBody(
      selectedMonthYear.year,
      selectedMonthYear.month
    );
    setCalendarBody(calendarBody);
  }, [selectedMonthYear]);

  /* Main */
  return (
    <React.Fragment>
      <Button
        variant="contained"
        disableElevation
        onClick={handleDatePickerClick(true)}
      >
        {btnText.open}
      </Button>
      <Menu
        open={dialogOpen}
        anchorEl={anchorDialog}
        onClose={handleDatePickerClick(false)}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            aria-label="previous month"
            size="small"
            onClick={handleMonthChange(NAVIGATION.PREV)}
            sx={{
              width: "36px",
              height: "36px",
              color: theme.palette.primary.dark,
            }}
          >
            <ArrowBackIosNewIcon fontSize="inherit" />
          </IconButton>
          <div>
            <Button onClick={handleMonthOpen}>
              {dayjs(
                `${selectedMonthYear.year}-${selectedMonthYear.month + 1}-1`
              ).format(i18n.t("format.month"))}
            </Button>
            <Menu
              open={openMonth}
              anchorEl={anchorMonth}
              onClose={() => setAnchorMonth(null)}
            >
              {MONTH_LIST.map((m) => (
                <MenuItem key={m} onClick={handleMonthSelect(m)}>
                  {dayjs(`${selectedMonthYear.year}-${m + 1}-1`).format(i18n.t("format.month"))}
                </MenuItem>
              ))}
            </Menu>
            <Button onClick={handleYearOpen}>
              {dayjs(
                `${selectedMonthYear.year}-${selectedMonthYear.month + 1}-1`
              ).format(i18n.t("format.year"))}
            </Button>
            <Menu
              open={openYear}
              anchorEl={anchorYear}
              onClose={() => setAnchorYear(null)}
            >
              {YEAR_LIST.map((y) => (
                <MenuItem key={y} onClick={handleYearSelect(y)}>
                  {y}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <IconButton
            aria-label="next month"
            size="small"
            onClick={handleMonthChange(NAVIGATION.NEXT)}
            sx={{
              width: "36px",
              height: "36px",
              color: theme.palette.primary.dark,
            }}
          >
            <ArrowForwardIosIcon fontSize="inherit" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={2}>
            {WEEK_LIST.map((w) => (
              <Box gridColumn="span 1" key={w.id}>
                <div>{i18n.t(w.label)}</div>
              </Box>
            ))}
          </Box>
          <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gridTemplateRows="repeat(5, 1fr)"
            marginY={3}
          >
            {calendarBody.map((m) => (
              <Box gridColumn="span 1" key={m.id}>
                <Button
                  onClick={handleDateSelect(m.value)}
                  sx={{
                    minWidth: "36px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "0",
                    color: theme.palette.primary.dark,
                    background: handleDateBgColor(m.value),
                    ...handleDateSx(m.value),
                    ...handleStyleUnset(m.value),
                    ...handleTodaySx(m.value),
                  }}
                  disableElevation
                >
                  {m.label}
                </Button>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleToToday}>
            {btnText.today}
          </Button>
          <Button
            onClick={handleDatePickerClick(false)}
            variant="contained"
            disableElevation
          >
            {btnText.confirm}
          </Button>
        </DialogActions>
      </Menu>
    </React.Fragment>
  );
}

export default memo(DateRangePicker);
