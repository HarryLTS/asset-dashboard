import React from 'react';
import { useSelector } from 'react-redux';
import {
  Route,
  Redirect
} from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  const authToken = useSelector(state => state.client.authToken);

  return (
    <Route {...rest} render={(props) => (
      authToken !== null
      ? <Component {...props} />
      : <Redirect to='/login' />
    )} />
  );
}

export default PrivateRoute;
