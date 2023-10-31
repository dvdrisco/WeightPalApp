import Main from "./Main";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import Inter from "./fonts/Inter-Regular.ttf";
import { CssBaseline } from "@mui/material";
function App() {
  const themeBase = createTheme({
    palette: {
      creamBackground: "#fee1be",
      black: "#000000",
      white: "#FFFFFF",
      lightGrey: {
        main: "#b7b7b7",
        secondary: "#f3f3f3",
      },
      darkGrey: {
        main: "#434343",
        secondary: "#666666",
      },
      secondaryText: "#595959",
      filterText: "rgba(0,0,0,0.8)",
    },
    typography: {
      fontFamily: "Inter",
      color: "#000000",
    },
    // 27" Monitor Screen Width is 1920
    extraLargeScreen: () => window.innerWidth > 1536,

    // Macbook Air M1 Screen Width is 1200
    largeScreen: () => window.innerWidth >= 1200 && window.innerWidth <= 1536,
    mediumScreen: () => window.innerWidth <= 1200 && window.innerWidth > 900,
    smallScreen: () => window.innerWidth <= 900 && window.innerWidth > 600,
    extraSmallScreen: () =>
      window.innerWidth <= 600 && window.innerHeight >= 800,
    extraExtraSmallScreen: () =>
      window.innerWidth <= 600 && window.innerHeight < 800,

    largerScreen: () => window.innerWidth >= 900,
    smallerScreen: () => window.innerWidth <= 900,
    tablet: () =>
      window.innerWidth > 700 &&
      window.innerWidth < 1000 &&
      window.innerHeight > 900,

    components: {
      MuiCssBaseline: {
        // these fonts can support more unicode ranges (character sets associated with different alphabets) but i dont see a need to import them now. the raleway import was in the MUI documentation, also unicode range is optional
        // i dont know why but somehow making all the format() parameters woff2 makes the fonts look correct. also changing them to tff and woff will change the appearance each time
        styleOverrides: `
          @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              src: local('Inter'), local('Inter-Regular'), url("${Inter}") format('woff2');
          }
  
        `,
      },
    },
  });
  const customTheme = responsiveFontSizes(themeBase);
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Main />
    </ThemeProvider>
  );
}

export default App;
