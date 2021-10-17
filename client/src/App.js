import { React } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard, EmployeeDashboard } from './pages';

/**
 * App
 */
const App = () => {

  // we need to render the ModalForm subject to a condition, so that it is created and destroyed every time, thus useState is called again to initialize the state variables
  return (
    <Router onE>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/employee" component={EmployeeDashboard} />
      </Switch>
    </Router>
  );

}

export default App;
