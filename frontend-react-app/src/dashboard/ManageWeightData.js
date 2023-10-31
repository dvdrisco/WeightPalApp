import * as React from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Grid } from "@mui/material";
import Title from "./Title";
import { EditWeightHistoryModal } from "./EditWeightHistoryModal";

const ManageWeightData = (props) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  // Format today's date in the format expected by the dayjs library
  const todayFormatted = (() => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  })();

  const [selectedDate, setSelectedDate] = React.useState(dayjs(todayFormatted));
  const [selectedWeightHistory, setSelectedWeightHistory] = React.useState(
    props.weightHistory.find(
      (weightHistory) =>
        weightHistory.date.getFullYear() === new Date().getFullYear() &&
        weightHistory.date.getMonth() === new Date().getMonth() &&
        weightHistory.date.getDate() === new Date().getDate()
    ) ?? false
  );

  const handleFinishEditing = () => {
    props.updateWeightHistory();
    setModalOpen(false);
  };
  return (
    <Grid
      container
      sx={{
        height: "55vh",
      }}
      justifyContent="center"
    >
      <Grid
        item
        sx={{
          mb: 2,
          mt: 2,
        }}
      >
        <Title>Manage Your Weight History</Title>
      </Grid>
      <Grid item container justifyContent={"center"}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            orientation="landscape"
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={selectedDate}
            disableFuture={true}
            onChange={(newValue) => {
              // Create a new date using the date components returned by the dayjs library's parsing of the datePicker value
              const newDate = new Date(
                dayjs(newValue).year(),
                dayjs(newValue).month(),
                dayjs(newValue).date()
              );
              // Update the calendar date to the new date
              setSelectedDate(newDate);

              // Check if the date selected matches an existing weight history
              const selectedWeightHistory = props.weightHistory.find(
                (weightHistory) =>
                  weightHistory.date.getFullYear() === newDate.getFullYear() &&
                  weightHistory.date.getMonth() === newDate.getMonth() &&
                  weightHistory.date.getDate() === newDate.getDate()
              );
              // If the weight history exists then set it, updating the modal component
              if (selectedWeightHistory) {
                setSelectedWeightHistory(selectedWeightHistory);
              } else {
                setSelectedWeightHistory(false);
              }
              setModalOpen(true);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <EditWeightHistoryModal
          open={modalOpen}
          date={selectedDate}
          handleFinishEditing={(weightHistoryChanged) => {
            if (weightHistoryChanged) {
              handleFinishEditing();
            } else {
              setModalOpen(false);
            }
          }}
          selectedWeightHistory={selectedWeightHistory}
        />
      </Grid>
    </Grid>
  );
};
export default ManageWeightData;
