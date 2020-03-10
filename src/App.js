import React from 'react';
import './App.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import NotFoundScreen from './screens/NotFoundScreen/NotFoundScreen';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <div>
          <Switch>
            <Route path='/login'>
              <LoginScreen />
            </Route>
            <Route path='/register'>
              <RegisterScreen />
            </Route>
            <PrivateRoute path='/' exact component={HomeScreen} />
            <Route path='/'>
              <NotFoundScreen />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
