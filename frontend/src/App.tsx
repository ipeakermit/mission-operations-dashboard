import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Menu from 'components/menu/Menu';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/tutor">
            <Menu userType="tutor" />
          </Route>
          <Route path="/">
            <Menu userType="student" />
          </Route>
        </Switch>
      </Router>
    </div>
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

