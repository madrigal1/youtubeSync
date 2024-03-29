/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import landingPage from './pages/landingPage/landingPage';
import dashboard from './pages/dashboard/dashboard';
import screen from './pages/screen/screen';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={landingPage} />
        <Route exact path="/dashboard" component={dashboard} />
        <Route exact path="/screen" component={screen} />
      </Switch>
    </Router>
  );
}

export default App;
