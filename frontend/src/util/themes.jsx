import { createMuiTheme } from '@material-ui/core/styles';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#64B5F6',
    }
  },
});

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

export const themes = {
  light: lightTheme,
  dark: darkTheme
}