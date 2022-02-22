# mui-calendar-picker

```string
npm i mui-calendar-picker
```

A mui-styled calendar date range picker, being able to inherit the style settings from `ThemeProvider`.\
Demo site: https://tzynwang.github.io/mui-calendar-picker/

## Example

```tsx
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import App from "@Components/App";

const THEME = createTheme({
  palette: {
    primary: {
      main: "Lavender",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={THEME}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

```tsx
// src/components/App/index.tsx
import React, { memo, useState } from "react";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { CalendarPicker, DATE_RANGE, DateRange } from "mui-calendar-picker";

function App(): React.ReactElement {
  const [dateRange, setDateRange] = useState<DateRange>(DATE_RANGE);
  const theme = useTheme(); // access parent's theme settings

  return (
    <Box>
      <CalendarPicker
        setDateRange={setDateRange}
        theme={theme}
        openBtnText={"Select Date Range"}   // optional
        todayBtnText={"Back to Today"}      // optional
        confirmBtnText={"Submit"}           // optional
      />
      <Typography>
        Start at: {dayjs(dateRange.start).format("YYYY-MM-DD")}
      </Typography>
      <Typography>
        End at: {dayjs(dateRange.end).format("YYYY-MM-DD")}
      </Typography>
    </Box>
  );
}

export default memo(App);
```

## Author

Charlie (Tzu Yin)\
[Blog](https://tzynwang.github.io/) | [GitHub](https://github.com/tzynwang)
