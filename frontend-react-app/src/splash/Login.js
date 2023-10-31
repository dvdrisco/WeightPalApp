import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { BlackButton } from "../UIElements";
import { FormHelperText } from "@mui/material";
import Stack from "@mui/material/Stack";
import APIClient from "../APIClient";
import { useReducer, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import LocalStorageManager from "../LocalStorageManager";
const Login = (props) => {
  const theme = useTheme();

  const [formValue, setFormValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      id: "",
      password: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [redirect, setRedirect] = useState("");
  useEffect(() => {
    let mount = true;

    // Trigger page navigation by setting redirect state
    if (mount && redirect) {
      window.location.assign(redirect);
    }
    return () => (mount = false);
  }, [redirect, props]);

  const handleInput = (event) => {
    const id = event.target.id;
    const value = event.target.value;

    setFormValue({ [id]: value });
  };
  const validate = (form) => {
    return form.checkValidity();
  };

  // Input handler
  const handleAuthentication = () => {
    APIClient.authenticateUser(formValue).then((response) => {
      if (response) {
        LocalStorageManager.shared.currentUser = response;
        setLoading(false);
        setRedirect("/home");
      } else {
        setLoginError(true);
        setLoading(false);
      }
    });
  };
  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    const form = event.target;

    // Trigger form validation
    if (validate(form)) {
      // Authenticate the user
      handleAuthentication();
    } else {
      setLoading(false);
    }
  };
  return (
    <Grid
      container
      justifyContent={"center"}
      sx={{ position: "fixed", top: "25%", bottom: "25%" }}
    >
      <CardContent>
        <Grid item xs={12} margin={"0 auto"}>
          <form onSubmit={handleSubmit} autoComplete="new-password">
            <fieldset
              style={{
                boxShadow: "0 0 15px 1px rgba(0, 0, 0, 0.4)",
                padding: "4vh 5vw",
                boxSizing: "border-box",
                margin: "0 10%",
                border: "0",
              }}
            >
              <FormGroup>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      fontSize={"2rem"}
                      textAlign={"center"}
                      margin={"0 auto"}
                      paddingBottom={"3vh"}
                      paddingTop={"2vh"}
                    >
                      Log In
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack
                      direction={"column"}
                      rowGap={3}
                      alignItems={"center"}
                    >
                      <FormHelperText hidden={!loginError} error={true}>
                        Your email or password were incorrect
                      </FormHelperText>
                      <TextField
                        required
                        fullWidth
                        label={"Email"}
                        id="id"
                        sx={{
                          marginLeft: "auto",
                          marginRight: "auto",
                          width: "100%",
                        }}
                        onChange={handleInput}
                        value={formValue.id}
                      />
                      <TextField
                        autoComplete="new-password"
                        required
                        type="password"
                        fullWidth
                        label={"Password"}
                        name="password"
                        id="password"
                        sx={{
                          marginLeft: "auto",
                          marginRight: "auto",
                          width: "100%",
                        }}
                        onChange={handleInput}
                        value={formValue.password}
                      />
                    </Stack>
                    <Stack
                      direction={"column"}
                      rowGap={2}
                      alignItems={"center"}
                      marginTop={"5vh"}
                    >
                      <BlackButton
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          marginLeft: "auto",
                          marginRight: "auto",
                          width: "80%",
                          paddingTop: "1vh",
                          paddingBottom: "1vh",
                        }}
                      >
                        {loading ? (
                          <CircularProgress
                            size={24}
                            sx={{
                              color: `${theme.palette.black.main}`,
                            }}
                          />
                        ) : (
                          "Log In"
                        )}
                      </BlackButton>
                    </Stack>
                  </Grid>
                </Grid>
              </FormGroup>
            </fieldset>
          </form>
        </Grid>
      </CardContent>
    </Grid>
  );
};
export default Login;
