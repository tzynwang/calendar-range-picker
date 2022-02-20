import React, { memo, useState, useEffect } from "react";
import dayjs from "dayjs";

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

import { DateRangePickerProps, MonthYear, Day } from "./types";
import './style.css'

const DIALOG_DEFAULT_STATE = false;
const MONTH_LIST = Array.from({ length: 12 }, (_, i) => i);
const YEAR_LIST = Array.from({ length: 10 }, (_, i) => i + 2017);
const WEEK_LIST: Day[] = [
  { id: "0", label: "日", value: "0" },
  { id: "1", label: "一", value: "1" },
  { id: "2", label: "二", value: "2" },
  { id: "3", label: "三", value: "3" },
  { id: "4", label: "四", value: "4" },
  { id: "5", label: "五", value: "5" },
  { id: "6", label: "六", value: "6" },
];
const CALENDER_BODY: Day[] = [{ id: "", label: "", value: "" }];
const MONTH_YEAR_TODAY: MonthYear = {
  year: dayjs().get("year"),
  month: dayjs().get("month"),
};

enum NAVIGATION {
  PREV = "PREV",
  NEXT = "NEXT",
}

function DateRangePicker(props: DateRangePickerProps) {
  /* States */
  const { setDateRange } = props;
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

  /* Functions */
  const handleDatePickerClick =
    (toggle: boolean) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (toggle) {
        setAnchorDialog(event.currentTarget);
        setDialogOpen(true);
        return;
      }

      if (!toggle && selectedDateArr.length !== 2) return;

      setDialogOpen(false);
      setAnchorDialog(null);
      // 輸出起始與終止日期
      const date1 = dayjs(selectedDateArr[0]).valueOf();
      const date2 = dayjs(selectedDateArr[1]).valueOf();
      const start = date1 - date2 > 0 ? selectedDateArr[1] : selectedDateArr[0];
      const end = date1 - date2 > 0 ? selectedDateArr[0] : selectedDateArr[1];
      setDateRange({ start, end });
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
    const modification = navigation === NAVIGATION.PREV ? -1 : 1
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
  const handleBtnBackGroundColor = (dateValue: string) => {
    // if (selectedDateArr.find((d) => d === dateValue)) return blue[200];
    if (selectedDateArr.length === 2) {
      const date1 = dayjs(selectedDateArr[0]).valueOf();
      const date2 = dayjs(selectedDateArr[1]).valueOf();
      const early = date1 - date2 > 0 ? date2 : date1;
      const late = date1 - date2 > 0 ? date1 : date2;
      if (
        dayjs(dateValue).valueOf() - early > 0 &&
        dayjs(dateValue).valueOf() - late < 0
      )
        return "lightpink";
    }
    return "";
  };
  const handleDateBackground = (dateValue: string) => {
    // 可用 clip-path 解決鋸齒問題，參考 https://codepen.io/Charlie7779/pen/abVYyPv
    // TODO: 如何引用 mui theme 顏色到 css 樣式中？
    // https://stackoverflow.com/questions/69449055/in-mui-how-do-i-use-theme-values-in-my-css
    if (selectedDateArr.length < 2 && selectedDateArr.find((d) => d === dateValue)) return "selected";
    if (selectedDateArr.length === 2) {
      const date1 = dayjs(selectedDateArr[0]).valueOf();
      const date2 = dayjs(selectedDateArr[1]).valueOf();
      const early = date1 - date2 > 0 ? selectedDateArr[1] : selectedDateArr[0];
      const late = date1 - date2 > 0 ? selectedDateArr[0] : selectedDateArr[1];
      if (dateValue === early) return 'selected-start';
      if (dateValue === late) return 'selected-end';
    }
  }
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
    const todayYear = MONTH_YEAR_TODAY.year;
    const todayMonth = MONTH_YEAR_TODAY.month; // start with 0
    const todayMonthStartDay = dayjs(`${todayYear}-${todayMonth + 1}-1`).get(
      "day"
    ); // 星期幾
    const dayInMonth = dayjs().daysInMonth(); // 有幾天

    const placeHolder = Array.from({ length: todayMonthStartDay }, (_, i) => ({
      id: "placeHolder-" + i,
      label: "",
      value: "",
    }));
    const displayMonth = Array.from({ length: dayInMonth }, (_, i) => ({
      id: i.toString(),
      label: (i + 1).toString(),
      value: dayjs(`${todayYear}-${todayMonth + 1}-${i + 1}`).format(
        "YYYY-MM-DD"
      ),
    }));
    setCalendarBody([...placeHolder, ...displayMonth]);
  }, [dialogOpen]);
  // 點選箭頭換月時，更新月曆內容
  useEffect(() => {
    const todayYear = selectedMonthYear.year;
    const todayMonth = selectedMonthYear.month; // start with 0
    const todayMonthStartDay = dayjs(`${todayYear}-${todayMonth + 1}-1`).get(
      "day"
    ); // 星期幾
    const dayInMonth = dayjs(`${todayYear}-${todayMonth + 1}-1`).daysInMonth(); // 有幾天

    const placeHolder = Array.from({ length: todayMonthStartDay }, (_, i) => ({
      id: "placeHolder-" + i,
      label: "",
      value: "",
    }));
    const displayMonth = Array.from({ length: dayInMonth }, (_, i) => ({
      id: i.toString(),
      label: (i + 1).toString(),
      value: dayjs(`${todayYear}-${todayMonth + 1}-${i + 1}`).format(
        "YYYY-MM-DD"
      ),
    }));
    setCalendarBody([...placeHolder, ...displayMonth]);
  }, [selectedMonthYear]);

  /* Main */
  return (
    <React.Fragment>
      <Button
        variant="contained"
        disableElevation
        onClick={handleDatePickerClick(true)}
      >
        Select Date Range
      </Button>
      <Menu open={dialogOpen} anchorEl={anchorDialog}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            aria-label="previous month"
            size="small"
            onClick={handleMonthChange(NAVIGATION.PREV)}
            sx={{ width: "36px", height: "36px" }}
          >
            <ArrowBackIosNewIcon fontSize="inherit" />
          </IconButton>
          <div>
            <Button onClick={handleMonthOpen}>
              {dayjs(
                `${selectedMonthYear.year}-${selectedMonthYear.month + 1}-1`
              ).format("M月")}
            </Button>
            <Menu
              open={openMonth}
              anchorEl={anchorMonth}
              onClose={() => setAnchorMonth(null)}
            >
              {MONTH_LIST.map((m) => (
                <MenuItem key={m} onClick={handleMonthSelect(m)}>
                  {dayjs(`${selectedMonthYear.year}-${m + 1}-1`).format("M月")}
                </MenuItem>
              ))}
            </Menu>
            <Button onClick={handleYearOpen}>
              {dayjs(
                `${selectedMonthYear.year}-${selectedMonthYear.month + 1}-1`
              ).format("YYYY年")}
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
            sx={{ width: "36px", height: "36px" }}
          >
            <ArrowForwardIosIcon fontSize="inherit" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={2}>
            {WEEK_LIST.map((w) => (
              <Box gridColumn="span 1" key={w.id}>
                <div>{w.label}</div>
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
                  className={handleDateBackground(m.value)}
                  sx={{
                    minWidth: "36px",
                    borderRadius: "0",
                    backgroundColor: handleBtnBackGroundColor(m.value),
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
            Today
          </Button>
          <Button
            onClick={handleDatePickerClick(false)}
            variant="contained"
            disableElevation
          >
            Confirm
          </Button>
        </DialogActions>
      </Menu>
    </React.Fragment>
  );
}

export default memo(DateRangePicker);
