import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Link as RRLink, useNavigate } from "react-router-dom";
import logo from "./static/updated-weight-logo.png";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, Typography } from "@mui/material";
const Navbar = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const NavbarLinks = () => (
    <Grid item sx={{ marginLeft: "auto", marginRight: "5vw" }}>
      <RRLink
        to="/login"
        style={{
          textDecoration: "none",
          color: theme.palette.black,
          fontSize: theme.largerScreen() ? "1.5rem" : "1rem",
        }}
      >
        Log In
      </RRLink>
    </Grid>
  );

  return (
    <>
      <Grid
        container
        sx={{
          width: "100vw",
          height: "auto",
          py: 2,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            position="static"
            sx={{
              boxShadow: 0,
              backgroundColor: theme.palette.white,
            }}
          >
            <Toolbar
              sx={{
                minHeight: "50px",
              }}
            >
              <Grid container alignItems="center">
                {/* logo */}
                <Grid
                  item
                  lg={0.75}
                  xs={2}
                  // if the screen is med sized then we need some margin on the left or the logo goes off screen
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate("../", {
                      replace: true,
                    })
                  }
                >
                  {/* Set logo with based on parent div */}
                  <img
                    src={logo}
                    width="100%"
                    alt="weight scale"
                    style={{
                      // if light mode then
                      filter:
                        theme.palette.mode === "dark" ? "invert(100%)" : "",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  lg={2}
                  xs={5}
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate("../", {
                      replace: true,
                    })
                  }
                >
                  <Typography
                    color={theme.palette.black}
                    fontSize={theme.largerScreen() ? "2rem" : "1.3rem"}
                    textAlign={"center"}
                  >
                    My Weight Pal
                  </Typography>
                </Grid>
                <NavbarLinks />
              </Grid>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>
      {props.childComponent}
    </>
  );
};
export default Navbar;
