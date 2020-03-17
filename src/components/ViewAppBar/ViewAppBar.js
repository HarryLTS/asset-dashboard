import React from 'react';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuIcon from '@material-ui/icons/Menu';

export default function ViewAppBar(props) {
  const { classes, drawerOpen, handleDrawerOpen } = props;

  return (
    <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
      <Toolbar variant='dense' className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>

        </Typography>
      </Toolbar>
    </AppBar>
  );
}
