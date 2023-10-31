import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import * as React from "react";
import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Button,
  CircularProgress,
  DialogActions,
  FormControlLabel,
  FormGroup,
  Slide,
  Switch,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BlackButton } from "../UIElements";
import APIClient from "../APIClient";
import { WeightHistory } from "../Models";
import LocalStorageManager from "../LocalStorageManager";
import { useTheme } from "@mui/material/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Displays textfields for both current weight and new weight
const EditExistingWeightInput = (props) => (
  <>
    <Stack spacing={1}>
      <Typography fontSize={"1rem"} textAlign={"left"}>
        Current Weight Value
      </Typography>
      <TextField
        autoComplete="new-password"
        type="text"
        disabled
        fullWidth
        id="currentWeight"
        value={props.selectedWeightHistory.weight}
      />
    </Stack>
    <Stack spacing={1}>
      <Typography fontSize={"1rem"} textAlign={"left"}>
        New Weight Value
      </Typography>
      <TextField
        autoComplete="new-password"
        type="text"
        inputProps={{ pattern: "[0-9]*" }}
        disabled={props.deleteWeight}
        fullWidth
        label={"Your weight"}
        id="newWeight"
        onChange={(event) => props.setNewWeight(parseFloat(event.target.value))}
        value={props.newWeight}
      />
    </Stack>
  </>
);
const EditExistingWeightNotes = (props) => (
  <Grid container rowGap={2}>
    <Grid item xs={12}>
      <Stack spacing={1}>
        <Typography fontSize={"1rem"} textAlign={"left"}>
          Current Notes
        </Typography>
        <TextField
          autoComplete="new-password"
          type="tel"
          disabled
          fullWidth
          id="currentWeight"
          value={props.selectedWeightHistory.notes}
        />
      </Stack>
    </Grid>
    <Grid item xs={12}>
      <Stack spacing={1}>
        <Typography fontSize={"1rem"} textAlign={"left"}>
          New Notes
        </Typography>
        <TextField
          sx={{ mt: 4 }}
          autoComplete="new-password"
          type="text"
          disabled={props.deleteWeight}
          fullWidth
          label={"Your notes"}
          id="notes"
          onChange={(event) => props.setNewNotes(event.target.value)}
          value={props.newNotes}
        />
      </Stack>
    </Grid>
  </Grid>
);
// Only display textfield for new weight
const CreateNewWeightInput = (props) => (
  <>
    <Stack spacing={1}>
      <Typography fontSize={"1rem"} textAlign={"left"}>
        New Weight Value
      </Typography>
      <TextField
        autoComplete="new-password"
        type="text"
        inputProps={{ pattern: "[0-9]*" }}
        required
        fullWidth
        label={"New Weight"}
        id="newWeight"
        onChange={(event) => props.setNewWeight(event.target.value)}
        value={props.newWeight}
      />
    </Stack>
  </>
);
const CreateNewWeightNotes = (props) => (
  <>
    <Stack spacing={1}>
      <Typography fontSize={"1rem"} textAlign={"left"}>
        New Notes
      </Typography>
      <TextField
        sx={{ mt: 4 }}
        autoComplete="new-password"
        type="text"
        disabled={props.deleteWeight}
        fullWidth
        label={"Notes"}
        id="notes"
        onChange={(event) => props.setNewNotes(event.target.value)}
        value={props.newNotes}
      />
    </Stack>
  </>
);
const EditWeightHistoryModal = (props) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [deleteWeight, setDeleteWeight] = useState(false);

  const [newWeight, setNewWeight] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const handleClose = (weightHistoryChanged = false) => {
    setDeleteWeight(false);
    setNewWeight("");
    setNewNotes("");
    props.handleFinishEditing(weightHistoryChanged);
  };
  const validate = (form) => {
    return form.checkValidity();
  };
  const handleSubmitEdit = (event) => {
    event.preventDefault();
    let eventTarget = event.target;
    const form = eventTarget.closest("form");

    // Trigger browser form validation
    if (validate(form)) {
      setLoading(true);

      // Editing an existing WeightHistory, triggering an update API call
      if (props.selectedWeightHistory) {
        // If the user selected a new weight or new notes
        if (newWeight !== "" || newNotes !== "") {
          // Clone existing weight history object and update it with new values for notes and weight
          const weightHistoryObject = { ...props.selectedWeightHistory };

          const updateNotes = (() => {
            // Check to see if the user provided new notes
            if (newNotes === "") {
              return props.selectedWeightHistory.notes;
            }
            // If not, return the old notes
            else {
              return newNotes;
            }
          })();
          const updateWeight = (() => {
            // Check to see if the user provided new weight

            if (newWeight === "") {
              return props.selectedWeightHistory.weight;
            }
            // If not, return the weight
            else {
              return newWeight;
            }
          })();
          weightHistoryObject.notes = updateNotes;
          weightHistoryObject.weight = updateWeight;

          const newWeightHistory = new WeightHistory(
            "camelCase",
            weightHistoryObject
          );
          APIClient.updateWeightHistory(newWeightHistory).then((response) => {
            setLoading(false);
            if (!response) {
              alert(APIClient.networkErrorMessage);
            }
            handleClose(true);
          });
        } else {
          // Otherwise close the modal without updating the weight history
          setLoading(false);
          handleClose(false);
        }
      }
      // Otherwise Create a new WeightHistory and insert it
      else {
        // Set properties for weight, notes, and userId
        const newWeightHistory = new WeightHistory();
        newWeightHistory.weight = newWeight;
        newWeightHistory.notes = newNotes;
        newWeightHistory.userId = LocalStorageManager.shared.currentUser.id;
        newWeightHistory.date = props.date;
        // Create new WeightHistory instance in backend
        APIClient.createWeightHistory(newWeightHistory).then((response) => {
          setLoading(false);
          if (!response) {
            alert(APIClient.networkErrorMessage);
          }
          handleClose(true);
        });
      }
    }
  };

  // Delete an existing weight history using the id
  const handleSubmitDelete = () => {
    APIClient.deleteWeightHistory(props.selectedWeightHistory.id).then(
      (response) => {
        setLoading(false);
        if (!response) {
          alert(APIClient.networkErrorMessage);
        }
        handleClose(true);
      }
    );
  };
  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      fullWidth={true}
      maxWidth={"md"}
      sx={{
        display: "relative",
        left: "10%",
      }}
    >
      <DialogContent
        sx={{
          p: 8,
        }}
      >
        <Typography fontSize={"2rem"} textAlign={"center"} marginBottom="10%">
          {props.selectedWeightHistory
            ? "Edit Your Weight History"
            : "Log a New Weight"}
        </Typography>
        <Grid
          container
          justifyContent={"flex-end"}
          sx={{ mb: 4, position: "absolute", right: 20, top: "11%" }}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={deleteWeight}
                  onChange={() =>
                    setDeleteWeight((prevDeleteWeight) => !prevDeleteWeight)
                  }
                />
              }
              label="Delete Weight"
            />
          </FormGroup>
        </Grid>
        <form onSubmit={handleSubmitEdit}>
          <Grid container rowGap={4} justifyContent="center">
            <Grid item xs={12}>
              <Stack spacing={10} direction="row">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack justifyContent={"flex-start"} spacing={1}>
                    <Typography fontSize={"1rem"} textAlign={"left"}>
                      Selected Date
                    </Typography>
                    <DatePicker
                      disabled
                      onChange={() => ""}
                      value={props.date}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
                {props.selectedWeightHistory ? (
                  <EditExistingWeightInput
                    newWeight={newWeight}
                    setNewWeight={(newWeight) => setNewWeight(newWeight)}
                    selectedWeightHistory={props.selectedWeightHistory}
                    deleteWeight={deleteWeight}
                  />
                ) : (
                  <CreateNewWeightInput
                    newWeight={newWeight}
                    setNewWeight={(newWeight) => setNewWeight(newWeight)}
                  />
                )}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              {props.selectedWeightHistory ? (
                <EditExistingWeightNotes
                  newNotes={newNotes}
                  setNewNotes={(newNotes) => setNewNotes(newNotes)}
                  selectedWeightHistory={props.selectedWeightHistory}
                  deleteWeight={deleteWeight}
                />
              ) : (
                <CreateNewWeightNotes
                  newNotes={newNotes}
                  setNewNotes={(newNotes) => setNewNotes(newNotes)}
                  deleteWeight={deleteWeight}
                />
              )}
            </Grid>

            <DialogActions>
              <Grid
                container
                item
                justifyContent="center"
                alignItems={"center"}
              >
                {deleteWeight ? (
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ minWidth: "150px", fontSize: "1rem" }}
                      onClick={handleSubmitDelete}
                    >
                      Delete Current Weight
                    </Button>
                  </Grid>
                ) : (
                  <Grid item>
                    <BlackButton
                      type="submit"
                      variant="contained"
                      sx={{ minWidth: "150px", fontSize: "1rem" }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={24}
                          sx={{
                            color: `${theme.palette.black.main}`,
                          }}
                        />
                      ) : (
                        "Submit"
                      )}
                    </BlackButton>
                  </Grid>
                )}
              </Grid>
            </DialogActions>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export { EditWeightHistoryModal };
