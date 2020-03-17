import React from 'react';
import EstateDashboard from './../../components/EstateDashboard/EstateDashboard';
import NavigationModule from './../../components/NavigationModule/NavigationModule';
import { SCREENS } from './../../common/constants';

function EstateScreen() {
  return (
    <div className='screen'>
      <NavigationModule displayTitle={SCREENS.ESTATE}/>
      <EstateDashboard displayTitle={SCREENS.ESTATE}/>
    </div>
  );
}

export default EstateScreen;
