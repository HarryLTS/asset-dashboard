import React from 'react';
import HomeDashboard from './../../components/HomeDashboard/HomeDashboard';
import NavigationModule from './../../components/NavigationModule/NavigationModule';
import { SCREENS } from './../../common/constants';

function HomeScreen() {
  return (
    <div className='screen'>
      <NavigationModule displayTitle={SCREENS.DASHBOARD}/>
      <HomeDashboard displayTitle={SCREENS.DASHBOARD}/>
    </div>
  );
}

export default HomeScreen;
