import React, { memo, useState } from "react";
import dayjs from "dayjs";

import DateRangePicker from "@Components/Common/DateRangePicker";
import Typography from "@mui/material/Typography";

import { DateRange } from "./types";

const DATE_RANGE: DateRange = {
  start: "",
  end: "",
};

function App(): React.ReactElement {
  const [dateRange, setDateRange] = useState(DATE_RANGE);

  return (
    <main>
      <DateRangePicker setDateRange={setDateRange} />
      <Typography>
        起始日期：
        {dateRange.start.length > 0 &&
          dayjs(dateRange.start).format("YYYY年MM月DD日")}
      </Typography>
      <Typography>
        結束日期：
        {dateRange.end.length > 0 &&
          dayjs(dateRange.end).format("YYYY年MM月DD日")}
      </Typography>
    </main>
  );
}

export default memo(App);
