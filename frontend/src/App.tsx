import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { themes } from 'util/themes';
import JoinSessionCodeForm from 'components/menu/JoinSessionCodeForm';
import SessionLobby from 'components/menu/SessionLobby';
import OSTPV from "./components/OSTPV/OSTPV";
import NavDrawer from "./components/mission_control_tiles/NavDrawer";
import ConsoleTabPanels from "./components/mission_control_tiles/ConsoleTabPanels";
import SessionInterface from "./components/mission_control_tiles/SessionInterface";
import {SessionProvider} from "./context/SessionContext";

function App() {
  const [theme, setTheme] = useState(themes.dark);

  const toggleTheme = () => {
    setTheme(theme => theme === themes.dark ? themes.light : themes.dark)
  }

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider>
        <CssBaseline />
        <Router>
          <Switch>
            <Route path="/tutor/:sessioncode">
              <SessionLobby userType="tutor" />
            </Route>
            <Route path="/tutor">
              <JoinSessionCodeForm userType="tutor" />
            </Route>
            <Route path="/:sessioncode">
              <SessionLobby userType="student" />
            </Route>
            <Route path="/">
              <JoinSessionCodeForm userType="student" />
              {/*<SessionInterface />*/}
            </Route>
          </Switch>
        </Router>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;






{/* <GIFTile id="LASCO-C2" url="https://services.swpc.noaa.gov/products/animations/lasco-c2.json"/>
<GIFTile id="LASCO-C3" url="https://services.swpc.noaa.gov/products/animations/lasco-c3.json"/>
<GIFTile id="SUVI-172" url="https://services.swpc.noaa.gov/products/animations/suvi-primary-171.json"/>
<GIFTile id="SUVI-195" url="https://services.swpc.noaa.gov/products/animations/suvi-primary-195.json"/>
<GIFTile id="SDO-HMII" url="https://services.swpc.noaa.gov/products/animations/sdo-hmii.json"/>
<KpBarChartTile url="https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json" numMostRecent={24}/>
<KpLineChartTile url="https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"/> */}

