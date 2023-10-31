import { Typography, Grid } from "@mui/material";
import bannerImage from "../static/woman_on_phone.png";
import { BlackButton } from "../UIElements";
import { useTheme } from "@emotion/react";
const Intro = (props) => {
  const theme = useTheme();
  return (
    <Grid container>
      <Grid item container>
        <img
          src={bannerImage}
          alt="woman on phone"
          style={{
            maxHeight: "50vh",
            width: "100%",
            objectFit: "cover",
          }}
        ></img>
      </Grid>
      <Grid
        item
        container
        rowGap={2}
        sx={
          theme.largerScreen()
            ? {
                position: "absolute",
                top: "30%",
                left: "2%",
                color: theme.palette.white,
                px: "3vw",
                py: "3vh",
              }
            : {
                mx: 3,
                my: 3,
              }
        }
      >
        <Grid item xs={12}>
          <Typography fontSize="2rem">
            Weight tracking for the 21st century
          </Typography>
        </Grid>
        <Grid item>
          <BlackButton
            variant="contained"
            sx={{
              fontSize: "1rem",
              textAlign: "center",
            }}
            onClick={props.executeScroll}
          >
            Get started
          </BlackButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Intro;
