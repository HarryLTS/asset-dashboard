import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={(props) => (
      false
      ? <Component {...props} />
      : <Redirect to='/login' />
    )} />
  );
}

export default PrivateRoute;
