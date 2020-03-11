import React, { useState } from 'react';
import NavigationBar from './../NavigationBar/NavigationBar';
import ViewAppBar from './../ViewAppBar/ViewAppBar';

export default function NavigationModule(props) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <React.Fragment>
      <ViewAppBar
        drawerOpen={drawerOpen}
        handleDrawerOpen={handleDrawerOpen}
        displayTitle={props.displayTitle}
        />
      <NavigationBar
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        displayTitle={props.displayTitle}
        />
    </React.Fragment>
  );
}
