import React, { memo } from "react";
import DateRangePicker from "@Components/Common/DateRangePicker";

function App(): React.ReactElement {
  return (
    <main>
      <DateRangePicker />
    </main>
  );
}

export default memo(App);
