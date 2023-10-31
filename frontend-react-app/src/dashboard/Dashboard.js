import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TableChartIcon from "@mui/icons-material/TableChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import { MainListItems } from "./listItems";
import Chart from "./Chart";
import { MenuItem, ToggleButton, ToggleButtonGroup } from "@mui/material";
import "../css/dashboard.css";
import { WeightHistoryItem } from "../Models";
import DataTable from "./DataTable";
import { FormControl, InputLabel, Select, capitalize } from "@mui/material";
import Title from "./Title";

import LocalStorageManager from "../LocalStorageManager";
import { MenuListComposition } from "../UIElements";
import ManageWeightData from "./ManageWeightData";
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(
  //
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const getWeightHistoryMonths = (weightHistory, year) => {
  // Map provides faster lookup times
  const userMonths = new Map();

  // For each weight data object
  weightHistory.forEach((weightData) => {
    // If the month isn't already present in the month array
    if (
      weightData.date.getFullYear() === year &&
      !userMonths.get(weightData.date.getMonth())
    ) {
      // Push the unique month
      userMonths.set(
        weightData.date.getMonth(),
        LocalStorageManager.shared.months[weightData.date.getMonth()]
      );
    }
  });
  return userMonths;
};

const sortWeightHistoryByDate = (a, b) => {
  return a.date.getTime() - b.date.getTime();
};

const DashboardSplash = (props) => {
  const theme = useTheme();

  const [dataDisplay, setDataDispaly] = React.useState("chart");
  const handleToggleButtonChange = (event, newDataDisplay) => {
    setDataDispaly(newDataDisplay);
  };

  const weightItemsData = (() => {
    return props.weightHistory.map(
      (weightHistory) => new WeightHistoryItem(weightHistory)
    );
  })();

  const weightHistoryYears = (() => {
    // Map provides faster lookup times
    const userYears = new Map();

    // For each weight data object
    props.weightHistory.forEach((weightData) => {
      // If the year isn't already present in the year array
      if (!userYears.get(weightData.date.getFullYear())) {
        // Push the unique year
        userYears.set(
          weightData.date.getFullYear(),
          weightData.date.getFullYear()
        );
      }
    });
    return userYears;
  })();
  const [filterYear, setFilterYear] = React.useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = React.useState(
    (() => new Date())().getMonth()
  );

  const initialFilteredData = (() => {
    const dateFilteredData = weightItemsData.filter(
      (weightHistoryItem) =>
        weightHistoryItem.date.getFullYear() === filterYear &&
        weightHistoryItem.date.getMonth() === filterMonth
    );
    return dateFilteredData.sort(sortWeightHistoryByDate);
  })();

  const [filteredData, setFilteredData] = React.useState(initialFilteredData);

  const handleFilterChange = (event) => {
    let filterName = event.target.name;
    let filterValue = event.target.value;

    if (filterName === "month") {
      setFilterMonth(filterValue);
      if (filterValue === "all") {
        setFilteredData(
          weightItemsData
            .filter(
              (weightHistoryItem) =>
                weightHistoryItem.date.getFullYear() === filterYear
            )
            .sort(sortWeightHistoryByDate)
        );
      } else {
        // Filter data to only include weights with the desired month
        setFilteredData(
          weightItemsData
            .filter(
              (weightHistoryItem) =>
                weightHistoryItem.date.getFullYear() === filterYear &&
                weightHistoryItem.date.getMonth() === filterValue
            )
            .sort(sortWeightHistoryByDate)
        );
      }
    } else {
      setFilterYear(filterValue);

      // If year is changed, reset month
      setFilterMonth("all");

      // Filter data to only include weights with the desired year
      setFilteredData(
        weightItemsData
          .filter(
            (weightHistoryItem) =>
              weightHistoryItem.date.getFullYear() === filterValue
          )
          .sort(sortWeightHistoryByDate)
      );
    }
  };
  return (
    <>
      <Grid container item xs={12} justifyContent="flex-end">
        <ToggleButtonGroup
          color="primary"
          value={dataDisplay}
          exclusive
          onChange={handleToggleButtonChange}
          sx={{ mr: 2, ml: 2, mt: 2 }}
        >
          <ToggleButton value="chart">
            <ShowChartIcon></ShowChartIcon>
          </ToggleButton>
          <ToggleButton value="table">
            <TableChartIcon></TableChartIcon>
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid
        item
        xs={12}
        md={12}
        lg={12}
        sx={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container>
          <Grid
            item
            sx={{
              mb: 2,
            }}
          >
            <Title>Weight History</Title>
          </Grid>
          <Grid
            item
            container
            spacing={2}
            sx={{ height: "min-content", mb: 2 }}
            alignItems={"flex-end"}
          >
            <Grid item lg={2} md={3} xs={5}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: theme.palette.filterText }}>
                  Month
                </InputLabel>
                <Select
                  label="Month"
                  name="month"
                  value={filterMonth}
                  onChange={handleFilterChange}
                >
                  {Array.from(
                    getWeightHistoryMonths(
                      props.weightHistory,
                      filterYear
                    ).keys()
                  ).map((monthIndex) => (
                    <MenuItem value={monthIndex} key={monthIndex}>
                      {capitalize(
                        LocalStorageManager.shared.months[monthIndex]
                      )}
                    </MenuItem>
                  ))}
                  {<MenuItem value={"all"}>All</MenuItem>}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2} md={3} xs={5}>
              <FormControl fullWidth sx={{ color: theme.palette.filterText }}>
                <InputLabel sx={{ color: theme.palette.filterText }}>
                  Year
                </InputLabel>
                <Select
                  label="Year"
                  name="year"
                  value={filterYear}
                  onChange={handleFilterChange}
                >
                  {Array.from(weightHistoryYears.keys()).map((year) => (
                    <MenuItem value={year} key={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {dataDisplay === "chart" ? (
          <>{<Chart filteredData={filteredData} />}</>
        ) : (
          <DataTable filteredData={filteredData} />
        )}
      </Grid>
    </>
  );
};
const Dashboard = (props) => {
  const theme = useTheme();

  const [pageIndex, setPageIndex] = React.useState(0);
  const componentsToDisplay = [
    <DashboardSplash weightHistory={props.weightHistory} />,
    <ManageWeightData
      weightHistory={props.weightHistory}
      updateWeightHistory={props.updateWeightHistory}
    />,
  ];

  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>

          <Grid item alignSelf={"center"} right={"1vw"}>
            <MenuListComposition
              firstName={LocalStorageManager.shared.currentUser.firstName}
            ></MenuListComposition>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <MainListItems handleClick={(index) => setPageIndex(index)} />
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
        className="linear-gradient"
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Paper
            sx={{
              pt: theme.spacing(4),
              pr: theme.spacing(4),
              pb: theme.spacing(12),
              pl: theme.spacing(4),
            }}
          >
            {componentsToDisplay[pageIndex]}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
