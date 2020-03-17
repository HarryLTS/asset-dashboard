import React from 'react';
import './App.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import StockScreen from './screens/StockScreen/StockScreen';
import CashScreen from './screens/CashScreen/CashScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import NotFoundScreen from './screens/NotFoundScreen/NotFoundScreen';
import EstateScreen from './screens/EstateScreen/EstateScreen';
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
            <PrivateRoute path='/stock' component={StockScreen} />
            <PrivateRoute path='/estate' component={EstateScreen} />
            <PrivateRoute path='/cash' component={CashScreen} />
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
