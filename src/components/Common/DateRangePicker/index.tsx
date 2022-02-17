import React, { memo, useState } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Box from "@mui/material/Box";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const WEEK = Array.from(Array(7).keys());
const MONTH = Array.from(Array(35).keys());

function DateRangePicker() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorDialog, setAnchorDialog] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorYear, setAnchorYear] = useState<null | HTMLElement>(null);
  const openYear = Boolean(anchorYear);

  const handleDialogOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorDialog(event.currentTarget);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setAnchorDialog(null);
  };

  const handleMonthOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };
  const handleMonthClose = () => {
    setOpenMenu(false);
    setAnchorEl(null);
  };

  const handleYearOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorYear(event.currentTarget);
  };
  const handleYearClose = () => {
    setAnchorYear(null);
  };

  return (
    <React.Fragment>
      <Button onClick={handleDialogOpen}>Click to Open</Button>
      <Menu
        onClose={handleDialogClose}
        open={dialogOpen}
        anchorEl={anchorDialog}
      >
        <DialogTitle>
          <Button onClick={handleMonthOpen}>Month</Button>
          <Menu open={openMenu} anchorEl={anchorEl}>
            <MenuItem onClick={handleMonthClose}>April</MenuItem>
            <MenuItem onClick={handleMonthClose}>November</MenuItem>
          </Menu>
          <Button onClick={handleYearOpen}>Year</Button>
          <Menu open={openYear} anchorEl={anchorYear}>
            <MenuItem onClick={handleYearClose}>1914</MenuItem>
            <MenuItem onClick={handleYearClose}>1989</MenuItem>
          </Menu>

          <IconButton aria-label="previous month" size="small">
            <ArrowBackIosIcon fontSize="inherit" />
          </IconButton>
          <IconButton aria-label="next month" size="small">
            <ArrowForwardIosIcon fontSize="inherit" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={2}>
            {WEEK.map((w, i) => (
              <Box gridColumn="span 1" key={i}>
                <div>{w}</div>
              </Box>
            ))}
          </Box>
          <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gridTemplateRows="repeat(5, 1fr)"
            gap={2}
            marginY={3}
          >
            {MONTH.map((m, i) => (
              <Box gridColumn="span 1" key={i}>
                <div>{m + 1}</div>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button>Today</Button>
          <Button onClick={handleDialogClose}>Close Dialog</Button>
        </DialogActions>
      </Menu>
    </React.Fragment>
  );
}

export default memo(DateRangePicker);
