import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeWork from '@material-ui/icons/HomeWork';
import AttachMoney from '@material-ui/icons/AttachMoney';
import BarChart from '@material-ui/icons/BarChart';
import ExitToApp from '@material-ui/icons/ExitToApp';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { SCREENS, ACTION_TYPES } from './../../common/constants';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function NavigationBar(props) {
  const { classes, displayTitle, drawerOpen, handleDrawerClose } = props;
  const dispatch = useDispatch();
  const authToken = useSelector(state => state.client.authToken);

  const redirectToLogin = () => {
    props.history.push('/login');
  }

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({
      type: ACTION_TYPES.LOGOUT,
      authToken,
      redirectToLogin
    });
  }

  const mainListItems = (
    <div>
      <ListItem
        button
        component="a"
        href="/"
        selected={SCREENS.DASHBOARD === displayTitle}
        >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary={SCREENS.DASHBOARD} />
      </ListItem>
      <ListItem
        button
        component="a"
        href="/stock"
        selected={SCREENS.STOCK === displayTitle}
        >
        <ListItemIcon>
          <BarChart />
        </ListItemIcon>
        <ListItemText primary={SCREENS.STOCK} />
      </ListItem>
      <ListItem
        button
        component="a"
        href="/estate"
        selected={SCREENS.ESTATE === displayTitle}
        >
        <ListItemIcon>
          <HomeWork />
        </ListItemIcon>
        <ListItemText primary={SCREENS.ESTATE} />
      </ListItem>
      <ListItem
        button
        component="a"
        href="/cash"
        selected={SCREENS.CASH === displayTitle}
        >
        <ListItemIcon>
          <AttachMoney />
        </ListItemIcon>
        <ListItemText primary={SCREENS.CASH} />
      </ListItem>
    </div>
  );

  const secondaryListItems = (
    <div>
      <ListSubheader inset>Options</ListSubheader>
      <ListItem button onClick={handleLogout}>
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText primary="Log out" />
      </ListItem>
    </div>
  );

  return (
    <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
        }}
        open={drawerOpen}
        >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
    </Drawer>
  );
}

export default withRouter(NavigationBar);
