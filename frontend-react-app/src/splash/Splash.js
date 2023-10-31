import { useRef } from "react";
import { Grid } from "@mui/material";
import Intro from "./Intro";
import { useTheme } from "@mui/material/styles";
import UserSignUp from "./UserSignUp";
const Splash = () => {
  const theme = useTheme();

  const signUpRef = useRef();
  const executeScroll = () => signUpRef.current.scrollIntoView();

  return (
    <Grid container rowGap={theme.largerScreen() ? 15 : 5}>
      <Grid item xs={12}>
        <Intro executeScroll={executeScroll} />
      </Grid>
      <Grid item xs={12} ref={signUpRef}>
        <UserSignUp />
      </Grid>
    </Grid>
  );
};
export default Splash;
