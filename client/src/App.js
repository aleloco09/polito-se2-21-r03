import { React, useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Login from './components/Login';

import routes from './routes';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Dashboard } from './pages';

/** 
 * Verify authentication
 */
const verifyToken = async () => {
  try {
    const data = await fetch('/api/auth', {
      method: 'POST',
      credentials: 'include',
    })
    const response = await data.json();

    if (response.status === 'success') {
      return { status: true, user: response.data };
    } else {
      return { status: false, user: null };
    }
  } catch (err) {
    console.log(`⚡️ An error occurred: ${err}`);
    return false;
  }
}

/**
 * PrivateRoute
 */
function PrivateRoute({ component: Compontent, path, roles, ...rest }) {

  const [auth, setAuth] = useState(false);
  const [goOn, setGoOn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    verifyToken()
      .then((res) => {
        setAuth(res.status);
        setUser(res.user)
      })
      .then(() => {
        setGoOn(true);
      })
  }, []);

  if (!goOn) {
    return (
      <div>Loading...</div>
    )
  }

  let res;

  if (auth) {
    res = <Route {...rest} render={props => <Compontent path={props.location.pathname} isLoggedIn={auth} user={user} {...props} />} />
  } else {
    res = <Route {...rest} render={props => <Redirect to={{ pathname: '/login', state: { from: props.location } }} />} />
  }

  return res;
}

/**
 * App
 */
const App = () => {

  // we need to render the ModalForm subject to a condition, so that it is created and destroyed every time, thus useState is called again to initialize the state variables
  return (
    <Router onE>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        {/* {routes.map((route, idx) => {
          return route.component && (
            <PrivateRoute
              key={idx}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          )
        })} */}
      </Switch>
    </Router>
  );

}

export default App;
