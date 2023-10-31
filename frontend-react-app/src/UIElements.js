import { styled } from "@mui/system";
import { Button } from "@mui/material";
import { InputBase } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import { MenuItem, Grid, Stack, Typography, capitalize } from "@mui/material";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LocalStorageManager from "./LocalStorageManager";

const BlackButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.black,
}));
export { BlackButton };

const WhiteInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    border: "1px solid #ced4da",
    fontSize: "1rem",
    padding: "5px 6px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
  },
}));
export { WhiteInput };

const MenuListComposition = (props) => {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack>
      <Grid
        container
        item
        justifyContent={"flex-end"}
        alignItems={"center"}
        spacing={1}
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{
          cursor: "pointer",
        }}
      >
        <Grid item>
          <PersonOutlinedIcon
            sx={{
              color: theme.palette.white,
              fontSize: "2rem",
            }}
          />
        </Grid>
        <Grid item>
          <Typography color={theme.palette.white} fontSize={"1.4rem"}>
            {capitalize(props.firstName)}
          </Typography>
        </Grid>
        <Grid item>
          <ArrowDropDownIcon
            sx={{
              color: theme.palette.white,
              fontSize: "2rem",
            }}
          />
        </Grid>
      </Grid>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    onClick={() => {
                      LocalStorageManager.shared.logOutUser();
                      window.location.assign("/");
                    }}
                  >
                    Log out
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Stack>
  );
};
export { MenuListComposition };
