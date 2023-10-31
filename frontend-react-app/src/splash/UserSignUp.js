import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";

import { CircularProgress } from "@mui/material";
import { BlackButton, WhiteInput } from "../UIElements";
import { useReducer, useState, useEffect } from "react";
import APIClient from "../APIClient";
import { testIfNumber, User, WeightHistory } from "../Models";
import { useTheme } from "@mui/material/styles";
import LocalStorageManager from "../LocalStorageManager";
const UserSignUp = () => {
  const theme = useTheme();

  const [redirect, setRedirect] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formValue, setFormValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      id: "",
      password: "",
      firstName: "",
      lastName: "",
      startingWeight: "",
      accountCreationDatetime: Date.now(),
      active: true,
    }
  );

  useEffect(() => {
    let mount = true;
    if (mount && redirect) {
      window.location.assign(redirect);
    }
    return () => (mount = false);
  }, [redirect]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target;
    const validated = await validate(form);
    if (validated) {
      const newUser = new User("camelCase", formValue);
      APIClient.createUser(newUser).then((result) => {
        setLoading(false);
        if (result) {
          const startingWeight = new WeightHistory();
          startingWeight.userId = newUser.id;
          startingWeight.weight = newUser.startingWeight;

          APIClient.createWeightHistory(startingWeight);
          // Set current user for application globally
          LocalStorageManager.shared.currentUser = newUser;
          setRedirect("/home");
        } else if (result === false) {
          alert(APIClient.networkErrorMessage);
        }
      });
    } else {
      setLoading(false);
    }
  };
  const handleInput = (event) => {
    let id = event.target.id;
    let value = event.target.value;
    if (id === "startingWeight" && !testIfNumber(value)) {
      setErrorMessage("Please enter a valid starting weight");
    } else {
      setFormValue({ [id]: value });
    }
  };

  // Check if the user exists, then trigger Browser form validation
  const validate = async (form) => {
    const result = await APIClient.getUser(formValue.id);
    if (!result) {
      setErrorMessage(APIClient.networkErrorMessage);
      return false;
    } else {
      if (result === 200) {
        setErrorMessage(
          "The email you entered is already associated with an account."
        );
        return false;
      } else {
        return form.checkValidity();
      }
    }
  };

  const ErrorMessage = (props) => (
    <FormHelperText
      hidden={!props.errorMessage}
      error={true}
      sx={{
        fontSize: ".9rem",
        padding: "10px 12px",
        marginRight: "auto",
        marginLeft: "auto",
        paddingBottom: "2vh",
        fontWeight: "bold",
      }}
    >
      {props.errorMessage}
    </FormHelperText>
  );
  return (
    <Grid
      item
      container
      alignItems="stretch"
      justifyContent={"center"}
      sx={{
        backgroundColor: theme.palette.lightGrey.secondary,
        py: 10,
        marginBottom: "10vh",
      }}
    >
      <CardContent>
        <Typography
          fontSize={"3rem"}
          marginBottom={"5vh"}
          color={theme.palette.black.main}
          textAlign={"center"}
          fontWeight={"500"}
        >
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Stack direction={"column"} rowGap={3.5}>
              <FormControl variant="filled">
                <ErrorMessage errorMessage={errorMessage} />
                <WhiteInput
                  required
                  fullWidth
                  placeholder="Email"
                  id="id"
                  type="email"
                  sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  onChange={handleInput}
                  value={formValue.id}
                />
              </FormControl>
              <FormControl variant="filled">
                <WhiteInput
                  required
                  error
                  type="password"
                  autoComplete={"new-password"}
                  fullWidth
                  placeholder="Choose a password"
                  id="password"
                  onChange={handleInput}
                  value={formValue.password}
                />
              </FormControl>
              <FormControl variant="filled">
                <WhiteInput
                  required
                  error
                  type="text"
                  fullWidth
                  placeholder="First name"
                  id="firstName"
                  onChange={handleInput}
                  value={formValue.firstName}
                />
              </FormControl>
              <FormControl variant="filled">
                <WhiteInput
                  required
                  error
                  type="text"
                  fullWidth
                  placeholder="Last name"
                  id="lastName"
                  sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  onChange={handleInput}
                  value={formValue.lastName}
                />
              </FormControl>
              <FormControl variant="filled">
                <WhiteInput
                  required
                  error
                  fullWidth
                  placeholder="Your weight"
                  id="startingWeight"
                  sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  onChange={handleInput}
                  value={formValue.startingWeight}
                />
              </FormControl>
            </Stack>

            <BlackButton
              disabled={loading}
              variant="contained"
              type={"submit"}
              sx={{
                paddingLeft: "2vw",
                paddingRight: "2vw",
                width: "fit-content",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: "1rem",
                marginTop: "5vh",
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </BlackButton>
          </FormGroup>
        </form>
      </CardContent>
    </Grid>
  );
};
export default UserSignUp;
